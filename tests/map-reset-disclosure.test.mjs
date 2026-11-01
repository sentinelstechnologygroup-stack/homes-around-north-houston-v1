import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readableDisclosure} from '../server/repliers.js';
test('encrypted configuration never becomes consumer-facing disclosure',()=>{for(const value of ['eyJ2IjoidjIiLCJjIjoi'+'a'.repeat(400),'a'.repeat(500),'']){assert.match(readableDisclosure(value),/Houston Association/);assert.ok(readableDisclosure(value).length<200);}assert.equal(readableDisclosure('Listing information provided by HAR.'),'Listing information provided by HAR.');});
