document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
    //绑定‘分享给朋友’按钮
    WeixinJSBridge.on('menu:share:appmessage', function(argv){
        shareFriend();
    });
    //绑定‘分享到朋友圈’按钮
    WeixinJSBridge.on('menu:share:timeline', function(argv){
        shareTimeline();
    });
    //绑定‘分享到微博’按钮
    WeixinJSBridge.on('menu:share:weibo', function(argv){
        shareWeibo();
    });
}, false);


















var WeixinApi=(function(){function k(n,m){m=m||{};var l=function(o){WeixinJSBridge.invoke("shareTimeline",{appid:o.appId?o.appId:"",img_url:o.imgUrl,link:o.link,desc:o.title,title:o.desc,img_width:"120",img_height:"120"},function(p){switch(p.err_msg){case"share_timeline:cancel":m.cancel&&m.cancel(p);break;case"share_timeline:fail":m.fail&&m.fail(p);break;case"share_timeline:confirm":case"share_timeline:ok":m.confirm&&m.confirm(p);break}m.all&&m.all(p)})};WeixinJSBridge.on("menu:share:timeline",function(o){if(m.async&&m.ready){window._wx_loadedCb_=m.dataLoaded||new Function();if(window._wx_loadedCb_.toString().indexOf("_wx_loadedCb_")>0){window._wx_loadedCb_=new Function()}m.dataLoaded=function(p){window._wx_loadedCb_(p);l(p)};m.ready&&m.ready(o)}else{m.ready&&m.ready(o);l(n)}})}function j(n,m){m=m||{};var l=function(o){WeixinJSBridge.invoke("sendAppMessage",{appid:o.appId?o.appId:"",img_url:o.imgUrl,link:o.link,desc:o.desc,title:o.title,img_width:"120",img_height:"120"},function(p){switch(p.err_msg){case"send_app_msg:cancel":m.cancel&&m.cancel(p);break;case"send_app_msg:fail":m.fail&&m.fail(p);break;case"send_app_msg:confirm":case"send_app_msg:ok":m.confirm&&m.confirm(p);break}m.all&&m.all(p)})};WeixinJSBridge.on("menu:share:appmessage",function(o){if(m.async&&m.ready){window._wx_loadedCb_=m.dataLoaded||new Function();if(window._wx_loadedCb_.toString().indexOf("_wx_loadedCb_")>0){window._wx_loadedCb_=new Function()}m.dataLoaded=function(p){window._wx_loadedCb_(p);l(p)};m.ready&&m.ready(o)}else{m.ready&&m.ready(o);l(n)}})}function g(n,m){m=m||{};var l=function(o){WeixinJSBridge.invoke("shareWeibo",{content:o.desc,link:o.link,img_url:o.imgUrl,title:o.title,img_width:"120",img_height:"120"},function(p){switch(p.err_msg){case"share_weibo:cancel":m.cancel&&m.cancel(p);break;case"share_weibo:fail":m.fail&&m.fail(p);break;case"share_weibo:confirm":case"share_weibo:ok":m.confirm&&m.confirm(p);break}m.all&&m.all(p)})};WeixinJSBridge.on("menu:share:weibo",function(o){if(m.async&&m.ready){window._wx_loadedCb_=m.dataLoaded||new Function();if(window._wx_loadedCb_.toString().indexOf("_wx_loadedCb_")>0){window._wx_loadedCb_=new Function()}m.dataLoaded=function(p){window._wx_loadedCb_(p);l(p)};m.ready&&m.ready(o)}else{m.ready&&m.ready(o);l(n)}})}function b(l,m){if(!l||!m||m.length==0){return}WeixinJSBridge.invoke("imagePreview",{current:l,urls:m})}function c(){WeixinJSBridge.call("showOptionMenu")}function i(){WeixinJSBridge.call("hideOptionMenu")}function h(){WeixinJSBridge.call("showToolbar")}function e(){WeixinJSBridge.call("hideToolbar")}function d(l){if(l&&typeof l=="function"){WeixinJSBridge.invoke("getNetworkType",{},function(m){l(m.err_msg)})}}function f(){WeixinJSBridge.call("closeWindow")}function a(n){if(n&&typeof n=="function"){var l=this;var m=function(){n(l)};if(typeof window.WeixinJSBridge=="undefined"){if(document.addEventListener){document.addEventListener("WeixinJSBridgeReady",m,false)}else{if(document.attachEvent){document.attachEvent("WeixinJSBridgeReady",m);document.attachEvent("onWeixinJSBridgeReady",m)}}}else{m()}}}return{version:"1.6",ready:a,shareToTimeline:k,shareToWeibo:g,shareToFriend:j,showOptionMenu:c,hideOptionMenu:i,showToolbar:h,hideToolbar:e,getNetworkType:d,imagePreview:b,closeWindow:f}})();


// 所有功能必须包含在 WeixinApi.ready 中进行
WeixinApi.ready(function (Api) {

    // 微信分享的数据
    var wxDataToFriend = {
        "appId": "", // 服务号可以填写appId
        "imgUrl": 'http://piccvote.qiniudn.com/unipay_logo2.png',//window.forwardingImg_friend || window.forwardingImg,
        "link": window.forwardingUrl,//window.forwardingUrl_friend || window.forwardingUrl,
        "desc": '11111',//window.forwardingDesc_friend || window.forwardingDesc,
        "title": '1111111',//window.forwardingTitle_friend || window.forwardingTitle
    };

    var wxDataToTimeline = {
        "appId": "", // 服务号可以填写appId
        "imgUrl": window.forwardingImg,
        "link": window.forwardingUrl,
        "desc": window.forwardingDesc,
        "title": window.forwardingTitle
    };

    // 分享的回调
    var wxCallbacks_friend = {
        // 分享操作开始之前
        ready: function () {
            $('#title').html('1')
            // 你可以在这里对分享的数据进行重组
        },
        // 分享被用户自动取消
        cancel: function (resp) {
            $('#title').html('2')
            // 你可以在你的页面上给用户一个小Tip，为什么要取消呢？
        },
        // 分享失败了
        fail: function (resp) {
            $('#title').html('3')
            // 分享失败了，是不是可以告诉用户：不要紧，可能是网络问题，一会儿再试试？
        },
        // 分享成功
        confirm: function (resp) {
            // 分享成功了，我们是不是可以做一些分享统计呢？
            //window.location.replace("guaguaka.aspx");

            $('#title').html('4')
            if(window.forwardingCallback_friend){
                window.forwardingCallback_friend()
            }
            else if(window.forwardingCallback){
                window.forwardingCallback()
            } 
        },
        // 整个分享过程结束
        all: function (resp) {
            alert('4')
            // 如果你做的是一个鼓励用户进行分享的产品，在这里是不是可以给用户一些反馈了？
        }
    };



    // 分享的回调
    var wxCallbacks_zone = {
        // 分享操作开始之前
        ready: function () {
            // 你可以在这里对分享的数据进行重组
        },
        // 分享被用户自动取消
        cancel: function (resp) {
            // 你可以在你的页面上给用户一个小Tip，为什么要取消呢？
        },
        // 分享失败了
        fail: function (resp) {
            // 分享失败了，是不是可以告诉用户：不要紧，可能是网络问题，一会儿再试试？
        },
        // 分享成功
        confirm: function (resp) {
            // 分享成功了，我们是不是可以做一些分享统计呢？
            //window.location.replace("guaguaka.aspx");
            window.forwardingCallback && window.forwardingCallback()
        },
        // 整个分享过程结束
        all: function (resp) {
            // 如果你做的是一个鼓励用户进行分享的产品，在这里是不是可以给用户一些反馈了？
        }
    };

    WeixinJSBridge.call('showOptionMenu');

    // 用户点开右上角popup菜单后，点击分享给好友，会执行下面这个代码
    Api.shareToFriend(wxDataToFriend, wxCallbacks_friend);

    // 点击分享到朋友圈，会执行下面这个代码
    Api.shareToTimeline(wxDataToTimeline, wxCallbacks_zone);

});