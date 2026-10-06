const fs=require('fs');
const f='C:\\Users\\Lenovo\\WorkBuddy\\2026-07-24-21-08-06\\workspace\\travel-board\\js\\echarts.min.js';
const s=fs.readFileSync(f,'utf8');
console.log('SIZE',s.length);
console.log('HEAD',s.slice(0,80));
console.log('has echarts global assign', /window\.echarts|exports\.echarts|this\.echarts|global\.echarts/.test(s.slice(0,3000)));
console.log('contains .init=', /\.init=function|\.init=function/.test(s));
