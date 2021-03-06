/**
 * Module dependencies.
 */

var http = require('http'),
	crypto = require('crypto'),
	Path = require('path'),	
	util = require('util'),
	isWindows = process.platform === 'win32',//是否是windows
    fs = require('fs');
var url = require('url');



/**
 * Return md5 hash of the given string and optional encoding,
 * defaulting to hex.
 *
 *     utils.md5('wahoo');
 *     // => "e493298061761236c96b02ea6aa8a2ad"
 *
 * @param {String} str
 * @param {String} encoding
 * @return {String}
 * @api public
 */

 exports.getAppEname = function(originalUrl){

  var pathname = url.parse(originalUrl).pathname || ''
  try{
      var appEname = pathname.split('/')[2] || ''
      //console.log(appEname)
    }
    catch(e){
      return {error:1,data:e}
    }

  return {error:0,data:appEname}

 }

var md5 = function (str, encoding){
  return crypto
    .createHash('md5')
    .update(str)
    .digest(encoding || 'hex');
};
exports.md5 = md5


var sha1 = function (str, encoding){
  return crypto
    .createHash('sha1')
    .update(str)
    .digest(encoding || 'hex');
};
exports.sha1 = sha1
/**
 * Merge object b with object a.
 *
 *     var a = { foo: 'bar' }
 *       , b = { bar: 'baz' };
 *     
 *     utils.merge(a, b);
 *     // => { foo: 'bar', bar: 'baz' }
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object}
 * @api private
 */

exports.merge = function(a, b){
  if (a && b) {
    for (var key in b) {
      a[key] = b[key];
    }
  }
  return a;
};


/*
object copy
*/
exports.copy = function(a){
	return JSON.parse(JSON.stringify(a));
}

exports.escape = function(html){
  return String(html)
    .replace(/&(?!\w+;)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};



exports.check_mobile = function(mobile){
  return /^[0-9]{11,11}$/.test(mobile)
};

exports.check_name = function(name){
  return /[^u4e00-u9fa5]{1,10}$/.test(name)
};

exports.check_email = function(name){
  return /^\w+((-|\.)\w+)*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(name)
};

exports.check_pwd = function(name){
  return /^[\s\S]{6,32}$/.test(name)
};

var salt_count = 0;
exports.genSalt = function(){
  return md5((Date.now()+(salt_count++)).toString());
}

exports.genPwd = function(pwd,salt){
  if(!pwd || !salt) return '';
  return md5(salt+pwd);
}


exports.format_mobile = function(mobile){
  if(!mobile) return mobile

  var n = mobile.length;
  var str_array = []
  for(i=0;i<n;i++){
    if(i>=3 && i<8){
      str_array[i] = '*';
    }
    else str_array[i] = mobile[i];
      mobile[i] = '*';
  }
  return str_array.join('')
};

exports.format_name = function(name){
  if(!name) return name
    
  var n = name.length;
  var str_array = []
  for(i=0;i<n;i++){
      i>0 ? str_array[i] = '*' : str_array[i] = name[i];
  }
  return str_array.join('')
};


exports.filter_models = function(model_str){

  try{
    var obj = JSON.parse(model_str)
  }
  catch(e){
    return false;
  }
  
  obj.forEach(function(objv){
      Object.keys(objv).forEach(function(v){
        if(objv[v] === '') {
          delete objv[v];
        }
      })
  })

  

  return obj;
};
exports.AddJsonResult = function(obj,istrue,err){
    var key1 = "ret"
    var key2 = "err"
    if(!obj.hasOwnProperty(key1)){
      obj[key1] = istrue ? 1 : 0;
    }
    if(!obj.hasOwnProperty(key2) && err){
      obj[key2] = err;
    }
     return obj;
}


exports.GetAgent = function(AgentHead){
  var u = AgentHead||''
  return {         //移动终端浏览器版本信息
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
            iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
         }

/*

document.writeln(" 是否为移动终端: "+browser.versions.mobile);
document.writeln(" ios终端: "+browser.versions.ios);
document.writeln(" android终端: "+browser.versions.android);
document.writeln(" 是否为iPhone: "+browser.versions.iPhone);
document.writeln(" 是否iPad: "+browser.versions.iPad);
document.writeln(navigator.userAgent);
*/

}







exports.fdate = function(format){//格式化时间
		var format = typeof format === 'undefined'?false:format.toLowerCase(),
			now = new Date(),
			time = now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate();
		if(format === 'y-m-d h:m:s'){
			time += ' '+now.getHours()+":"+now.getMinutes()+":"+now.getSeconds(); 
		}
		return time;
	};




exports.normalize_query = function(p){
	var nor_path = Path.normalize(p);
	if(isWindows) return  nor_path.replace(/\\/g, '/');
	return nor_path;
}


exports.genSignStr = function(paramObj,clientKey){//生成sign
	var str = '';
  var clientKey = clientKey.toLowerCase();
	Object.keys(paramObj)
		  .sort()
		  .forEach(function(v,i){
		  		if(v === 'sign') return;
		  		str += util.format('%s=%s', v, paramObj[v]);
			})
  var str = str.toLowerCase()+clientKey;

	return md5(str).toLowerCase()
}


/*
接收filter数组，返回mongoose的过滤对象
filter[logic]:and
filter[filters][0][field]:_id
filter[filters][0][operator]:eq
filter[filters][0][value]:123123
filter[filters][1][field]:_id
filter[filters][1][operator]:eq
filter[filters][1][value]:123
filter[filters][2][field]:clientKey
filter[filters][2][operator]:eq
filter[filters][2][value]:2
返回一个mongoose可筛选对象
*/
exports.kendoToMongoose = function(filter,clientId){
  var mObj = {};

  if(!filter || !filter.filters || filter.filters.length == 0){
    return mObj;
  }
  
      var filterArray = filter.filters;

  if(filter.logic == 'and'){
      filterArray.forEach(function(v,i){
          if(!v) return;
          if(v.operator == 'eq'){
              mObj[v.field] = v.value;
          }
          else if(v.operator == 'neq'){
              mObj[v.field] = {"$ne":v.value};
          }
          else if(v.operator == 'startswith'){
              mObj[v.field] = new RegExp('^' + v.value);
          }
          else if(v.operator == 'contains'){
              mObj[v.field] = new RegExp(v.value);
          }
          else if(v.operator == 'doesnotcontain'){
              mObj[v.field] = new RegExp('^(?!.*'+v.value+').*$');
          }
          else if(v.operator == 'endswith'){
              mObj[v.field] = new RegExp(v.value+'$');
          }
          else if(v.operator == 'gte'){
              mObj[v.field] =  { "$gte": v.value }
          }
          else if(v.operator == 'gt'){
              mObj[v.field] =  { "$gt": v.value }
          }
          else if(v.operator == 'lte'){
              mObj[v.field] =  { "$lte": v.value }
          }
          else if(v.operator == 'lt'){
              mObj[v.field] =  { "$lt": v.value }
          }
          
      })
      //console.log(mObj)
      return mObj;
  }
  else if(filter.logic == 'or'){
      var orobj = {
          "$or":[]
      };
      filterArray.forEach(function(v,i){
          if(!v) return;
          var mObj = {}
          if(v.operator == 'eq'){
              mObj[v.field] = v.value;
          }
          else if(v.operator == 'neq'){
              mObj[v.field] = {"$ne":v.value};
          }
          else if(v.operator == 'startswith'){
              mObj[v.field] = new RegExp('^' + v.value);
          }
          else if(v.operator == 'contains'){
              mObj[v.field] = new RegExp(v.value);
          }
          else if(v.operator == 'doesnotcontain'){
              mObj[v.field] = new RegExp('^(?!.*'+v.value+').*$');
          }
          else if(v.operator == 'endswith'){
              mObj[v.field] = new RegExp(v.value+'$');
          }
          else if(v.operator == 'gte'){
              mObj[v.field] =  { "$gte": v.value }
          }
          else if(v.operator == 'gt'){
              mObj[v.field] =  { "$gt": v.value }
          }
          else if(v.operator == 'lte'){
              mObj[v.field] =  { "$lte": v.value }
          }
          else if(v.operator == 'lt'){
              mObj[v.field] =  { "$lt": v.value }
          }
          orobj["$or"].push(mObj)
      })
      //console.log(orobj)
      return orobj;
  }
  return mObj;
}