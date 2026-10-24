import {pathToFileURL} from 'node:url';
const required=['LEAD_WEBHOOK_URL','LEAD_WEBHOOK_TOKEN','GMS_LEAD_ROUTE_KEY','GMS_INTAKE_GUARD_URL','GMS_INTAKE_GUARD_TOKEN','GMS_INTAKE_GUARD_REQUIRED'];
export function intakeEnvironment(env){
 const missing=required.filter(key=>!String(env[key]||'').trim());
 if(missing.length)throw new Error('Missing intake settings: '+missing.join(', '));
 if(env.GMS_INTAKE_GUARD_REQUIRED!=='true')throw new Error('Distributed intake protection must be required.');
 const url=new URL(env.LEAD_WEBHOOK_URL);
 const approved=url.protocol==='https:'&&((url.hostname==='us-central1-gms-prod-1089114348316.cloudfunctions.net'&&url.pathname==='/ingestWebsiteLead')||(url.hostname==='ingestwebsitelead-bsy3o4ymea-uc.a.run.app'&&url.pathname==='/'));
 if(!approved)throw new Error('Intake endpoint is outside the reviewed production binding.');
 return url.href;
}
export async function probeIntake(env,fetcher=fetch){
 const url=intakeEnvironment(env);
 // Deliberately invalid contact content: reaches auth/route readiness but cannot create a lead, email, notification or call.
 const response=await fetcher(url,{method:'POST',redirect:'error',headers:{'Content-Type':'application/json',Authorization:'Bearer '+env.LEAD_WEBHOOK_TOKEN,'x-gms-route-key':env.GMS_LEAD_ROUTE_KEY},body:'{}',signal:AbortSignal.timeout(30000)});
 const body=await response.json().catch(()=>({}));
 if(response.status!==400||body.error!=='Email or phone is required')throw new Error('Intake release probe failed (HTTP '+response.status+'). Check authentication and route readiness without changing approval safeguards.');
 return true;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 try{intakeEnvironment(process.env);if(!process.argv.includes('--env-only'))await probeIntake(process.env);console.log(process.argv.includes('--env-only')?'Required contact intake settings are present.':'Non-delivering contact intake readiness probe passed.');}
 catch(error){console.error(error.message?.startsWith('Missing intake')?error.message:'Contact intake readiness check failed. Review configuration and backend readiness. No secrets were logged.');process.exitCode=1;}
}
