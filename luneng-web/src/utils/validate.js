/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

//常用表单校验规则
export function getCheckRule(type, message) {
  if(!type) return
  switch (type) {
    case 'email':
      return { pattern: /^\w+@[a-z0-9]+\.[a-z]{2,4}$/, message: message ? message : '请输入正确的邮箱', trigger: "blur" };
      break;
    case 'amount':
      return { pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: message ? message : "请输入正确的金额", trigger: "blur" };
      break;
    case 'number':
      return { pattern: /^(([1-9][0-9]*)|(([0]\.\d+|[1-9][0-9]*\.\d+)))$/, message: message ? message : "请输入正确的数字", trigger: "blur" };
      break;
    case 'IDNO':
      return { pattern: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/, message: message ? message : "请输入正确的身份证号", trigger: "blur" };
      break;
    case 'phone':
      return { pattern: /(^0\d{2,3}-?\d{7,8}$)|(^1[3|4|5|6|7|8|9][0-9]\d{8}$)/, message: message ? message : "请输入正确的电话号码", trigger: "blur" };
      break;
    case 'mobile':
      return { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: message ? message : "请输入正确的手机号码", trigger: "blur" };
      break;
    case 'space':
      return { pattern: '[^ \x22]+', message: message ? message : "输入项不能都为空格", trigger: "blur" };
      break;
    default: {}
  }
}

