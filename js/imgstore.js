/* ============ 通用图片库（IndexedDB，突破 localStorage 5MB 限制） ============
 * 用法：
 *   - 上传：MWImg.put(dataUrl) -> Promise<id>
 *   - 取图：MWImg.get(id) / MWImg.getMany([id...]) -> Promise<dataUrl|{id:dataUrl}>
 *   - 渲染：把记录里的图片写成 "IMG:<id>"，再用 MWImg.fill(root) 把 <img data-imgid="id"> 填上真实地址
 *   - 备份：exportWorkbench/importWorkbench 会自动调用 packForExport / unpackFromImport
 *          把 "IMG:<id>" 在导出时内联成 {__img__: dataUrl}，导入时还原回新 id，保证换手机图片不丢
 */
(function () {
  "use strict";
  var DB_NAME = "mw_imgstore";
  var STORE = "imgs";
  var VERSION = 1;
  var PREFIX = "IMG:"; // 数据里用 "IMG:<id>" 表示一张图

  var dbp = null;
  function openDB() {
    if (dbp) return dbp;
    dbp = new Promise(function (res, rej) {
      if (!window.indexedDB) { rej(new Error("no indexedDB")); return; }
      var req = indexedDB.open(DB_NAME, VERSION);
      req.onupgradeneeded = function (e) {
        var db = e.target.result;
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: "id" });
      };
      req.onsuccess = function (e) { res(e.target.result); };
      req.onerror = function (e) { rej(e.target.error || new Error("open failed")); };
    });
    return dbp;
  }

  function withStore(mode) {
    return openDB().then(function (db) {
      return db.transaction(STORE, mode).objectStore(STORE);
    });
  }

  function put(dataUrl) {
    return withStore("readwrite").then(function (store) {
      return new Promise(function (res, rej) {
        var id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
        var r = store.put({ id: id, d: dataUrl, t: Date.now() });
        r.onsuccess = function () { res(id); };
        r.onerror = function () { rej(r.error); };
      });
    });
  }

  function get(id) {
    return withStore("readonly").then(function (store) {
      return new Promise(function (res) {
        var r = store.get(id);
        r.onsuccess = function () { res(r.result ? r.result.d : null); };
        r.onerror = function () { res(null); };
      });
    });
  }

  function getMany(ids) {
    return withStore("readonly").then(function (store) {
      return Promise.all(ids.map(function (id) {
        return new Promise(function (res) {
          var r = store.get(id);
          r.onsuccess = function () { res([id, r.result ? r.result.d : null]); };
          r.onerror = function () { res([id, null]); };
        });
      })).then(function (pairs) {
        var m = {};
        pairs.forEach(function (p) { if (p[1]) m[p[0]] = p[1]; });
        return m;
      });
    });
  }

  function del(id) {
    return withStore("readwrite").then(function (store) {
      return new Promise(function (res) {
        var r = store.delete(id);
        r.onsuccess = function () { res(); };
        r.onerror = function () { res(); };
      });
    });
  }

  // 递归收集所有 "IMG:<id>"
  function collectIds(obj) {
    var set = {};
    (function walk(o) {
      if (o == null) return;
      if (typeof o === "string") { if (o.indexOf(PREFIX) === 0) set[o.slice(PREFIX.length)] = 1; return; }
      if (Array.isArray(o)) { o.forEach(walk); return; }
      if (typeof o === "object") { for (var k in o) if (o.hasOwnProperty(k)) walk(o[k]); }
    })(obj);
    return Object.keys(set);
  }

  // 导出：把 "IMG:<id>" 就地替换为 {__img__: dataUrl}
  function packForExport(obj) {
    var ids = collectIds(obj);
    if (ids.length === 0) return Promise.resolve(obj);
    return getMany(ids).then(function (map) {
      (function walk(o) {
        if (o == null || typeof o !== "object") return;
        if (Array.isArray(o)) {
          for (var i = 0; i < o.length; i++) {
            if (typeof o[i] === "string" && o[i].indexOf(PREFIX) === 0) {
              var id = o[i].slice(PREFIX.length); if (map[id]) o[i] = { __img__: map[id] };
            } else walk(o[i]);
          }
          return;
        }
        for (var k in o) {
          if (!o.hasOwnProperty(k)) continue;
          if (typeof o[k] === "string" && o[k].indexOf(PREFIX) === 0) {
            var id2 = o[k].slice(PREFIX.length); if (map[id2]) o[k] = { __img__: map[id2] };
          } else walk(o[k]);
        }
      })(obj);
      return obj;
    });
  }

  // 导入：把 {__img__: dataUrl} 就地还原为 "IMG:<id>"
  function unpackFromImport(obj) {
    var items = [];
    (function walk(o) {
      if (o == null || typeof o !== "object") return;
      if (Array.isArray(o)) {
        for (var i = 0; i < o.length; i++) { if (o[i] && typeof o[i] === "object" && o[i].__img__ != null) items.push(o[i]); else walk(o[i]); }
        return;
      }
      for (var k in o) { if (!o.hasOwnProperty(k)) continue; if (o[k] && typeof o[k] === "object" && o[k].__img__ != null) items.push(o[k]); else walk(o[k]); }
    })(obj);
    if (items.length === 0) return Promise.resolve(obj);
    return Promise.all(items.map(function (it) {
      return put(it.__img__).then(function (nid) { it.__img_id__ = nid; });
    })).then(function () {
      (function walk(o) {
        if (o == null || typeof o !== "object") return;
        if (Array.isArray(o)) {
          for (var i = 0; i < o.length; i++) { if (o[i] && o[i].__img_id__ != null) o[i] = PREFIX + o[i].__img_id__; else walk(o[i]); }
          return;
        }
        for (var k in o) { if (!o.hasOwnProperty(k)) continue; if (o[k] && o[k].__img_id__ != null) o[k] = PREFIX + o[k].__img_id__; else walk(o[k]); }
      })(obj);
      return obj;
    });
  }

  // 渲染便捷：把 root 下所有 <img data-imgid="id"> 填上真实地址（兼容旧 base64 直接写 src 的图）
  function fill(root) {
    root = root || document;
    if (!root.querySelectorAll) return;
    var nodes = root.querySelectorAll("[data-imgid]");
    if (!nodes.length) return;
    var ids = [];
    Array.prototype.forEach.call(nodes, function (n) { var id = n.getAttribute("data-imgid"); if (id) ids.push(id); });
    if (!ids.length) return;
    getMany(ids).then(function (map) {
      Array.prototype.forEach.call(nodes, function (n) {
        var id = n.getAttribute("data-imgid");
        if (map[id]) n.src = map[id];
        n.removeAttribute("data-imgid");
      });
    });
  }

  window.MWImg = {
    put: put, get: get, getMany: getMany, delete: del,
    PREFIX: PREFIX,
    collectIds: collectIds,
    packForExport: packForExport,
    unpackFromImport: unpackFromImport,
    fill: fill
  };
})();
