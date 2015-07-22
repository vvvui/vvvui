
/* jQuery touch */
$.fn.extend({
	bindTouch : function(callback,that){
		if(vvMobile){
			this.bind("touchstart",function(event){
				event.preventDefault();
				callback(this,that);
			});
		}else{
			this.click(function(){
				callback(this,that);
			});
		}
	}
});

/* jQuery touchGroup */
$.fn.extend({
	bindTouchGroup : function(object){
		var touchObj = this[0];
		if(vvMobile){ /* mobile */
			/* touch start */
			touchObj.addEventListener('touchstart', function(event){
				object.touchDown(event.targetTouches[0],touchObj);
			}, false);
			/* touch move */
			document.addEventListener('touchmove', function(event){
				event.preventDefault();
				object.touchMove(event.targetTouches[0],touchObj);
			}, false);
			/* touch end */
			touchObj.addEventListener('touchend', function(event){
				object.touchUp(event,touchObj);
			}, false);
		}else{ /* pc */
			if(window.attachEvent){ /* ie */
				touchObj.attachEvent("onmousedown", function(event){
					object.touchDown(event,touchObj);
				});
				document.attachEvent("onmousemove", function(event){
					object.touchMove(event,touchObj);
				});
				touchObj.attachEvent("onmouseup", function(event){
					object.touchUp(event,touchObj);
				});
			}else{ /* webkit */
				touchObj.addEventListener('mousedown', function(event){
					object.touchDown(event,touchObj);
				}, false);
				document.addEventListener('mousemove', function(event){
					event.preventDefault();
					object.touchMove(event,touchObj);
				}, false);
				touchObj.addEventListener('mouseup', function(event){
					object.touchUp(event,touchObj);
				}, false);
			}
		}
	}
});

$.fn.extend({
	bindMultiTouch : function(object){
		var touchObj = this[0];
		if(vvMobile){ /* mobile */
			/* touch start */
			touchObj.addEventListener('touchstart', function(event){
				object.touchDown(event.targetTouches,touchObj);
			}, false);
			/* touch move */
			touchObj.addEventListener('touchmove', function(event){
				event.preventDefault();
				object.touchMove(event.targetTouches,touchObj);
			}, false);
			/* touch end */
			touchObj.addEventListener('touchend', function(event){
				object.touchUp(event.targetTouches,touchObj);
			}, false);
		}else{ /* pc */
			if(window.attachEvent){ /* ie */
				touchObj.attachEvent("onmousedown", function(event){
					object.touchDown(event,touchObj);
				});
				document.attachEvent("onmousemove", function(event){
					object.touchMove(event,touchObj);
				});
				touchObj.attachEvent("onmouseup", function(event){
					object.touchUp(event,touchObj);
				});
			}else{ /* webkit */
				touchObj.addEventListener('mousedown', function(event){
					object.touchDown(event,touchObj);
				}, false);
				document.addEventListener('mousemove', function(event){
					event.preventDefault();
					object.touchMove(event,touchObj);
				}, false);
				touchObj.addEventListener('mouseup', function(event){
					object.touchUp(event,touchObj);
				}, false);
			}
		}
	}
});

$.fn.extend({
	vvAnimate : function(param,vvCallBack,liveingObj,acParam){
		if(!param){
			return;
		}
		if(this.an){
			delete this.an;
		}
		this.an = new vvAnimation(this,param,vvCallBack,acParam);
		if(liveingObj){
			liveingObj.animate = this.an;
		}
	}
});
$.fn.vvAnimation = $.fn.vvAnimate;

/* schedule */
var vvSchedule = function(callBack,fps){
		this.fps = fps || 60;
		this.fps = parseInt(1000/this.fps,10);
		this.callBack = callBack || function(){};
		this.start();
	}
	vvSchedule.prototype = {
		start : function(){
			var sTime = 0;
			var nTime = 0;
			var tSum  = 0;
			this.acNum = 0;
			var that = this;
			this.ev = setInterval(function(){
				sTime = nTime || new Date().getTime();
				nTime = new Date().getTime();
				tSum += nTime - sTime;
				if(tSum > that.fps){
					tSum -= that.fps;
					that.callBack(that);
					that.acNum ++;
				}
			},1);
		},
		stop : function(){
			clearInterval(this.ev);
		}
	}

/* vvGetAnimateData */
var vvGetAnimateData = function(aStart,aEnd,tEnd,tween,rate,tBegin){
		var aStart,aEnd,rate,tBegin,tEnd,backArr,aChange,tween;
		aStart = aStart || 0;
		aEnd   = aEnd   || aEnd == 0 ? aEnd : 1;
		rate   = rate   || 1;
		tBegin = tBegin || 0;
		tEnd   = tEnd   || 100;
		aChange = aEnd - aStart;
		tween   = tween || vvTween.Cubic.easeOut;
		backArr = [];
		while(tBegin < tEnd){
			backArr.push(tween(tBegin,aStart,aChange,tEnd));
			tBegin += rate;
		}
		if(backArr[backArr.length - 1] != aEnd){
			backArr.push(aEnd);
		}
		return backArr;
	}
	
var vvGetAnimateData2 = function(aStart,aEnd,tEnd,tween){
	var sum = aStart;
	var moveArr = [];
	while(sum != aEnd){
		var add = (aEnd-sum) / tEnd;
		add = add > 0 ? Math.ceil(add) : Math.floor(add);
		sum += add;
		add != 0 ? moveArr.push(sum) : false;
	}
	if(tween % 2 == 0){
		aEnd > 0 ? moveArr.sort(function(a,b){return a - b;}) : moveArr.sort(function(a,b){return b - a;});
	}
	return moveArr;
}

/* vvAnimate */
var vvAnimation = function(object,param,vvCallBack,acParam){
	if(!object || !param){
		return;
	}
	this.object = object;
	this.param  = param;
	this.acParam = acParam || {};
	this.delay = this.acParam.delay || 0;
	this.loop  = this.acParam.loop  || this.acParam.loop == 0 ? this.acParam.loop : 1;
	this.vvCallBack = vvCallBack || function(){};
	this.acTime = this.acParam.acTime || 1000;
	this.fps = this.acParam.fps || 60;
	this.tweenId = this.acParam.tween  || this.acParam.tween == 0 ? this.acParam.tween : 22;
	this.loopNum = 0;
	this.tween = this.getTween(this.tweenId);
	this.tEnd  = this.acTime / (1000/this.fps);
	this.init();
}
vvAnimation.prototype = {
	init : function(){
		if(this.loop == 0 || this.loopNum < this.loop){
			this.aParam = {};
			this.aData  = {};
			this.aLive  = {};
			this.aDataType = {};
			this.totalAnimate = 0;
			var that = this;
			var to = setTimeout(function(){
				that.play();
				that.loopNum ++;
				clearTimeout(to);
			},this.delay);
		}else{
			delete this;
		}
	},
	initData : function(key,defaultStart,dataType){
		var aStart;
		if(dataType == 1){
			aStart = this.object.css(key) || this.object.css(key) == 0 ? this.object.css(key) : defaultStart;
			aStart = Number(aStart);
		}else if(dataType == 2){
			aStart = this.object.attr(key) || this.object.attr(key) == 0 ? this.object.attr(key) : defaultStart;
			aStart = Number(aStart);
		}else{
			aStart = parseInt(this.object.css(key),10) || defaultStart;
		}
		this.aParam[key] = this.aParam[key] || this.aParam[key] == 0 ? this.aParam[key] : aStart;
		if(this.tween){
			this.aData[key] = vvGetAnimateData(this.aParam[key],this.param[key],this.tEnd,this.tween);
		}else{
			this.aData[key] = vvGetAnimateData2(this.aParam[key],this.param[key],10,this.tweenId);
		}
		if(dataType == 2){
			var scale,rotateX,rotateY,rotateZ;
			switch(key){
				case "scale" :
					scale = this.aParam[key];
					rotateX = this.object.attr("rotateX") || 0;
					rotateY = this.object.attr("rotateY") || 0;
					rotateZ = this.object.attr("rotateZ") || 0;
				break;
				case "rotateX" :
					rotateX = this.aParam[key];
					scale   = this.object.attr("scale")   || 1;
					rotateY = this.object.attr("rotateY") || 0;
					rotateZ = this.object.attr("rotateZ") || 0;
				break;
				case "rotateY" :
					rotateY = this.aParam[key];
					scale   = this.object.attr("scale")   || 1;
					rotateX = this.object.attr("rotateX") || 0;
					rotateZ = this.object.attr("rotateZ") || 0;
				break;
				case "rotateZ" :
					rotateZ = this.aParam[key];
					scale   = this.object.attr("scale")   || 1;
					rotateY = this.object.attr("rotateY") || 0;
					rotateX = this.object.attr("rotateX") || 0;
				break;
			}
			this.object.css("transform","scale(" + scale + ") rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) rotateZ(" + rotateZ + "deg)");
			this.object.css("-webkit-transform","scale(" + scale + ") rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) rotateZ(" + rotateZ + "deg)");
			this.object.attr(key,this.aParam[key]);
		}else{
			this.object.css(key,this.aParam[key]);
		}
		this.totalAnimate += 1;
		this.aLive[key] = 1;
		this.aDataType[key] = dataType;
	},
	play : function(){
		for(var i in this.param){
			switch(i){
				// color
				case "color" :
				case "background-color" :
				case "border-color" :
					this.initDataColor(i);
				break;
				// opacity
				case "opacity" :
					this.initData(i,1,1);
				break;
				// transform
				case "scale" :
					this.initData(i,1,2);
				break;
				case "rotateX" :
				case "rotateY" :
				case "rotateZ" :
					this.initData(i,0,2);
				break;
				// default
				case "left"   :
				case "top"    :
				case "width"  :
				case "height" :
				case "border-radius" :
					this.initData(i,0);
				break;
				default :
					this.initData(i,0);
				break;
			}
		}
		// action
		var that = this;
		that.doAnimate = 0;
		this.schedule = new vvSchedule(function(o){
			for(var k in that.aData){
				if(that.aDataType[k] == 1 || that.aDataType[k] == 2 || !that.aDataType[k]){
					if(o.acNum >= that.aData[k].length && that.aLive[k]){
						that.aLive[k]   = 0;
						that.doAnimate += 1;
					}else{
						if(that.aDataType[k] == 1){
							that.object.css(k,that.aData[k][o.acNum]);
						}else if(that.aDataType[k] == 2){
							var scale,rotateX,rotateY,rotateZ;
							switch(k){
								case "scale" :
									scale = that.aData[k][o.acNum];
									rotateX = that.object.attr("rotateX") || 0;
									rotateY = that.object.attr("rotateY") || 0;
									rotateZ = that.object.attr("rotateZ") || 0;
								break;
								case "rotateX" :
									rotateX = that.aData[k][o.acNum];
									scale   = that.object.attr("scale")   || 1;
									rotateY = that.object.attr("rotateY") || 0;
									rotateZ = that.object.attr("rotateZ") || 0;
								break;
								case "rotateY" :
									rotateY = that.aData[k][o.acNum];
									scale   = that.object.attr("scale")   || 1;
									rotateX = that.object.attr("rotateX") || 0;
									rotateZ = that.object.attr("rotateZ") || 0;
								break;
								case "rotateZ" :
									rotateZ = that.aData[k][o.acNum];
									scale   = that.object.attr("scale")   || 1;
									rotateY = that.object.attr("rotateY") || 0;
									rotateX = that.object.attr("rotateX") || 0;
								break;
							}
							that.object.attr(k,that.aData[k][o.acNum]);
							that.object.css("transform","scale(" + scale + ") rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) rotateZ(" + rotateZ + "deg)");
							that.object.css("-webkit-transform","scale(" + scale + ") rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) rotateZ(" + rotateZ + "deg)");
						}else{	
							that.object.css(k,parseInt(that.aData[k][o.acNum],10));
						}
					}
				}else if(that.aDataType[k] == 3){
					if(o.acNum >= that.aData[k][0].length && that.aLive[k]){
						that.aLive[k]   = 0;
						that.doAnimate += 1;
					}else{
						var cR = parseInt(that.aData[k][0][o.acNum],10);
						var cG = parseInt(that.aData[k][1][o.acNum],10);
						var cB = parseInt(that.aData[k][2][o.acNum],10);
						that.object.css(k,'rgb(' + cR + ',' + cG + ',' + cB + ')');
					}
				}
			}
			// finish
			if(that.doAnimate >= that.totalAnimate || o.acNum > 1200){ // maxFrame 1200
				o.stop();
				that.init();
				that.vvCallBack();
			}
		});
	},
	initDataColor : function(key){
		var beginColor = this.object.css(key) || "#ffffff";
		var endColor = this.param[key];
		var reg = /#/;
		var reg2 = /rgb/i;
		var beginColorArr = [];
		var endColorArr = [];
		if(reg.test(beginColor)){
			beginColorArr = this.colorToNum(beginColor);
		}else if(reg2.test(beginColor)){
			beginColorArr = this.rgbToNum(beginColor);
		}
		if(reg.test(endColor)){
			endColorArr = this.colorToNum(endColor);
		}else if(reg2.test(endColor)){
			endColorArr = this.rgbToNum(endColor);
		}
		this.aData[key] = [];
		if(this.tween){
			this.aData[key][0] = vvGetAnimateData(beginColorArr[0],endColorArr[0],this.tEnd,this.tween);
			this.aData[key][1] = vvGetAnimateData(beginColorArr[1],endColorArr[1],this.tEnd,this.tween);
			this.aData[key][2] = vvGetAnimateData(beginColorArr[2],endColorArr[2],this.tEnd,this.tween);
		}else{
			this.aData[key][0] = vvGetAnimateData2(beginColorArr[0],endColorArr[0],10,this.tweenId);
			this.aData[key][1] = vvGetAnimateData2(beginColorArr[1],endColorArr[1],10,this.tweenId);
			this.aData[key][2] = vvGetAnimateData2(beginColorArr[2],endColorArr[2],10,this.tweenId);
		}
		this.object.css(key,'rgb(' + beginColorArr[0] + ',' + beginColorArr[1] + ',' + beginColorArr[2] + ')');
		this.totalAnimate += 1;
		this.aLive[key] = 1;
		this.aDataType[key] = 3;
	},
	colorToNum : function(color){
		var colorR = color.substr(1,2);
		var colorG = color.substr(3,2);
		var colorB = color.substr(5,2);
		var backArr = [];
		backArr.push(parseInt(colorR,16));
		backArr.push(parseInt(colorG,16));
		backArr.push(parseInt(colorB,16));
		return backArr;
	},
	rgbToNum : function(color){
		var reg = /(\d+)\D+(\d+)\D+(\d+)\D+/i;
		var match = color.match(reg);
		var backArr = [];
		backArr.push(parseInt(match[1],10));
		backArr.push(parseInt(match[2],10));
		backArr.push(parseInt(match[3],10));
		return backArr;
	},
	getTween : function(tweenId){
		var tweenArr = {
			"0"  : vvTween.Linear,
			"1"  : vvTween.Quad.easeIn,
			"2"  : vvTween.Quad.easeOut,
			"3"  : vvTween.Quad.easeInOut,
			"11" : vvTween.Cubic.easeIn,
			"12" : vvTween.Cubic.easeOut,
			"13" : vvTween.Cubic.easeInOut,
			"21" : vvTween.Quart.easeIn,
			"22" : vvTween.Quart.easeOut,
			"23" : vvTween.Quart.easeInOut,
			"31" : vvTween.Quint.easeIn,
			"32" : vvTween.Quint.easeOut,
			"33" : vvTween.Quint.easeInOut,
			"41" : vvTween.Sine.easeIn,
			"42" : vvTween.Sine.easeOut,
			"43" : vvTween.Sine.easeInOut,
			"51" : vvTween.Expo.easeIn,
			"52" : vvTween.Expo.easeOut,
			"53" : vvTween.Expo.easeInOut,
			"61" : vvTween.Circ.easeIn,
			"62" : vvTween.Circ.easeOut,
			"63" : vvTween.Circ.easeInOut,
			"71" : vvTween.Elastic.easeIn,
			"72" : vvTween.Elastic.easeOut,
			"73" : vvTween.Elastic.easeInOut,
			"81" : vvTween.Back.easeIn,
			"82" : vvTween.Back.easeOut,
			"83" : vvTween.Back.easeInOut,
			"91" : vvTween.Bounce.easeIn,
			"92" : vvTween.Bounce.easeOut,
			"93" : vvTween.Bounce.easeInOut
		};
		return tweenArr[tweenId.toString()] || 0;
	}
}

/* vvTween */
var vvTween = {
	Linear : function(t, b, c, d){
		return c*t/d + b;
	},
	Quad : {
		easeIn : function(t, b, c, d){
			return c * (t /= d) * t + b;
		},
		easeOut: function(t, b, c, d) {
			return -c *(t /= d)*(t-2) + b;
		},
		easeInOut: function(t, b, c, d) {
			if ((t /= d / 2) < 1) return c / 2 * t * t + b;
			return -c / 2 * ((--t) * (t-2) - 1) + b;
		}
	},
    Cubic : {
        easeIn : function(t, b, c, d) {
            return c * (t /= d) * t * t + b;
        },
        easeOut : function(t, b, c, d) {
            return c * ((t = t/d - 1) * t * t + 1) + b;
        },
        easeInOut : function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t*t + b;
            return c / 2*((t -= 2) * t * t + 2) + b;
        }
    },
    Quart : {
        easeIn : function(t, b, c, d) {
            return c * (t /= d) * t * t*t + b;
        },
        easeOut : function(t, b, c, d) {
            return -c * ((t = t/d - 1) * t * t*t - 1) + b;
        },
        easeInOut : function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
            return -c / 2 * ((t -= 2) * t * t*t - 2) + b;
        }
    },
    Quint : {
        easeIn: function(t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        },
        easeOut : function(t, b, c, d) {
            return c * ((t = t/d - 1) * t * t * t * t + 1) + b;
        },
        easeInOut : function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
            return c / 2*((t -= 2) * t * t * t * t + 2) + b;
        }
    },
    Sine : {
        easeIn: function(t, b, c, d) {
            return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
        },
        easeOut: function(t, b, c, d) {
            return c * Math.sin(t/d * (Math.PI/2)) + b;
        },
        easeInOut: function(t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t/d) - 1) + b;
        }
    },
    Expo : {
        easeIn: function(t, b, c, d) {
            return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
        },
        easeOut: function(t, b, c, d) {
            return (t==d) ? b + c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
        },
        easeInOut: function(t, b, c, d) {
            if (t==0) return b;
            if (t==d) return b+c;
            if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        }
    },
    Circ : {
        easeIn: function(t, b, c, d) {
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
        },
        easeOut: function(t, b, c, d) {
            return c * Math.sqrt(1 - (t = t/d - 1) * t) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        }
    },
    Elastic : {
        easeIn: function(t, b, c, d, a, p) {
            var s;
            if (t==0) return b;
            if ((t /= d) == 1) return b + c;
            if (typeof p == "undefined") p = d * .3;
            if (!a || a < Math.abs(c)) {
                s = p / 4;
                a = c;
            } else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        },
        easeOut : function(t, b, c, d, a, p) {
            var s;
            if (t==0) return b;
            if ((t /= d) == 1) return b + c;
            if (typeof p == "undefined") p = d * .3;
            if (!a || a < Math.abs(c)) {
                a = c; 
                s = p / 4;
            } else {
                s = p/(2*Math.PI) * Math.asin(c/a);
            }
            return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
        },
        easeInOut : function(t, b, c, d, a, p) {
            var s;
            if (t==0) return b;
            if ((t /= d / 2) == 2) return b+c;
            if (typeof p == "undefined") p = d * (.3 * 1.5);
            if (!a || a < Math.abs(c)) {
                a = c; 
                s = p / 4;
            } else {
                s = p / (2  *Math.PI) * Math.asin(c / a);
            }
            if (t < 1) return -.5 * (a * Math.pow(2, 10* (t -=1 )) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p ) * .5 + c + b;
        }
    },
    Back : {
        easeIn : function(t, b, c, d, s) {
            if (typeof s == "undefined") s = 1.70158;
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },
        easeOut : function(t, b, c, d, s) {
            if (typeof s == "undefined") s = 1.70158;
            return c * ((t = t/d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        easeInOut : function(t, b, c, d, s) {
            if (typeof s == "undefined") s = 1.70158; 
            if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            return c / 2*((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        }
    },
    Bounce : {
        easeIn : function(t, b, c, d) {
            return c - vvTween.Bounce.easeOut(d-t, 0, c, d) + b;
        },
        easeOut : function(t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
            } else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
            }
        },
        easeInOut : function(t, b, c, d) {
            if (t < d / 2) {
                return vvTween.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
            } else {
                return vvTween.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
            }
        }
    }
}