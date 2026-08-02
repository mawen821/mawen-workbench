/* ===================== 我的旅行地图 · 逻辑 ===================== */
(function(){
  "use strict";

  var KEY = "travelBoard.v1";
  var MOODS = ["😍","😊","🤩","😌","😎","🥰","🤔","😮‍💨","🥺","🙏","🌟","😭"];
  var MOOD_LABEL = {
    "😍":"热爱","😊":"开心","🤩":"兴奋","😌":"平静","😎":"酷","🥰":"甜蜜",
    "🤔":"探索","😮‍💨":"疲惫","🥺":"怀念","🙏":"感恩","🌟":"惊喜","😭":"感动"
  };

  // 省份查找表
  var PROV = {};
  (window.CITY_DATA || []).forEach(function(c){ if(!PROV[c.n]) PROV[c.n]=c.p; });

  // ---------- 状态 ----------
  var records = load();
  var filter = "all";
  var query = "";
  var chart = null;

  // 表单临时态
  var formStatus = "visited";
  var formMood = "";
  var formAttractions = [];
  var formPhotos = [];
  var editingId = null;

  // ---------- 工具 ----------
  function $(id){ return document.getElementById(id); }
  function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,7); }
  function esc(s){ return (s==null?"":String(s)).replace(/[&<>"]/g,function(m){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m];}); }
  function load(){ try{ return JSON.parse(localStorage.getItem(KEY)) || []; }catch(e){ return []; } }
  function save(){
    try{
      localStorage.setItem(KEY, JSON.stringify(records));
      updateStorageInfo();
    }catch(e){
      toast("⚠️ 保存失败：本地存储空间可能已满。请导出备份或删除部分照片。");
    }
  }
  function toast(msg){
    var t = $("toast"); t.textContent = msg; t.hidden = false;
    clearTimeout(t._t); t._t = setTimeout(function(){ t.hidden = true; }, 2600);
  }
  // 旅行照片渲染：旧数据可能是 base64（直接 src），新数据为 "IMG:<id>"（异步取图）
  function tbPhoto(p){
    if(typeof p === "string" && p.indexOf("data:") === 0) return '<img src="'+p+'" onclick="openLightbox(\''+encodeURIComponent(p)+'\')">';
    if(typeof p === "string" && p.indexOf(MWImg.PREFIX) === 0) return '<img data-imgid="'+p.slice(MWImg.PREFIX.length)+'" onclick="tbOpenImg(\''+p+'\')">';
    return "";
  }
  window.tbOpenImg = function(ref){
    var id = ref.slice(MWImg.PREFIX.length);
    MWImg.get(id).then(function(src){ if(src) openLightbox(encodeURIComponent(src)); });
  };
  function coordOf(city){ return window.CITY_COORDS && window.CITY_COORDS[city]; }

  // 照片压缩（仅存本机）
  function compressImage(file){
    return new Promise(function(res, rej){
      var fr = new FileReader();
      fr.onload = function(){
        var img = new Image();
        img.onload = function(){
          var w = img.width, h = img.height, max = 1200;
          if(w > h && w > max){ h = Math.round(h*max/w); w = max; }
          else if(h > max){ w = Math.round(w*max/h); h = max; }
          var c = document.createElement("canvas"); c.width = w; c.height = h;
          c.getContext("2d").drawImage(img, 0, 0, w, h);
          try{ res(c.toDataURL("image/jpeg", 0.72)); }catch(e){ rej(e); }
        };
        img.onerror = rej; img.src = fr.result;
      };
      fr.onerror = rej; fr.readAsDataURL(file);
    });
  }

  // ---------- 统计 ----------
  function updateStats(){
    var visitedCities = {}, plannedCities = {}, futureCities = {}, spots = 0;
    records.forEach(function(r){
      if(r.status === "visited") visitedCities[r.city] = 1;
      else if(r.status === "planned") plannedCities[r.city] = 1;
      else if(r.status === "future") futureCities[r.city] = 1;
      (r.attractions||[]).forEach(function(){ spots++; });
    });
    $("stat-visited").textContent = Object.keys(visitedCities).length;
    $("stat-planned").textContent = Object.keys(plannedCities).length;
    $("stat-future").textContent = Object.keys(futureCities).length;
    $("stat-spots").textContent = spots;
    $("stat-trips").textContent = records.length;
  }
  function updateStorageInfo(){
    var bytes = new Blob([JSON.stringify(records)]).size;
    var mb = (bytes/1048576).toFixed(2);
    $("storage-info").textContent = "本机占用 " + mb + " MB";
  }

  // ---------- 地图 ----------
  function initMap(){
    if(!window.echarts || !window.CHINA_GEO){ return; }
    chart = echarts.init($("map"));
    echarts.registerMap("china", window.CHINA_GEO);
    chart.on("click", function(p){
      if(p.componentType === "series" && p.data && p.data.city){ openDetail(p.data.city); }
    });
    window.addEventListener("resize", function(){ if(chart) chart.resize(); });
    renderMap();
  }

  // 按城市聚合
  function aggregate(){
    var map = {};
    records.forEach(function(r){
      if(!map[r.city]) map[r.city] = { city:r.city, visited:0, planned:0, future:0, latest:null, moods:{} };
      var g = map[r.city];
      if(r.status === "visited"){ g.visited++; if(r.mood) g.moods[r.mood]=(g.moods[r.mood]||0)+1; }
      else if(r.status === "planned") g.planned++;
      else if(r.status === "future") g.future++;
      if(r.date){
        if(!g.latest || r.date > g.latest) g.latest = r.date;
      }
    });
    return map;
  }

  function renderMap(){
    if(!chart) return;
    var agg = aggregate();
    var visitedData = [], plannedData = [];
    Object.keys(agg).forEach(function(city){
      var c = coordOf(city);
      if(!c) return; // 无坐标则不在地图点亮
      var g = agg[city];
      var isVisited = g.visited > 0;
      var item = {
        name: city,
        value: c.concat(isVisited ? g.visited : (g.future>0 ? g.future : g.planned)),
        city: city
      };
      (isVisited ? visitedData : plannedData).push(item);
    });

    chart.setOption({
      backgroundColor: "transparent",
      tooltip: {
        trigger: "item",
        formatter: function(p){
          if(p.data && p.data.city){
            var g = agg[p.data.city]; if(!g) return p.name;
            var st = g.visited>0 ? "✨ 已去过 " + g.visited + " 次" : (g.future>0 ? "🔮 未来去" : "📌 计划中");
            var mood = "";
            if(g.visited>0){ var top = Object.keys(g.moods).sort(function(a,b){return g.moods[b]-g.moods[a];})[0]; if(top) mood = "　心情 " + top; }
            return "<b>" + p.name + "</b><br>" + st + mood + (g.latest? "<br>最近：" + g.latest : "");
          }
          return p.name;
        }
      },
      geo: {
        map: "china",
        roam: true,
        zoom: 1.18,
        scaleLimit:{ min:1, max:8 },
        itemStyle: { areaColor:"#f4f0e8", borderColor:"#cfc7b6", borderWidth:0.6 },
        emphasis: { itemStyle:{ areaColor:"#ffe6cf" }, label:{ show:false } },
        label: { show:false },
        regions: [ { name:"南海诸岛", itemStyle:{opacity:0}, label:{show:false} } ]
      },
      series: [
        {
          name:"计划中/未来去", type:"scatter", coordinateSystem:"geo", data: plannedData,
          symbol:"circle", symbolSize: 11,
          itemStyle:{ color:"#5b8def", borderColor:"#fff", borderWidth:1.5 },
          label:{ show:true, formatter:"{b}", position:"right", color:"#3a5a8f", fontSize:10, fontWeight:"bold" },
          emphasis:{ scale:1.4 },
          z: 5
        },
        {
          name:"已去过", type:"effectScatter", coordinateSystem:"geo", data: visitedData,
          symbol:"pin", symbolSize: 24,
          showEffectOn:"render",
          rippleEffect:{ brushType:"stroke", scale: 3, period: 4 },
          itemStyle:{ color:"#ffb02e", shadowBlur:8, shadowColor:"rgba(255,176,46,.6)" },
          label:{ show:true, formatter:"{b}", position:"top", color:"#7a4d00", fontSize:11, fontWeight:"bold" },
          emphasis:{ label:{ show:true } },
          z: 10
        }
      ]
    }, true);
  }

  // 复位地图视图
  function resetMapView(){
    if(!chart) return;
    chart.setOption({ geo:{ center:[104,36], zoom:1.18 } });
  }

  // ---------- 卡片 ----------
  function renderCards(){
    var box = $("cards");
    var list = records.slice().filter(function(r){
      if(filter === "visited" && r.status !== "visited") return false;
      if(filter === "planned" && r.status !== "planned") return false;
      if(filter === "future" && r.status !== "future") return false;
      if(query){
        var hay = (r.city + " " + (r.province||"") + " " + (r.companions||"") + " " + (r.note||"") + " " + (r.attractions||[]).join(" ")).toLowerCase();
        if(hay.indexOf(query.toLowerCase()) < 0) return false;
      }
      return true;
    });
    // 排序：去过按日期倒序；计划放后面
    list.sort(function(a,b){
      var da = a.date || "0000-00-00", db = b.date || "0000-00-00";
      if(a.status !== b.status) return a.status === "visited" ? -1 : 1;
      return db.localeCompare(da);
    });

    if(list.length === 0){
      box.innerHTML = '<div class="empty">还没有记录哦～点击右上角「＋ 添加旅行」<br>写下你想去或已经去过的城市，地图就会亮起一颗小图标 ✨</div>';
      return;
    }

    box.innerHTML = list.map(function(r){
      var prov = r.province ? '<span class="c-prov">'+esc(r.province)+'</span>' : "";
      var badge = r.status === "visited"
        ? '<span class="badge visited">✨ 已去过</span>'
        : (r.status === "future"
          ? '<span class="badge planned">🔮 未来去</span>'
          : '<span class="badge planned">📌 计划中</span>');
      var mood = r.mood ? '<div class="c-mood">'+esc(r.mood)+'</div>' : "";
      var comp = r.companions ? '<div class="c-meta"><span class="ic">👯</span>'+esc(r.companions)+'</div>' : "";
      var chips = (r.attractions||[]).length
        ? '<div class="chips">'+r.attractions.map(function(a){return '<span class="chip-sm">📍 '+esc(a)+'</span>';}).join("")+'</div>' : "";
      var note = r.note ? '<div class="c-note">'+esc(r.note)+'</div>' : "";
      var thumbs = (r.photos||[]).slice(0,4).map(function(p){return tbPhoto(p);}).join("");
      thumbs = thumbs ? '<div class="thumbs">'+thumbs+'</div>' : "";
      var date = r.date ? '<span class="c-date">📅 '+esc(r.date)+'</span>' : '<span class="c-date">未填日期</span>';
      return ''+
        '<div class="card">'+
          '<div class="c-top"><span class="c-city" onclick="openDetail(\''+esc(r.city)+'\')">'+esc(r.city)+'</span>'+prov+badge+date+'</div>'+
          mood+comp+chips+note+thumbs+
          '<div class="c-actions">'+
            '<button class="mini" onclick="openDetail(\''+esc(r.city)+'\')">查看</button>'+
            '<button class="mini" onclick="editTrip(\''+r.id+'\')">编辑</button>'+
            '<button class="mini" onclick="deleteTrip(\''+r.id+'\')">删除</button>'+
          '</div>'+
        '</div>';
    }).join("");
    MWImg.fill(box);
  }

  function renderAll(){ updateStats(); renderMap(); renderCards(); }

  // ---------- 弹窗：添加/编辑 ----------
  function buildMoodPicker(){
    $("f-mood").innerHTML = MOODS.map(function(m){
      return '<button type="button" class="mood" data-m="'+m+'" title="'+(MOOD_LABEL[m]||"")+'">'+m+'</button>';
    }).join("");
    Array.prototype.forEach.call($("f-mood").children, function(b){
      b.onclick = function(){
        formMood = (formMood === b.dataset.m) ? "" : b.dataset.m;
        Array.prototype.forEach.call($("f-mood").children, function(x){ x.classList.toggle("active", x.dataset.m === formMood); });
      };
    });
  }

  function setStatus(val){
    formStatus = val;
    Array.prototype.forEach.call($("f-status").children, function(b){
      b.classList.toggle("active", b.dataset.val === val);
    });
  }

  function renderFormTags(){
    $("f-attractions").innerHTML = formAttractions.map(function(a,i){
      return '<span class="tag">'+esc(a)+'<b onclick="removeAttraction('+i+')">✕</b></span>';
    }).join("");
  }
  window.removeAttraction = function(i){ formAttractions.splice(i,1); renderFormTags(); };

  function renderFormPhotos(){
    $("f-photos").innerHTML = formPhotos.map(function(p,i){
      return '<div class="photo-x">'+tbPhoto(p)+'<span onclick="removePhoto('+i+')">✕</span></div>';
    }).join("");
    MWImg.fill($("f-photos"));
  }
  window.removePhoto = function(i){
    var p = formPhotos[i];
    if(typeof p === "string" && p.indexOf(MWImg.PREFIX) === 0) MWImg.delete(p.slice(MWImg.PREFIX.length));
    formPhotos.splice(i,1); renderFormPhotos();
  };

  function openModal(rec){
    editingId = rec ? rec.id : null;
    $("modal-title").textContent = rec ? "编辑旅行记录" : "添加一次旅行";
    $("f-id").value = rec ? rec.id : "";
    $("f-city").value = rec ? rec.city : "";
    setStatus(rec ? rec.status : "visited");
    $("f-date").value = rec ? (rec.date || "") : "";
    formMood = rec ? (rec.mood || "") : "";
    Array.prototype.forEach.call($("f-mood").children, function(x){ x.classList.toggle("active", x.dataset.m === formMood); });
    $("f-companions").value = rec ? (rec.companions || "") : "";
    formAttractions = rec ? (rec.attractions || []).slice() : [];
    formPhotos = rec ? (rec.photos || []).slice() : [];
    $("f-note").value = rec ? (rec.note || "") : "";
    renderFormTags(); renderFormPhotos();
    $("modal").hidden = false;
  }
  function closeModal(){ $("modal").hidden = true; }

  // ---------- 弹窗：城市详情 ----------
  function openDetail(city){
    var rs = records.filter(function(r){ return r.city === city; });
    if(rs.length === 0){ toast("「"+city+"」暂无可显示记录"); return; }
    var prov = rs[0].province || PROV[city] || "";
    var visited = rs.filter(function(r){return r.status==="visited";}).length;
    var planned = rs.length - visited;
    var html = '<div class="d-sub">'+esc(prov)+(prov?" · ":"")+(visited?("已去过 "+visited+" 次"):"")+(planned?("　计划中 "+planned+" 次"):"")+'</div>';
    rs.sort(function(a,b){ var da=a.date||"", db=b.date||""; return db.localeCompare(da); });
    html += rs.map(function(r){
      var badge = r.status === "visited" ? '<span class="badge visited">✨ 已去过</span>' : (r.status === "future" ? '<span class="badge planned">🔮 未来去</span>' : '<span class="badge planned">📌 计划中</span>');
      var mood = r.mood ? '<span class="t-mood">'+esc(r.mood)+'</span>' : '<span class="t-mood">📍</span>';
      var date = r.date ? '<span class="t-date">📅 '+esc(r.date)+'</span>' : '<span class="t-date">未填日期</span>';
      var comp = r.companions ? '<div class="t-meta"><span class="ic">👯</span>'+esc(r.companions)+'</div>' : "";
      var chips = (r.attractions||[]).length ? '<div class="chips">'+r.attractions.map(function(a){return '<span class="chip-sm">📍 '+esc(a)+'</span>';}).join("")+'</div>' : "";
      var note = r.note ? '<div class="t-note">'+esc(r.note)+'</div>' : "";
      var gal = (r.photos||[]).length
        ? '<div class="gallery">'+r.photos.map(function(p){return tbPhoto(p);}).join("")+'</div>' : "";
      return '<div class="trip">'+
        '<div class="t-head">'+mood+'<div><div style="font-weight:700">'+esc(r.city)+'</div>'+badge+'</div>'+date+'</div>'+
        comp+chips+note+gal+
        '<div class="t-actions"><button class="mini" onclick="editTrip(\''+r.id+'\')">编辑</button><button class="mini" onclick="deleteTrip(\''+r.id+'\')">删除</button></div>'+
      '</div>';
    }).join("");
    $("detail-title").textContent = city;
    $("detail-body").innerHTML = html;
    MWImg.fill($("detail-body"));
    $("detail").hidden = false;
  }
  window.openDetail = openDetail;

  window.editTrip = function(id){
    var r = records.find(function(x){ return x.id === id; });
    if(!r) return;
    $("detail").hidden = true; $("review").hidden = true;
    openModal(r);
  };
  window.deleteTrip = function(id){
    if(!confirm("确定删除这条旅行记录吗？此操作不可撤销。")) return;
    var r = records.find(function(x){ return x.id === id; });
    if(r && r.photos){ r.photos.forEach(function(p){ if(typeof p==="string" && p.indexOf(MWImg.PREFIX)===0) MWImg.delete(p.slice(MWImg.PREFIX.length)); }); }
    records = records.filter(function(x){ return x.id !== id; });
    save(); renderAll();
    toast("已删除");
  };

  // ---------- 回顾 ----------
  function openReview(){
    var visited = records.filter(function(r){ return r.status === "visited"; });
    var planned = records.filter(function(r){ return r.status === "planned" || r.status === "future"; });
    var html = "";

    // 按年
    var byYear = {};
    visited.forEach(function(r){ var y=(r.date||"").slice(0,4); if(!y) y="未标注"; (byYear[y]=byYear[y]||[]).push(r); });
    var years = Object.keys(byYear).sort().reverse();
    html += "<h3>🗓️ 按年份回顾（已去过的城市）</h3>";
    if(years.length === 0) html += '<div class="empty">还没有「已去过」的记录，先去点亮一座城市吧！</div>';
    years.forEach(function(y){
      var cities = []; byYear[y].forEach(function(r){ if(cities.indexOf(r.city)<0) cities.push(r.city); });
      html += '<div class="year-block"><div class="y-title">'+esc(y)+' 年 · '+cities.length+' 座城市</div>'+
              '<div class="y-cities">'+cities.map(esc).join("、")+'</div></div>';
    });

    // 心情
    var moodCount = {};
    visited.forEach(function(r){ if(r.mood) moodCount[r.mood]=(moodCount[r.mood]||0)+1; });
    var moodKeys = Object.keys(moodCount).sort(function(a,b){return moodCount[b]-moodCount[a];});
    html += "<h3>💗 心情分布</h3>";
    html += moodKeys.length
      ? '<div class="mood-line">'+moodKeys.map(function(m){return '<span>'+m+'<i>'+(MOOD_LABEL[m]||"")+' '+moodCount[m]+'</i></span>';}).join("")+'</div>'
      : '<div class="empty">还没有记录心情～</div>';

    // 未来计划
    html += "<h3>📌 未来想去</h3>";
    html += planned.length
      ? '<div class="chips">'+planned.map(function(r){return '<span class="chip-sm">🌟 '+esc(r.city)+'</span>';}).join("")+'</div>'
      : '<div class="empty">还没有计划中的目的地。</div>';

    // 照片墙
    var allPhotos = [];
    records.forEach(function(r){ (r.photos||[]).forEach(function(p){ allPhotos.push(p); }); });
    html += "<h3>🖼️ 回忆照片墙（"+allPhotos.length+" 张）</h3>";
    html += allPhotos.length
      ? '<div class="rev-gallery">'+allPhotos.map(function(p){return tbPhoto(p);}).join("")+'</div>'
      : '<div class="empty">还没有上传照片。</div>';

    $("review-body").innerHTML = html;
    MWImg.fill($("review-body"));
    $("review").hidden = false;
  }

  // ---------- 大图预览 ----------
  window.openLightbox = function(enc){
    var src = decodeURIComponent(enc);
    var lb = document.createElement("div");
    lb.className = "lightbox"; lb.onclick = function(){ lb.remove(); };
    var im = document.createElement("img"); im.src = src;
    lb.appendChild(im); document.body.appendChild(lb);
  };

  // ---------- 导入导出 ----------
  function exportData(){
    if(records.length === 0){ toast("还没有数据可导出"); return; }
    // 深拷贝后把图片引用内联进备份（换手机图片不丢）
    MWImg.packForExport(JSON.parse(JSON.stringify(records))).then(function(data){
      var blob = new Blob([JSON.stringify(data, null, 2)], {type:"application/json"});
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "我的旅行地图-备份-"+new Date().toISOString().slice(0,10)+".json";
      a.click();
      setTimeout(function(){ URL.revokeObjectURL(a.href); }, 1000);
      toast("已导出备份文件");
    }).catch(function(){ toast("⚠️ 导出失败"); });
  }
  function importData(file){
    var fr = new FileReader();
    fr.onload = function(){
      try{
        var data = JSON.parse(fr.result);
        if(!Array.isArray(data)) throw 0;
        if(!confirm("导入将【合并】到当前数据（相同 id 会覆盖）。继续？")) return;
        // 把内联图片还原回 IndexedDB，记录只留 "IMG:<id>" 引用
        MWImg.unpackFromImport(data).then(function(real){
          real.forEach(function(r){
            if(!r.id) r.id = uid();
            var i = records.findIndex(function(x){ return x.id === r.id; });
            if(i >= 0) records[i] = r; else records.push(r);
          });
          save(); renderAll();
          toast("导入成功，共 "+real.length+" 条");
        }).catch(function(){ toast("⚠️ 文件格式不正确"); });
      }catch(e){ toast("⚠️ 文件格式不正确"); }
    };
    fr.readAsText(file);
  }

  // ---------- 事件绑定 ----------
  function bind(){
    // 城市 datalist
    $("city-list").innerHTML = (window.CITY_NAMES||[]).map(function(n){ return '<option value="'+esc(n)+'">'; }).join("");

    $("btn-add").onclick = function(){ openModal(null); };
    $("modal-close").onclick = closeModal;
    $("modal-cancel").onclick = closeModal;
    $("detail-close").onclick = function(){ $("detail").hidden = true; };
    $("review-close").onclick = function(){ $("review").hidden = true; };
    $("btn-review").onclick = openReview;
    $("btn-export").onclick = exportData;
    $("btn-import").onclick = function(){ $("file-import").click(); };
    $("file-import").onchange = function(e){ if(e.target.files[0]) importData(e.target.files[0]); e.target.value=""; };

    // 状态分段
    Array.prototype.forEach.call($("f-status").children, function(b){
      b.onclick = function(){ setStatus(b.dataset.val); };
    });

    // 景点标签
    $("f-attraction-input").addEventListener("keydown", function(e){
      if(e.key === "Enter"){
        e.preventDefault();
        var v = this.value.trim();
        if(v && formAttractions.indexOf(v) < 0){ formAttractions.push(v); renderFormTags(); }
        this.value = "";
      }
    });

    // 照片上传（压缩后存入 IndexedDB，记录只留 "IMG:<id>" 引用）
    $("f-photo-input").addEventListener("change", function(e){
      var files = Array.prototype.slice.call(e.target.files || []);
      if(files.length === 0) return;
      Promise.all(files.map(compressImage)).then(function(arr){
        return Promise.all(arr.map(function(d){ return MWImg.put(d).then(function(id){ return MWImg.PREFIX + id; }); }));
      }).then(function(ids){
        ids.forEach(function(id){ formPhotos.push(id); });
        renderFormPhotos();
        toast("已添加 "+ids.length+" 张照片（已压缩）");
      }).catch(function(){ toast("部分照片处理失败"); });
      e.target.value = "";
    });

    // 表单提交
    $("trip-form").addEventListener("submit", function(e){
      e.preventDefault();
      var city = $("f-city").value.trim();
      if(!city){ toast("请填写城市名称"); return; }
      var rec = {
        id: editingId || uid(),
        city: city,
        province: PROV[city] || "",
        status: formStatus,
        date: $("f-date").value || "",
        mood: formMood,
        companions: $("f-companions").value.trim(),
        attractions: formAttractions.slice(),
        note: $("f-note").value.trim(),
        photos: formPhotos.slice(),
        updatedAt: Date.now()
      };
      if(!editingId){ rec.createdAt = Date.now(); records.push(rec); }
      else { var i = records.findIndex(function(x){return x.id===editingId;}); if(i>=0) records[i]=rec; }
      save(); renderAll();
      closeModal();
      toast(formStatus === "visited" ? "🌟 已在地图上点亮 "+city+"！" : "📌 已加入计划："+city);
    });

    // 过滤 / 搜索
    Array.prototype.forEach.call($("filters").children, function(b){
      b.onclick = function(){
        filter = b.dataset.filter;
        Array.prototype.forEach.call($("filters").children, function(x){ x.classList.toggle("active", x===b); });
        renderCards();
      };
    });
    var st;
    $("search").addEventListener("input", function(){ clearTimeout(st); st = setTimeout(function(){ query = this.value; renderCards(); }, 200); });

    // 点击遮罩关闭
    ["modal","detail","review"].forEach(function(id){
      $(id).addEventListener("click", function(e){ if(e.target === this) this.hidden = true; });
    });
    document.addEventListener("keydown", function(e){ if(e.key === "Escape"){ $("modal").hidden=$("detail").hidden=$("review").hidden=true; } });
  }

  // ---------- 启动 ----------
  buildMoodPicker();
  bind();
  initMap();
  renderAll();

})();
