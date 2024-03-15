export function timeFix() {
  const time = new Date();
  const hour = time.getHours();
  return hour < 9
    ? "早上好"
    : hour <= 11
    ? "上午好"
    : hour <= 13
    ? "中午好"
    : hour < 20
    ? "下午好"
    : "晚上好";
}

export function isIE() {
  const bw = window.navigator.userAgent;
  const compare = (s) => bw.indexOf(s) >= 0;
  const ie11 = (() => "ActiveXObject" in window)();
  return compare("MSIE") || ie11;
}
/**
 * 是否邮箱
 */
export function isEmail(value, callback) {
  const reg = /^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/;
  if (value == "" || value == undefined || value == null) {
    return true;
  } else {
    if (!reg.test(value)) {
      var msg = "请输入正确的邮箱地址";
      callback(msg);
      return false;
    } else {
      return true;
    }
  }
}

export function refreshMenus() {
  getInfo().then((res) => {
    const permissions = res.data && res.data.permissions;
    store.dispatch("GetLatestRoutes", { permissions }).then((r) => {});
  });
}

/**
 * 获取树型接口的key，包括Children
 * @param {*} data 原始数据
 * @param {*} keys 要返回的key
 */
export function expandKeys(data, keys = []) {
  data.map((item) => {
    keys.push(item._id || item.id);
    if (item.children !== undefined) {
      expandKeys(item.children, keys);
    }
  });
}

/**
 * 普通数组转树级数组
 * @param {*} data 原始数组
 * @param {*} id id
 * @param {*} pid 父级id
 */
export function arrToTree(data, id, pid) {
  let result = [];
  if (!Array.isArray(data)) {
    return result;
  }
  data.forEach((item) => {
    delete item.children;
  });
  let map = {};
  data.forEach((item) => {
    map[item[id]] = item;
  });
  data.forEach((item) => {
    let parent = map[item[pid]];
    if (parent) {
      (parent.children || (parent.children = [])).push(item);
    } else {
      result.push(item);
    }
  });
  return result;
}

/**
 * 获取图片宽高
 * @param {*} file 图片源文件
 * @param {*} mode 模式 1 宽高是否符合规则 2 宽高是否相等 3 获取图片宽高
 * @param {*} width 图片宽
 * @param {*} height 图片高
 * @returns {*}
 */
export function calculateImageSize({ file, mode = 3, width, height }) {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      var img = new Image();
      img.src = reader.result;
      if (img.complete) {
        if (mode === 1) {
          img.width === width && img.height === height
            ? resolve(true)
            : resolve(false);
        }
        if (mode === 2) {
          img.width === img.height ? resolve(true) : resolve(false);
        }
        if (mode === 3) resolve({ width: img.width, height: img.height });
      } else {
        img.onload = function (e) {
          if (mode === 1) {
            img.naturalWidth === width && img.naturalHeight === height
              ? resolve(true)
              : resolve(false);
          }
          if (mode === 2) {
            img.naturalWidth === img.naturalHeight
              ? resolve(true)
              : resolve(false);
          }
          if (mode === 3)
            resolve({ width: img.naturalWidth, height: img.naturalHeight });
        };
        img.onerror = function () {
          resolve(false);
        };
      }
    };
  });
}

/**
 * 根据id获取数组中的对应项的名称
 * @param {*} id id
 * @param {*} listId 数组id属性名
 * @param {*} name 返回的属性名
 * @returns {*}
 */
export function getArrayDataName(id, list, listId = "id", name = "name") {
  let obj = list.find((value) => id === value[listId]);
  return obj ? obj[name] : "";
}


/**
 * 对象深拷贝
 */
export const deepClone = data => {
  var type = getObjType(data)
  var obj
  if (type === 'array') {
    obj = []
  } else if (type === 'object') {
    obj = {}
  } else {
    // 不再具有下一层次
    return data
  }
  if (type === 'array') {
    for (var i = 0, len = data.length; i < len; i++) {
      obj.push(deepClone(data[i]))
    }
  } else if (type === 'object') {
    for (var key in data) {
      obj[key] = deepClone(data[key])
    }
  }
  return obj
}

export const getObjType = obj => {
  var toString = Object.prototype.toString
  var map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  if (obj instanceof Element) {
    return 'element'
  }
  return map[toString.call(obj)]
}

// 是否移动端
export const isMobile = () => {
  let mobile = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
  return mobile!= null
}