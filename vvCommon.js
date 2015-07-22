
/* get Dom id */
var vvId = function (id) {
		return "string" == typeof id ? document.getElementById(id) : id;
	};

/* IE Check */
var vvIe = (function(){
		var isIe = (document.all) ? true : false;
		return isIe;
	})();

/* isMobile check */
var vvMobile = (function(){
		var u = navigator.userAgent;
		return u.match(/AppleWebKit.*Mobile.*/i) ? true : false;
	})();

var vvWebKit = (function(){
		var u = navigator.userAgent;
		return u.match(/WebKit/i) ? true : false;
	})();

/* require */
var vvGetFileDir = function(baseFileName){
		var jsDom = document.scripts;
		var themeDirBack;
		var jLen = jsDom.length;
		for(var i=jLen; i > 0; i--){
			if(jsDom[i-1].src.indexOf(baseFileName) > -1){
				themeDirBack = jsDom[i-1].src.substring(0,jsDom[i-1].src.lastIndexOf("/") + 1);
			}
		}
		return themeDirBack;
	}

var vvRequire = function(url){
		var head = document.getElementsByTagName("head")[0];
		var regScript = /^.*\.js$/i;
		if(regScript.test(url)){
			var script  = document.createElement("script");
			script.type = "text/javascript";
			script.src  = url + "?" + Math.random();
			head.appendChild(script);
			return script;
		}
		var regCss = /^.*\.css$/i;
		if(regCss.test(url)){
			var css  = document.createElement('link');
			css.href = url + "?" + Math.random();
			css.rel  = 'stylesheet';
			css.type = 'text/css';
			head.appendChild(css);
			return css;
		}
	}
	
/* vvSocketLog */
var vvSocketLog = function (url){
	this.ws = new WebSocket("ws://" + url + ":8080");
	this.ws.onopen = function(){
		console.log("handshake");
	}
	this.ws.onmessage = function(e){
		var data = eval('(' + e.data + ')');
		console.log(data.logContent);
	}
	this.ws.onerror = function(){
		console.log("error");
	}
	this.ws.onclose = function(){
		// ws = false;
	}
	this.show = function(logContent){
		this.ws.send('{"command":"log","action":"showLog","logContent":"' + logContent + '"}');
	}
}

/* vvLoader initialize */
var vvLoader = function (callBack,fileList){
		var fLen = fileList.length;
		var loadId = 0;
		var require = function(){
			var loadFile = vvRequire(fileList[loadId]);
			var regCss = /^.*\.css$/i;
			var regScript = /^.*\.js$/i;
			if(regCss.test(fileList[loadId])){
				vvStyleOnload(loadFile,function(){
					loadId ++;
					if(loadId < fLen){
						require();
					}else{
						callBack();
					}
				});
			}else if(regScript.test(fileList[loadId])){
				if(vvIe){
					loadFile.onreadystatechange = function(e){
						if(loadFile.readyState == "loaded"){
							loadId ++;
							if(loadId < fLen){
								require();
							}else{
								callBack();
							}
						}
					}
				}else{
					loadFile.onload = function(e){
						loadId ++;
						if(loadId < fLen){
							require();
						}else{
							callBack();
						}
					}
				}
			}
		};
		require();
	}

/* css onload check */
var vvStyleOnload = function(node,callback){
		if(node.attachEvent){ // for IE6-9 and Opera
			node.attachEvent('onload',callback);
		}else {
			setTimeout(function(){
				vvPoll(node, callback);
			},0); // for cache
		}
	}

var vvPoll = function(node,callback){
		if(callback.isCalled){
			return;
		}
		var isLoaded = false;
		if (/webkit/i.test(navigator.userAgent)) { // webkit
			if (node['sheet']){
				isLoaded = true;
			}
		}else if (node['sheet']){ // for Firefox
			try {
				if (node['sheet'].cssRules){
					isLoaded = true;
				}
			}catch(ex){ // NS_ERROR_DOM_SECURITY_ERR
				if (ex.code === 1000) {
					isLoaded = true;
				}
			}
		}
		if(isLoaded){
			setTimeout(function() {
				callback();
			},1);
		}else{
			setTimeout(function() {
				vvPoll(node,callback);
			}, 1);
		}
	}

