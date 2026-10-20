// Local-only synthetic UI fixture; stores nothing and calls no delivery service.
import { createServer } from 'vite';
const app=await createServer({plugins:[{name:'synthetic-intake-only',configureServer(server){server.middlewares.use('/api/lead',async(req,res)=>{for await(const _chunk of req){}res.setHeader('Content-Type','application/json');res.statusCode=202;res.end(JSON.stringify({accepted:true,reference:'LOCAL-SYNTHETIC-ONLY',sessionId:'a'.repeat(64),sessionToken:'b'.repeat(64),state:'contact_captured'}));});}}],server:{host:'127.0.0.1',port:4196,strictPort:true}});
await app.listen();console.log('Synthetic local UI fixture: http://127.0.0.1:4196. No delivery integrations connected.');
