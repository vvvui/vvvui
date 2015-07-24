
(function(window, document){
	
	var sliderTheme2 = function(){
		
		this.themeDomInit = function(){
			this.dom.find(".sp").css({
				"display"  : "none",
				"position" : this.domPosition,
				"overflow" : "hidden",
				"top"      : this.dom.height(),
				"left"     : 0,
				"width"    : this.dom.find(".sp").width(),
				"height"   : this.dom.find(".sp").height(),
				opacity    : 1,
				transition : "none",
				"-webkit-transition" : "none",
				transform  : "rotateX(0deg) scale(1) rotateY(0deg) rotateZ(0deg) translateX(0px)",
				"-webkit-transform"  : "rotateX(0deg) scale(1) rotateY(0deg) rotateZ(0deg) translateX(0px)"
			});
			$("#slideFrames").css({
				overflow : "visible"
			});
		}
		
		this.themeInitPos = function(){
			this.actionDistance = this.param.actionDistance || parseInt(this.scrollWidth/10);
			var rx = 0;
			$(this.contentArr[this.showId]).css({
				"display"  : "block",
				left : 0,
				top  : 0,
				opacity : 1,
				transform : "rotateX(0deg) scale(1) rotateY(" + rx + "eg) rotateZ(0deg)",
				"-webkit-transform" : "rotateX(0deg) scale(1) rotateY(" + rx + "deg) rotateZ(0deg)"
			});
			$(this.contentArr[this.preId]).css({
				"display"  : "block",
				left : 0,
				top  : 0,
				opacity : 0,
				transform : "rotateX(0deg) scale(1) rotateY(-90deg) rotateZ(0deg)",
				"-webkit-transform" : "rotateX(0deg) scale(1) rotateY(-90deg) rotateZ(0deg)"
			});
			$(this.contentArr[this.nextId]).css({
				"display"  : "block",
				left : 0,
				top  : 0,
				opacity : 0,
				transform : "rotateX(0deg) scale(1) rotateY(90deg) rotateZ(0deg)",
				"-webkit-transform" : "rotateX(0deg) scale(1) rotateY(90deg) rotateZ(0deg)"
			});
		}
		
		this.themeSetMovePos = function(changeX){
			this.dom.find(".sp").css({
				transition : "none",
				"-webkit-transition" : "none",
			});
			var sChangeX = changeX;
			var changeX = Math.abs(changeX);
			var rotate = (changeX / (this.scrollWidth)) * 90;
			rotate = rotate > 90 ? 90 : rotate;
			
			if(sChangeX > 0){
				$(this.contentArr[this.showId]).css({
					opacity : 1 - (changeX / (this.scrollWidth)) < 0 ? 0 : 1 - (changeX / (this.scrollWidth)),
					transition : "none",
					"-webkit-transition" : "none",
					transform : "rotateX(-10deg) scale(1) rotateY(" + rotate + "deg) rotateZ(0deg)",
					"-webkit-transform" : "rotateX(-10deg) scale(1) rotateY(" + rotate + "deg) rotateZ(0deg)"
				});
				$(this.contentArr[this.preId]).css({
					opacity : (changeX / (this.scrollWidth)),
					transition : "none",
					"-webkit-transition" : "none",
					transform : "rotateX(10deg) scale(1) rotateY(" + (90 - rotate) + "deg) rotateZ(0deg)",
					"-webkit-transform" : "rotateX(10deg) scale(1) rotateY(" + (90 - rotate) + "deg) rotateZ(0deg)"
				});
			}else{
				$(this.contentArr[this.showId]).css({
					opacity : 1 - (changeX / (this.scrollWidth)) < 0 ? 0 : 1 - (changeX / (this.scrollWidth)),
					transition : "none",
					"-webkit-transition" : "none",
					transform : "rotateX(-10deg) scale(1) rotateY(" + (- rotate) + "deg) rotateZ(0deg)",
					"-webkit-transform" : "rotateX(-10deg) scale(1) rotateY(" + ( - rotate) + "deg) rotateZ(0deg)"
				});
				$(this.contentArr[this.nextId]).css({
					opacity : (changeX / (this.scrollWidth)),
					transition : "none",
					"-webkit-transition" : "none",
					transform : "rotateX(10deg) scale(1) rotateY(" + (-90 +  rotate) + "deg) rotateZ(0deg)",
					"-webkit-transform" : "rotateX(10deg) scale(1) rotateY(" + (-90 + rotate) + "deg) rotateZ(0deg)"
				});
			}
		}
		
		this.themeSetEndPos = function(){
			this.derection = this.checkMoveDerectionX();
			if(this.derection == 1){
				$(this.contentArr[this.showId]).css({
					opacity : 0,
					transition: "0.5s all cubic-bezier(.09,.25,.15,.8)",
					"-webkit-transition": "0.5s all cubic-bezier(.09,.25,.15,.8)",
					transform : "rotateX(0deg) scale(1) rotateY(90deg) rotateZ(0deg)",
					"-webkit-transform" : "rotateX(0deg) scale(1) rotateY(90deg) rotateZ(0deg)"
				});
				$(this.contentArr[this.preId]).css({
					opacity : 1,
					transition : "0.5s all cubic-bezier(.09,.25,.15,.8)",
					"-webkit-transition" : "0.5s all cubic-bezier(.09,.25,.15,.8)",
					transform : "rotateX(0deg) scale(1) rotateY(0deg) rotateZ(0deg)",
					"-webkit-transform" : "rotateX(0deg) scale(1) rotateY(0deg) rotateZ(0deg)"
				});
				$(this.contentArr[this.nextId]).css({
					opacity : 0,
					transition : "0.5s all cubic-bezier(.09,.25,.15,.8)",
					"-webkit-transition" : "0.5s all cubic-bezier(.09,.25,.15,.8)"
				});
			}else if(this.derection == -1){
				$(this.contentArr[this.showId]).css({
					opacity : 0,
					transition: "0.5s all cubic-bezier(.09,.25,.15,.8)",
					"-webkit-transition": "0.5s all cubic-bezier(.09,.25,.15,.8)",
					transform : "rotateX(0deg) scale(1) rotateY(-90deg) rotateZ(0deg)",
					"-webkit-transform" : "rotateX(0deg) scale(1) rotateY(-90deg) rotateZ(0deg)"
				});
				$(this.contentArr[this.nextId]).css({
					opacity : 1,
					transition: "0.5s all cubic-bezier(.09,.25,.15,.8)",
					"-webkit-transition" : "0.5s all cubic-bezier(.09,.25,.15,.8)",
					transform : "rotateX(0deg) scale(1) rotateY(0deg) rotateZ(0deg)",
					"-webkit-transform" : "rotateX(0deg) scale(1) rotateY(0deg) rotateZ(0deg)"
				});
				$(this.contentArr[this.preId]).css({
					opacity : 0,
					transition : "0.5s all cubic-bezier(.09,.25,.15,.8)",
					"-webkit-transition" : "0.5s all cubic-bezier(.09,.25,.15,.8)"
				});
			}else{
				$(this.contentArr[this.showId]).css({
					opacity : 0,
					transition: "0.5s all cubic-bezier(.09,.25,.15,.8)",
					"-webkit-transition": "0.5s all cubic-bezier(.09,.25,.15,.8)",
					transform : "rotateX(0deg) scale(1) rotateY(0deg) rotateZ(0deg)",
					"-webkit-transform" : "rotateX(0deg) scale(1) rotateY(0deg) rotateZ(0deg)"
				});
			}
			var that = this;
			that.scrollLock = 1;
			var to = setTimeout(function(){
				that.scrollLock = 0;
				that.showId -= that.derection;
				that.showId = that.showId < 0 ? that.contentLen - 1 : that.showId;
				that.showId = that.showId > that.contentLen - 1 ? 0 : that.showId;
				that.setId();
				that.initPos();
				that.param.callBack(that.showId);
			},300);
		}
		
		this.themeShowPreFrame = function(){
			this.sX = 0;
			this.eX = this.sX + 100;
		}
		
		this.themeShowNextFrame = function(){
			this.sX = 0;
			this.eX = this.sX - 100;
		}
		
		this.themeSlideTo = function(toId){
			if(this.showId == toId){
				return;
			}
			this.dom.find(".sp").css({
				top : 0,
				left : 0,
				opacity : 0,
				transition: "1s opacity cubic-bezier(.09,.25,.15,.8)",
				"-webkit-transition" : "1s opacity cubic-bezier(.09,.25,.15,.8)",
				transform : "rotateX(0deg) scale(1) rotateY(0deg) rotateZ(0deg)",
				"-webkit-transform" : "rotateX(0deg) scale(1) rotateY(0deg) rotateZ(0deg)"
			});
			var that = this;
			this.showId = toId - 1 < 0 ? this.contentLen - 1 : toId - 1;
			that.deg = 0;
			var to = setTimeout(function(){
				that.dom.find(".sp").css({
					transition: "0.5s opacity cubic-bezier(.09,.25,.15,.8)",
					"-webkit-transition" : "0.5s opacity cubic-bezier(.09,.25,.15,.8)"
				});
				that.refresh();
				that.showNextFrame(0,that);
				clearTimeout(to);
			},500);
		}
		
	}
	
	window.sliderTheme2 = sliderTheme2;
	
})(window, document);
