
(function(window, document){
	
	var vvScroll = function (param) {
		this.param = param;
		this.domId = this.param.domId || "vvScroll";
		this.dom   = $("#" + this.domId);
		this.inner = this.dom.html();
		this.addPos = this.param.addPos || 30;
		this.derection = this.param.derection || 0; // 0-vertical 1-horizontal
		this.init();
	}
	
	vvScroll.prototype = {
		init : function(){
			this.scrollDiv = document.createElement("div");
			this.scrollDom = $(this.scrollDiv);
			this.scrollDom.html(this.inner);
			this.dom.html(this.scrollDom);
			this.dom.css({
				"position" : "relative",
				"overflow" : "hidden"
			});
			this.scrollDom.css({
				top      : 0,
				left     : 0,
				position : "absolute",
				width    : this.param.contentWidth || "100%"
			});
			this.scrollDom.addClass("unSelect");
			this.scrollDom.bindTouchGroup(this);
			var that = this;
			if(!vvMobile){
				$(window).bindTouchGroup({
					touchDown : function(){},
					touchMove : function(){},
					touchUp : function(event,eventObj){
						that.touchUp(event,eventObj);
					}
				});
			}
		},
		touchDown : function(event,eventObj){
			// if(!vvMobile && this.scrollLock) return;
			// this.scrollLock = 1;
			this.moveLock = true;
			this.isMove = 0;
			this.sX = event.pageX || event.x;
			this.sY = event.pageY || event.y;
			if(this.derection){
				this.sL = parseInt(this.scrollDom.css("left"));
				this.lastPosX  = this.sX;
				this.sLastPosX = this.sX;
			}else{
				this.sT = this.scrollDom[0].offsetTop;
				this.lastPosY  = this.sY;
				this.sLastPosY = this.sY;
			}
		},
		touchMove : function(event,eventObj){
			if(!this.moveLock) return;
			if(this.animate && this.animate.schedule){
				this.animate.schedule.stop();
			}
			if(this.derection){
				this.mX = event.pageX || event.x;
				if(Math.abs(this.mX - this.sX) >= 10){
					this.isMove = 1;
				}
				this.sLastPosX = this.lastPosX;
				this.lastPosX = this.mX;
				var changeX = this.mX - this.sX;
				this.scrollDom.css({
					"transition" : "none",
					"-webkit-transition" : "none",
					"left" : this.sL + changeX
				});
			}else{
				this.mY = event.pageY || event.y;
				if(Math.abs(this.mY - this.sY) >= 10){
					this.isMove = 1;
				}
				this.sLastPosY = this.lastPosY;
				this.lastPosY = this.mY;
				var changeY = this.mY - this.sY;
				this.scrollDom.css({
					"transition" : "none",
					"-webkit-transition" : "none",
					"top" : this.sT + changeY
				});
			}
			/* move outSide */
			var that = this;
			if(vvMobile || vvIe){
				if(that.it){
					clearTimeout(that.it);
					that.it = null;
				}
				that.it = setTimeout(function(){
					that.touchUp(event,eventObj);
					clearTimeout(that.it);
				},300);
			}
		},
		touchUp : function(event,eventObj){
			if(!this.moveLock) return;
			this.moveLock = false;
			if(!this.isMove){
				if(this.param.clickCallBack){
					this.param.clickCallBack(this.sX,this.sY);
				}
			}
			if(this.derection){
				var addRate = Math.abs(this.lastPosX - this.sLastPosX) > 2 ? this.lastPosX - this.sLastPosX : 0;
				var oX = parseInt(this.scrollDom.css("left"),10);
				oX += parseInt(this.addPos * addRate,10);
				// 边界校正
				var moveX;
				var maxLeftPos = -(parseInt(this.scrollDom.width()) - parseInt(this.dom.width()));
				moveX = oX > maxLeftPos ? oX : maxLeftPos;
				moveX = moveX < 0 ? moveX : 0;
				
				var moveY = this.scrollDom[0].offsetTop;
				this.scrollTo(moveX,moveY);
			}else{
				var addRate = Math.abs(this.lastPosY - this.sLastPosY) > 2 ? this.lastPosY - this.sLastPosY : 0;
				var oY = this.scrollDom[0].offsetTop;
				oY += parseInt(this.addPos * addRate,10);
				// 边界校正
				var moveY;
				var maxTopPos = -(parseInt(this.scrollDom.height()) - parseInt(this.dom.height()));
				moveY = oY > maxTopPos ? oY : maxTopPos;
				moveY = moveY < 0 ? moveY : 0;
				var moveX = this.scrollDom[0].offsetLeft;
				this.scrollTo(moveX,moveY);
			}
		},
		scrollTo : function(toX,toY){
			var that = this;
			if(this.animate && this.animate.schedule){
				this.animate.schedule.stop();
			}
			this.scrollDom.vvAnimate({
				left : toX,
				top  : toY
			},function(){
				if(that.param.callBack){
					that.param.callBack(pos);
				}
			},this);
		}
	}
	
	//callback
	window.vvScroll = vvScroll;
	
})(window, document);
