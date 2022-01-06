/**
 * 通用js方法封装处理
 * Copyright (c) 2019 sailing
 */

/**生成编号*/
import { createcode} from "@/api/common/utils";
import { isPromise } from '@riophae/vue-treeselect/src/utils'
export function createCode(param){
  return new Promise((resolve, reject) => {
    createcode(param).then(response => {
      resolve(response.msg)
    });
  })
}

const baseURL = process.env.VUE_APP_BASE_API

// 日期格式化
export function parseTime(time, pattern) {
	if (arguments.length === 0 || !time) {
		return null
	}
	const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
	let date
	if (typeof time === 'object') {
		date = time
	} else {
		if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
			time = parseInt(time)
		} else if (typeof time === 'string') {
			time = time.replace(new RegExp(/-/gm), '/');
		}
		if ((typeof time === 'number') && (time.toString().length === 10)) {
			time = time * 1000
		}
		date = new Date(time)
	}
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay()
	}
	const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
		let value = formatObj[key]
		// Note: getDay() returns 0 on Sunday
		if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
		if (result.length > 0 && value < 10) {
			value = '0' + value
		}
		return value || 0
	})
	return time_str
}

// 获取两个日期差的天数
export function getDiffDay(startDate, endDate) {
  let timestampDiff = new Date(endDate).getTime() - new Date(startDate).getTime();
  let day = Math.ceil(timestampDiff/(24 * 60 * 60 * 1000));
  if(!startDate || !endDate) return 0
  return day
}

// 表单重置
export function resetForm(refName) {
	if (this.$refs[refName]) {
		this.$refs[refName].resetFields();
	}
}

// 添加日期范围
export function addDateRange(params, dateRange) {
	var search = params;
	search.beginTime = undefined;
	search.endTime = undefined;
	if (null != dateRange && '' != dateRange) {
		search.beginTime = dateRange[0];
		search.endTime = dateRange[1];
	}
	return search;
}

// 回显数据字典
export function selectDictLabel(datas, value) {
	var actions = [];
	Object.keys(datas).map((key) => {
		if (datas[key].dictValue == ('' + value)) {
			actions.push(datas[key].dictLabel);
			return false;
		}
    if (datas[key].value == ('' + value)) {
    	actions.push(datas[key].label);
    	return false;
    }
	})
	return actions.join('');
}

// 翻译 /手动写的
export function typeFormat(options, row) {
  let label = "";
  options.forEach(item =>{
    if(item.value == row){
      label = item.label;
    }
  })
  return label;
}

// 通用下载方法
export function download(fileName) {
	window.location.href = baseURL + "/common/download?fileName=" + encodeURI(fileName) + "&delete=" + true;
}

// 字符串格式化(%s )
export function sprintf(str) {
	var args = arguments, flag = true, i = 1;
	str = str.replace(/%s/g, function () {
		var arg = args[i++];
		if (typeof arg === 'undefined') {
			flag = false;
			return '';
		}
		return arg;
	});
	return flag ? str : '';
}

// 转换字符串，undefined,null等转化为""
export function praseStrEmpty(str) {
    if (!str || str == "undefined" || str == "null") {
        return "";
    }
    return str;
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 0
 */
export function handleTree(data, id, parentId, children, rootId) {
	id = id || 'id'
	parentId = parentId || 'parentId'
	children = children || 'children'
	rootId = rootId || 0
	//对源数据深度克隆
	const cloneData = JSON.parse(JSON.stringify(data))
	//循环所有项
	const treeData =  cloneData.filter(father => {
	  let branchArr = cloneData.filter(child => {
		//返回每一项的子级数组
		return father[id] === child[parentId]
	  });
	  branchArr.length > 0 ? father.children = branchArr : delete father.children;
	  //返回第一层
	  return father[parentId] === rootId;
	});
	return treeData != '' ? treeData : data;
  }

/**
 * 关闭当前页面并跳转到新页面
 * @param path
 */
export function closeView(path, toPath, time = 1000) {
  let views = this.$store.state.tagsView.visitedViews;
  views.map(item => {
    if(item.path == path) {
      setTimeout(() => {
        this.$store.dispatch('tagsView/delView', item).then(({ visitedViews }) => {
          if (toPath) {
            this.$router.push(toPath);
            return
          }
          if (item.path === this.$route.path) {
            const latestView = visitedViews.slice(-1)[0];
            if (latestView) {
              this.$router.push(latestView.fullPath);
            } else {
              // now the default is to redirect to the home page if there is no tags-view,
              // you can adjust it according to your needs.
              if (item.name === 'Dashboard') {
                // to reload home page
                this.$router.replace({ path: '/redirect' + item.fullPath });
              } else {
                this.$router.push('/');
              }
            }
          }
        })
      },time);
    }
  })
}

//处理数字转大写汉字
export function numberParseChina(money) {
//汉字的数字
  let cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  //基本单位
  let cnIntRadice = ['', '拾', '佰', '仟'];
  //对应整数部分扩展单位
  let cnIntUnits = ['', '万', '亿', '兆'];
  //对应小数部分单位
  let cnDecUnits = ['角', '分', '毫', '厘'];
  //整数金额时后面跟的字符
  let cnInteger = '整';
  //整型完以后的单位
  let cnIntLast = '元';
  //最大处理的数字
  let maxNum = 999999999999999.9999;
  //金额整数部分
  let integerNum;
  //金额小数部分
  let decimalNum;
  //输出的中文金额字符串
  let chineseStr = '';
  //分离金额后用的数组，预定义
  let parts;
  if (money == '') {
    return '';
  }
  money = parseFloat(money);
  if (money >= maxNum) {
    //超出最大处理数字
    return '';
  }
  if (money == 0) {
    chineseStr = cnNums[0] + cnIntLast + cnInteger;
    return chineseStr;
  }
  //转换为字符串
  money = money.toString();
  if (money.indexOf('.') == -1) {
    integerNum = money;
    decimalNum = '';
  } else {
    parts = money.split('.');
    integerNum = parts[0];
    decimalNum = parts[1].substr(0, 4);
  }
  //获取整型部分转换
  if (parseInt(integerNum, 10) > 0) {
    let zeroCount = 0;
    let IntLen = integerNum.length;
    for (let i = 0; i < IntLen; i++) {
      let n = integerNum.substr(i, 1);
      let p = IntLen - i - 1;
      let q = p / 4;
      let m = p % 4;
      if (n == '0') {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0];
        }
        //归零
        zeroCount = 0;
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
      }
      if (m == 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q];
      }
    }
    chineseStr += cnIntLast;
  }
  //小数部分
  if (decimalNum != '') {
    let decLen = decimalNum.length;
    for (let i = 0; i < decLen; i++) {
      let n = decimalNum.substr(i, 1);
      if (n != '0') {
        chineseStr += cnNums[Number(n)] + cnDecUnits[i];
      }
    }
  }
  if (chineseStr == '') {
    chineseStr += cnNums[0] + cnIntLast + cnInteger;
  } else if (decimalNum == '') {
    chineseStr += cnInteger;
  }
  return chineseStr;
}

//兼容ie删除节点
function isIE() {
  if (!!window.ActiveXObject || "ActiveXObject" in window) {
    return true;
  } else {
    return false;
  }
}

function isIE11() {
  if ((/Trident\/7\./).test(navigator.userAgent)) {
    return true;
  } else {
    return false;
  }
}

export function removeNode(obj) {
  if (isIE() || isIE11()) {
    obj.removeNode(true);
  } else {
    obj.remove();
  }
}

//自定义校验有无权限
export function hasPermi(id) {
  if (!id) return;
  let dom = document.getElementById(id);
  if (dom) {
    return true;
  } else {
    return false;
  }
}
