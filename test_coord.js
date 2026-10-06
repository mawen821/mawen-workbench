const fs=require('fs');
const citiesPath='C:\\Users\\Lenovo\\WorkBuddy\\2026-07-24-21-08-06\\workspace\\travel-board\\js\\cities.js';
global.window={};
const code=fs.readFileSync(citiesPath,'utf8');
new Function('window', code)(global.window);
const C=global.window.CITY_COORDS;
function coordOf(city){
  if(!city) return null;
  if(C[city]) return C[city];
  var raw=String(city).trim();
  var norm=raw.replace(/^中国/,"").replace(/(市|县|区|镇|盟|自治州|自治区|特别行政区|地区|省|州)$/,"");
  if(norm&&C[norm]) return C[norm];
  var norm2=raw.replace(/^中国/,"").replace(/(州市|省市|自治县|特区|新区)$/,"");
  if(norm2&&C[norm2]) return C[norm2];
  return null;
}
['北京','成都','杭州市','中国香港','北海道','丽江','大理','东京','纽约','重庆市','西安'].forEach(function(c){
  console.log(c, '=>', JSON.stringify(coordOf(c)));
});
console.log('库大小', Object.keys(C).length);
