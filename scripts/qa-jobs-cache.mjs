import { build } from 'esbuild';
import { createContext, runInContext } from 'node:vm';
import { webcrypto } from 'node:crypto';
import assert from 'node:assert/strict';
const result=await build({entryPoints:['src/lib/jobs/source.ts'],bundle:true,platform:'node',format:'cjs',write:false});
let reads=0;const entries=new Map();let fail=false;
const cache={match:async key=>entries.get(key.url)?.clone(),put:async (key,response)=>{assert(!key.url.includes('test-secret'));assert(response.headers.get('cache-control').includes('300'));entries.set(key.url,response.clone());}};
const sandbox={module:{exports:{}},process:{env:{APPS_SCRIPT_URL:'https://example.com/exec',SUBMISSION_SECRET:'test-secret'}},crypto:webcrypto,caches:{default:cache},Request,Response,TextEncoder,AbortSignal,console,
 fetch:async (url,opts)=>{reads++;assert(opts.cache==='no-store');assert(opts.signal);if(fail)return Response.json({ok:false});return Response.json({ok:true,jobs:[{id:'qa',title:'Synthetic vacancy',location:'UK',internal_notes:'PRIVATE-DO-NOT-CACHE'}]});}};
runInContext(result.outputFiles[0].text,createContext(sandbox));const api=sandbox.module.exports;
const first=await api.fetchLiveJobs();const second=await api.fetchLiveJobs();assert.equal(reads,1);assert.equal(first.jobs[0].title,second.jobs[0].title);assert(!JSON.stringify(first).includes('PRIVATE'));entries.clear();fail=true;await api.fetchLiveJobs();await api.fetchLiveJobs();assert.equal(reads,3);assert.equal(entries.size,0);console.log('PASS: warm cache avoids upstream; public fields only; five-minute TTL; failed responses are not cached; bounded requests.');
