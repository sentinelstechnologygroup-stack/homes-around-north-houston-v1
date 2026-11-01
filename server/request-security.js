import {createHmac} from 'node:crypto';
const localRates=new Map();
export class RequestError extends Error{constructor(status,message,retryAfter=0){super(message);this.status=status;this.retryAfter=retryAfter;}}
export function parseRequestBody(req,maximum=20000){
 const contentType=String(req.headers?.['content-type']||'').toLowerCase();if(!/^application\/json(?:\s*;|$)/.test(contentType))throw new RequestError(415,'JSON required');
 const length=Number(req.headers?.['content-length']);if(Number.isFinite(length)&&length>maximum)throw new RequestError(413,'Request is too large');
 let body=req.body;try{if(typeof body==='string'){if(Buffer.byteLength(body,'utf8')>maximum)throw Error();body=JSON.parse(body);}if(!body||typeof body!=='object'||Array.isArray(body)||Buffer.byteLength(JSON.stringify(body),'utf8')>maximum)throw Error();
 const stack=[[body,0]];while(stack.length){const [node,depth]=stack.pop();if(depth>8)throw Error();for(const [key,value] of Object.entries(node)){if(['__proto__','constructor','prototype'].includes(key))throw Error();if(value&&typeof value==='object'){if(Array.isArray(value)&&value.length>100)throw Error();stack.push([value,depth+1]);}}}
 }catch{throw new RequestError(400,'Invalid request');}return body;
}
export function localRate(req,scope,limit,windowMs=600000,now=Date.now()){
 for(const [key,entry]of localRates)if(entry.until<=now)localRates.delete(key);
 const ip=String(req.headers?.['x-vercel-forwarded-for']||req.headers?.['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0].trim().slice(0,100),key=scope+':'+ip,prior=localRates.get(key);
 if(!prior&&localRates.size>=2000)throw new RequestError(429,'Please wait before trying again.',60);
 const entry=prior||{count:0,until:now+windowMs};entry.count++;localRates.set(key,entry);if(entry.count>limit)throw new RequestError(429,'Please wait before trying again.',Math.max(1,Math.ceil((entry.until-now)/1000)));
}
const sorted=value=>value&&typeof value==='object'?(Array.isArray(value)?value.map(sorted):Object.fromEntries(Object.keys(value).sort().map(key=>[key,sorted(value[key])]))):value;
export function fingerprint(body,token){return createHmac('sha256',token).update(JSON.stringify(sorted(body))).digest('hex');}
async function callGuard(payload,env,fetcher){
 const url=env.GMS_INTAKE_GUARD_URL,token=env.GMS_INTAKE_GUARD_TOKEN||env.GMS_SEARCH_INTAKE_TOKEN;
 if(!url||!token){if(env.GMS_INTAKE_GUARD_REQUIRED==='true')throw new RequestError(503,'Online inquiries are temporarily unavailable. Please contact the office.');return null;}
 let endpoint;try{endpoint=new URL(url);if(endpoint.protocol!=='https:'||!/(?:\.a\.run\.app|\.cloudfunctions\.net)$/.test(endpoint.hostname))throw Error();}catch{throw new RequestError(503,'Intake protection is not configured. Please contact the office.');}
 let response,data;try{response=await fetcher(endpoint.href,{method:'POST',redirect:'error',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify(payload),signal:AbortSignal.timeout(10000)});data=await response.json();}catch{throw new RequestError(503,'We could not safely confirm this request. Please contact the office before resubmitting.');}
 if(!response.ok)throw new RequestError([409,429].includes(response.status)?response.status:503,data.error||'Intake temporarily unavailable',Number(data.retryAfter)||0);return data;
}
export async function beginIntake(req,{site,scope,body,submissionId,rateOnly=false},env=process.env,fetcher=fetch){
 const token=env.GMS_INTAKE_GUARD_TOKEN||env.GMS_SEARCH_INTAKE_TOKEN||'',ip=String(req.headers?.['x-vercel-forwarded-for']||req.headers?.['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0].trim().slice(0,100);
 const data=await callGuard({op:rateOnly?'rate':'claim',site,scope,clientKey:fingerprint(ip,token),...(rateOnly?{}:{submissionId,fingerprint:fingerprint(body,token)})},env,fetcher);
 if(!data)return {claim:null,replay:null,distributed:false};
 if(data.replay){if(data.replay.status!==202||data.replay.body?.accepted!==true||typeof data.replay.body.reference!=='string'||!data.replay.body.reference||data.replay.body.reference.length>160)throw new RequestError(503,'Intake protection returned an invalid receipt.');return {claim:null,replay:data.replay,distributed:true};}
 if(data.allowed!==true||!rateOnly&&(!/^[a-f0-9]{64}$/.test(data.claimId||'')||!/^[-a-f0-9]{36}$/i.test(data.lockId||'')))throw new RequestError(503,'Intake protection could not confirm this request.');
 return {claim:rateOnly?null:{site,scope,claimId:data.claimId,lockId:data.lockId},replay:null,distributed:true};
}
export async function finishIntake(guard,state,response=null,env=process.env,fetcher=fetch){if(!guard?.claim)return;await callGuard({op:'finish',...guard.claim,state,...(state==='complete'?{response}:{})},env,fetcher);}
export async function uncertainIntake(guard){try{await finishIntake(guard,'uncertain');}catch{/* Keep claimed requests held rather than automatically resending. */}}
export function sendRequestError(res,error){const status=error instanceof RequestError?error.status:400;if(error.retryAfter)res.setHeader('Retry-After',String(error.retryAfter));return res.status(status).json({error:error.message||'Invalid request'});}
export async function verifyBotToken(body,origin,env=process.env,fetcher=fetch){
 if(!env.TURNSTILE_SECRET_KEY)return false;
 if(typeof body.turnstileToken!=='string'||!body.turnstileToken||body.turnstileToken.length>2048)throw new RequestError(400,'Please complete the verification challenge.');
 let result;try{const r=await fetcher('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',redirect:'error',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({secret:env.TURNSTILE_SECRET_KEY,response:body.turnstileToken}),signal:AbortSignal.timeout(8000)});result=await r.json();if(!r.ok||result.success!==true||result.hostname!==new URL(origin).hostname)throw Error();}catch{throw new RequestError(400,'Verification could not be confirmed. Please try again.');}return true;
}
