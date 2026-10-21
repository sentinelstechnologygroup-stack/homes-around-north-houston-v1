/// <reference types="vite/client" />
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification, signOut } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, setDoc, serverTimestamp, runTransaction } from 'firebase/firestore';

// This consumer-only project has no relationship to the GMS staff identity store.
const projectId=import.meta.env.VITE_VISITOR_PROJECT_ID;
export const accountsEnabled=projectId==='gcr-visitor-preview-2026' && Boolean(import.meta.env.VITE_VISITOR_API_KEY && import.meta.env.VITE_VISITOR_APP_ID);
let services;
function service(){
  if(!accountsEnabled)throw new Error('Visitor accounts are not configured in this preview yet.');
  if(!services){
    const app=getApps().find(a=>a.name==='gcr-visitors')||initializeApp({projectId,apiKey:import.meta.env.VITE_VISITOR_API_KEY,appId:import.meta.env.VITE_VISITOR_APP_ID,authDomain:projectId+'.firebaseapp.com'},'gcr-visitors');
    services={auth:getAuth(app),db:getFirestore(app)};
  }
  return services;
}
export function watchAccount(callback){return accountsEnabled?onAuthStateChanged(service().auth,callback):()=>{};}
export async function enterAccount(email,password,register){
  const auth=service().auth;
  if(register){const credential=await createUserWithEmailAndPassword(auth,email,password);await sendEmailVerification(credential.user);return credential.user;}
  return (await signInWithEmailAndPassword(auth,email,password)).user;
}
export async function verifyAccount(){const user=service().auth.currentUser;if(!user)throw new Error('Sign in first.');await sendEmailVerification(user);}
export async function refreshAccount(){const user=service().auth.currentUser;if(!user)return null;await user.reload();await user.getIdToken(true);return user;}
export function resetAccount(email){return sendPasswordResetEmail(service().auth,email);}
export function leaveAccount(){return signOut(service().auth);}
export function watchSaves(user,callback,onError){
  if(!user?.emailVerified)return ()=>{};
  return onSnapshot(doc(service().db,'visitors',user.uid),snapshot=>{const data=snapshot.data()||{};const homes=Array.isArray(data.homes)?data.homes.filter(id=>typeof id==='string' && /^147:[A-Za-z0-9-]{1,50}$/.test(id)).slice(0,50):[]; const searches=Array.isArray(data.searches)?data.searches.filter(s=>s && typeof s.name==='string' && s.name.length<=120 && s.filters && typeof s.filters==='object' && !Array.isArray(s.filters)).map(s=>({name:s.name,filters:Object.fromEntries(Object.entries(s.filters).filter(([k,v])=>['location','minPrice','maxPrice','beds','baths','propertyType','waterfront','newListings','minSqft','bounds','polygon','availability','mapZoom','neighborhood','featuredOnly','minLotSqft','maxLotSqft'].includes(k) && typeof v==='string' && v.length<=(k==='polygon'?6000:200)))})).slice(0,10):[]; callback({homes,searches,weekly:data.weekly!==false});},onError);
}
export async function updateSaves(changes){
  const {auth,db}=service();const user=auth.currentUser;
  if(!user?.emailVerified)throw new Error('Verify your email before saving homes or searches.');
  await setDoc(doc(db,'visitors',user.uid),{...changes,updatedAt:serverTimestamp()},{merge:true});
}
export function accountError(error){
  if(error?.code==='auth/too-many-requests')return 'Please wait before trying again.';
  if(error?.code==='auth/weak-password' || error?.code==='auth/password-does-not-meet-requirements')return 'Use at least 12 characters for your password.';
  if(error?.code==='auth/network-request-failed')return 'Please check your connection and try again.';
  return 'We could not complete that account request. Check your details or reset your password.';
}


export async function continueSave(changes){const {auth,db}=service();if(!auth.currentUser?.emailVerified)throw Error('Verify your email first.');const ref=doc(db,'visitors',auth.currentUser.uid);await runTransaction(db,async transaction=>{const previous=(await transaction.get(ref)).data()||{},next={updatedAt:serverTimestamp()};if(changes.homes)next.homes=[...new Set([...changes.homes,...(previous.homes||[])])].slice(0,50);if(changes.searches)next.searches=[...changes.searches,...(previous.searches||[])].slice(0,10);transaction.set(ref,next,{merge:true});});}
