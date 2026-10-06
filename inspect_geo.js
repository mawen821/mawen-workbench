const fs=require('fs');
const f='C:\\Users\\Lenovo\\WorkBuddy\\2026-07-24-21-08-06\\workspace\\travel-board\\data\\china.geo.js';
const s=fs.readFileSync(f,'utf8');
console.log('LEN',s.length);
console.log('HEAD', s.slice(0,200));
console.log('assign window.CHINA_GEO =', /window\.CHINA_GEO\s*=/.test(s));
console.log('assign var CHINA_GEO =', /var\s+CHINA_GEO\s*=/.test(s));
console.log('features count', (s.match(/"properties"/g)||[]).length);
