var userBl = require('../bl/wxUser.js');
var appBl = require('../bl/wxApp.js');
var activeBl = require('../bl/activeBl.js');
var url = require('url')

var utils = require('../lib/utils.js');
var moment = require('moment')
var obj = {}


//互动的中间件
obj.activeMiddle = function(req,res,next){
	var toUserId = req.query.touserid;
	var activeEname = req.query.ename;

	var pathname = url.parse(req.originalUrl).pathname || ''
	try{
      var appEname = pathname.split('/')[2] || ''
      //console.log(appEname)
    }
    catch(e){
      return res.send(500,e)
    }

    //真实情况需要注释掉
    //req.session[appEname+'_oauth_openid'] = 'asd'

	var openId = req.session[appEname+'_oauth_openid'] 
	var userid = req.session[appEname+'_userid']; 


	if(!openId){
		return res.send(500,'not have openId Auth fail')
	}

	appBl.getByEname(appEname, function(err,appObj){
		if(err){
			return res.send(500,err)
		}
		if(!appObj){
			return res.send(500,'not found user')
		}

			userBl.getUserByOpenid(openId,function(err,uobj){
				if(err){
					return res.send(500,err)
				}
				if(!uobj){
					return res.send(500,'not found user')
				}
				

				//根据ename，查找活动
				activeBl.getActiveByEname(activeEname, function(err, aObj){
					if(err) return res.send(500,err) 
					if(!aObj) return res.send(500,'not found active')

					if(!toUserId){//重新加载本页
						res.redirect(req.originalUrl+'&touserid='+uobj.uobj._id)
						return;
					}
					//如果定义了跳转，则直接跳转到指定页面
					var redirect_url = aObj.url.trim()
					if(redirect_url){
						//增加openid参数
						if(redirect_url.indexOf('?') == -1){
							redirect_url = redirect_url + '?openid='+openId
						}
						else{
							redirect_url = redirect_url + '&openid='+openId
						}
						//跳转
						res.redirect(redirect_url)
						return;
					}


					userBl.getUserByUserId(userid,function(err,fromUserObj){
						if(err) return res.send(500,err) 
						if(!fromUserObj) return res.send(500,'not found fromUserObj')

						//获取访问的用户对象
						req.fromUserObj = fromUserObj.uobj;

						userBl.getUserByUserId(toUserId,function(err,toUserObj){
							if(err) return res.send(500,err) 
							if(!toUserObj) return res.send(500,'not found toUserObj')
							//console.log(toUserObj)
							//console.log(uobj)
							//console.log(aObj)
							req.toUserObj = toUserObj.uobj;
							req.appId = appObj._id;
							req.appEname = appEname;
							
							req.activeObj = {
								appEname:appEname,
								openId:openId,
								activeObj:aObj
							}
							return next()

						})//end userBl.getUserByUserId

					})//end userBl.getUserByUserId

				})//end getActiveByEname
				
			})
	})
	
}



obj.activePage = function(req,res){ //活动页面展示

		var toUserId = req.query.touserid;
		var activeEname = req.query.ename;
		var openId = req.activeObj.openId
		var fromUserId = req.fromUserObj._id
		var templateName = req.activeObj.activeObj.ename
		var acitveId = req.activeObj.activeObj._id
		var activeObj = req.activeObj;
/*
		if(!toUserId){//重新加载本页
			res.redirect(req.originalUrl+'&touserid='+fromUserId)
			return
		}
*/

		var toUserObj = {}
		var isMyPage = false
		if(toUserId == fromUserId){//如果是自己的页面
			isMyPage = true;
			toUserObj = req.fromUserObj
		}
		else{
			toUserObj = req.toUserObj
		}

		if(toUserObj.appUserName == '未认证会员'){
				toUserObj.appUserName = ''
		}
		if(toUserObj.appUserMobile.length != 11){
			toUserObj.appUserMobile = ''
		}

		activeBl.getIfHasAdd(acitveId, openId, toUserId, function(err, hasObj){
			if(err) return res.send(500,err)
			var  hasAdd = false
			if(hasObj) hasAdd = true

			activeBl.getCountByActiveIdAndToUserId(acitveId, toUserId, function(err,count){
				if(err) return res.send(500,err)
				var tempObj = {
						'activeObj':activeObj,
						'appId':req.appId,
						'appEname':req.appEname,
						'toUserObj':toUserObj,           //是否是自己的活动页面
						'fromUserObj':req.fromUserObj,	//访问的用户对象
						'isMyPage':isMyPage,
						'toUserId':toUserId,     //目标用户的用户id
						'fromUserId':fromUserId, //来源用户的用户id
						'fromOpenId':openId,    //来源用户的openid
						'activeId':acitveId,   //活动id
						'supportCount':count,  //目前这个用户，这个互动支持的数量
						'hasAdd':hasAdd, 	//是否已经支持过
						'prizeList':[],    //奖品数组
						'myPrizeList':[]
					}

				if(activeObj.isPrize == 0){ //没有兑奖功能
					return res.render('active/'+templateName+'.ejs', tempObj)
				}
				else{//有兑奖功能，并且要去获取兑奖信息和此用户兑奖记录
					activeBl.getActivePrizeInfo(acitveId, toUserId, function(err, infoObj){
						if(err) return res.send(500,err)

						//将奖品由易到难排序
						var prizeList = infoObj.prizeList.sort(function(a,b){
							if(a.price > b.price){
								return 1
							}
							return -1
						})

						//循环看是否可以
						var tempPrizeList = []
						prizeList.forEach(function(prizeObj){
							var tempPrizeObj = {
								_id:prizeObj._id.toString(),
								name:prizeObj.name,
								imgUrl:prizeObj.imgUrl,
								price:prizeObj.price,
								totalNumber:prizeObj.totalNumber,
								countNum:prizeObj.countNum,
								desc:prizeObj.desc,
								code1:prizeObj.code1,
								code2:prizeObj.code2,
								writeTime:prizeObj.writeTime,
								lastPrizeNumber:prizeObj.totalNumber - prizeObj.countNum,
								canSelect:true,
								hasSelect:false,
							}
							var prizeId = prizeObj._id.toString()
				
							//如果不是我自己的页面，则全部不能选择
							if(!tempObj.isMyPage){
								tempPrizeObj.canSelect = false;
							}
							//如果没有库存了
							if(tempPrizeObj.lastPrizeNumber<=0){
								tempPrizeObj.lastPrizeNumber = 0;
								tempPrizeObj.canSelect = false;
							}
							if(tempObj.supportCount < tempPrizeObj.price){
								tempPrizeObj.canSelect = false;
							}
							//循环我的记录，如果已经领取过了
							infoObj.myPrizeList.forEach(function(myObj){
									if(myObj.prizeId == prizeId){
										tempPrizeObj.hasSelect = true;
									}
							})
							tempPrizeList.push(tempPrizeObj)
						})


						//获取排名
						activeBl.getRankByEname(templateName, 100, function(err, rankList){
							if(err) return res.send(500,err)
							//获取排名返回给前端
							tempObj.rankList = rankList
							tempObj.prizeList = tempPrizeList
							tempObj.myPrizeList = infoObj.myPrizeList
							return res.render('active/'+templateName+'.ejs', tempObj)
						})//end activeBl.getRankByEname				
						
					})//end activeBl.getActiveInfo
				}

			})//end getCountByActiveIdAndToUserId

		})//end getIfHasAdd

}



obj.activeRank = function(req,res){

	var ename = req.query.ename
	if(!ename){
		return res.json({error:0,data:'缺少参数ename'})
	}
	activeBl.getRankByEname(ename,100,function(err,list){
		if(err) return res.json({error:1,data:err})
		res.json({error:0,data:list})
	})


}




module.exports = obj;