import {probeIntake} from './check-contact-intake.mjs';
if(process.env.VERCEL_ENV==='production'){await probeIntake(process.env);console.log('Non-delivering contact intake readiness probe passed.');}
