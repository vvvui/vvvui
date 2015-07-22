/**
* 2015-07-22
* author cxj@1123588845@qq.com
* https://github.com/vvvui
*/

var wW = 320;
var wH = 540;
(function(window, document, $){
	
	var winW = $(window).width();
	var winH = $(window).height();
	
	var vvResizeObject = function (param) {
		this.param = param;
		this.domId = param.domId ? param.domId : "#vvResizeObject";
		this.dom   = $(this.domId);
		this.outSide = this.param.outSide || 0;
		this.callBack = this.param.callBack || 0;
		this.resizeCallBack = this.param.resizeCallBack || 0;
		this.moveCallBack = this.param.moveCallBack || 0;
		this.limit = this.param.limit || 0;
		this.init();
	}
	
	vvResizeObject.prototype = {
		init : function(){
			if(this.limit){
				this.minL = this.outSide ? (wW - winW)/2 : 0;
				this.maxL = this.outSide ? wW - (wW - winW)/2 : wW;
				this.minT = this.outSide ? (wH - winH)/2 : 0;
				this.maxT = this.outSide ? wH - (wH - winH)/2 : wH;
			}
			this.dom.bindMultiTouch(this);
		},
		touchDown : function(event,obj){
			var that = this;
			this.downTo = setTimeout(function(){
				that.moveLock = 1;
				// x
				var x  = event[0] && event[0].pageX ? event[0].pageX : event.x;
				var x1 = event[1] && event[1].pageX ? event[1].pageX : 0;
				that.tsx0 = x  || 0;
				that.tsx1 = x1 || 0;
				that.sL = parseInt($(obj).css("left")) || 0;
				that.sW = parseInt($(obj).css("width")) || 0;
				// y
				var y  = event[0] && event[0].pageY ? event[0].pageY : event.y;
				var y1 = event[1] && event[1].pageY ? event[1].pageY : 0;
				that.tsy0 = y  || 0;
				that.tsy1 = y1 || 0;
				that.sT = parseInt($(obj).css("top"))  || 0;
				that.sH = parseInt($(obj).css("height")) || 0;
				that.sRz = parseInt($(obj).attr("rotateZ")) || 0;
				clearTimeout(that.downTo);
			},200);
		},
		touchMove : function(event,obj){
			if(!this.moveLock){
				return;
			}
			// x
			var x  = event[0] && event[0].pageX ? event[0].pageX : event.x;
			var x1 = event[1] && event[1].pageX ? event[1].pageX : 0;
			this.tsx0 = this.tsx0 ? this.tsx0 : (x  || 0);
			this.tsx1 = this.tsx1 ? this.tsx1 : (x1 || 0);
			this.tmx0 = x  || 0;
			this.tmx1 = x1 || 0;
			// y
			var y  = event[0] && event[0].pageY ? event[0].pageY : event.y;
			var y1 = event[1] && event[1].pageY ? event[1].pageY : 0;
			this.tsy0 = this.tsy0 ? this.tsy0 : (y  || 0);
			this.tsy1 = this.tsy1 ? this.tsy1 : (y1 || 0);
			this.tmy0 = y  || 0;
			this.tmy1 = y1 || 0;
			// multi
			if(this.tmx1 && this.tmy1){
				// sData
				var xs = Math.abs(this.tsx1 - this.tsx0);
				var ys = Math.abs(this.tsy1 - this.tsy0);
				var ds = Math.sqrt(xs*xs + ys*ys);
				var degS = Math.atan2(this.tsy1 - this.tsy0,this.tsx1 - this.tsx0)*(180/Math.PI);
				// eData
				var xe = Math.abs(this.tmx1 - this.tmx0);
				var ye = Math.abs(this.tmy1 - this.tmy0);
				var de = Math.sqrt(xe*xe + ye*ye);
				var degE = Math.atan2(this.tmy1 - this.tmy0,this.tmx1 - this.tmx0)*(180/Math.PI);
				var cRz = degE - degS;
				var rZ = (this.sRz + cRz) % 360;
				rZ += rZ < 0 ? 360 : 0;
				rZ = Math.abs(rZ)  < 3 ? 0 : rZ;
				rZ = (Math.abs(rZ) > 87  && Math.abs(rZ) < 93)  ? 90  : rZ;
				rZ = (Math.abs(rZ) > 177 && Math.abs(rZ) < 183) ? 180 : rZ;
				rZ = (Math.abs(rZ) > 267 && Math.abs(rZ) < 273) ? 270 : rZ;
				rZ = Math.abs(rZ)  > 357 ? 0 : rZ;
				// change
				var changeD = de - ds > 0 ? 1 : -1;
				var changeR = ds ? Math.abs(de - ds)/ds : 1;
				var eW = this.sW + this.sW * changeR * changeD;
				var eH = this.sH + this.sH * changeR * changeD;
				var eL = this.sL + (this.sW - eW)/2;
				/* limit */
				if(eW > winW && this.limit){
					eW = winW;
					eH = eW * this.sH/this.sW;
					eL = 0;
				}
				/* limit end */
				var eT = this.sT + (this.sH - eH)/2;
				$(obj).css({
					"width"  : eW,
					"height" : eH,
					"left"   : eL,
					"top"    : eT,
					"transform" : "rotateZ(" + rZ + "deg)",
					"-webkit-transform" : "rotateZ(" + rZ + "deg)"
				});
				$(obj).attr("rotateZ",rZ);
				if(this.resizeCallBack){
					var bo = {};
					bo.eW = eW;
					bo.eH = eH;
					bo.eL = eL;
					bo.eT = eT;
					bo.rZ = rZ;
					this.resizeCallBack(bo);
				}
			}
			// single
			else{
				var changeX = this.tmx0 - this.tsx0;
				var changeY = this.tmy0 - this.tsy0;
				var eL = this.sL + changeX;
				var eT = this.sT + changeY;
				/* limit */
				if(this.limit){
					var maxL = (this.maxL - this.sW);
					var maxT = (this.maxT - this.sH);
					eL = eL > this.minL ? eL : this.minL;
					eL = eL < maxL ? eL : maxL;
					eT = eT > this.minT ? eT : this.minT;
					eT = eT < maxT ? eT : maxT;
				}
				/* limit end */
				$(obj).css({
					"left" : eL,
					"top"  : eT
				});
				if(this.moveCallBack){
					var bo = {};
					bo.eL = eL;
					bo.eT = eT;
					this.moveCallBack(bo);
				}
				/* move outSide */
				var that = this;
				if(!isMobile){
					if(that.it){
						clearTimeout(that.it);
						that.it = null;
					}
					that.it = setTimeout(function(){
						that.touchUp(event,obj);
						clearTimeout(that.it);
					},300);
				}
			}
		},
		touchUp : function(event,obj){
			if(this.downTo){
				clearTimeout(this.downTo);
			}
			if(!this.moveLock){
				return;
			}
			this.moveLock = 0;
			this.tsx1 = 0;
			this.tsy1 = 0;
			if(this.callBack){
				this.callBack();
			}
		}
	}
	
	window.vvResizeObject = vvResizeObject;
	
})(window, document, jQuery);
