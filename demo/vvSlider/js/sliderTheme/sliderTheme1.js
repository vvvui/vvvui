
(function(window, document){
	
	var sliderTheme1 = function(){
		
		this.themeDomInit = function(){
			this.dom.find(".sp").css({
				"display"  : "none",
				"position" : this.domPosition,
				"overflow" : "hidden",
				"top"      : this.dom.height(),
				"left"     : "100%",
				"width"    : this.dom.find(".sp").width(),
				"height"   : this.dom.find(".sp").height(),
				opacity    : 1,
				transition : "none",
				"-webkit-transition" : "none",
				transform  : "rotateX(0deg) scale(1) rotateY(0deg) rotateZ(0deg) translateX(0px)",
				"-webkit-transform"  : "rotateX(0deg) scale(1) rotateY(0deg) rotateZ(0deg) translateX(0px)"
			});
			$("#slideFrames").css({
				overflow : "hidden"
			});
		}
		
		this.themeInitPos = function(){
			this.actionDistance = this.param.actionDistance || parseInt(this.scrollWidth/10);
			$(this.contentArr[this.showId]).css({
				display : "block",
				left : 0,
				top  : 0
			});
			$(this.contentArr[this.preId]).css({
				display : "block",
				left : -this.scrollWidth,
				top  : 0
			});
			$(this.contentArr[this.nextId]).css({
				display : "block",
				left : this.scrollWidth,
				top  : 0
			});
		}
		
		this.themeSetMovePos = function(changeX){
			var addplus = changeX > 0 ? 1 : -1;
			$(this.contentArr[this.showId]).css({
				"left" : this.sL + (Math.abs(changeX) < this.scrollWidth ? changeX : this.scrollWidth *addplus)
			});
			$(this.contentArr[this.preId]).css({
				"left" : this.sLPre + (Math.abs(changeX) < this.scrollWidth ? changeX : this.scrollWidth *addplus)
			});
			$(this.contentArr[this.nextId]).css({
				"left" : this.sLNext + (Math.abs(changeX) < this.scrollWidth ? changeX : this.scrollWidth *addplus)
			});
		}
		
		this.themeSetEndPos = function(){
			this.derection = this.checkMoveDerectionX();
			this.endL = this.sL + this.scrollWidth * this.derection;
			var that = this;
			if(that.acLock) return;
			that.acLock = 1;
			var aStart = parseInt($(this.contentArr[this.showId]).css("left"),10);
			var aEnd   = this.endL;
			var tEnd  = 500 / (1000/80);
			this.aData = vvGetAnimateData(aStart,aEnd,tEnd,vvTween.Sine.easeOut);
			var sWidth = parseInt($(that.contentArr[that.showId]).css("width"),10);
			new vvSchedule(function(o){
				if(o.acNum >= that.aData.length){
					that.acLock = 0;
					that.scrollLock = 0;
					if(that.param.callBack){
						that.param.callBack(that.showId);
					}
					that.showId -= that.derection;
					that.showId = that.showId < 0 ? that.contentLen - 1 : that.showId;
					that.showId = that.showId > that.contentLen - 1 ? 0 : that.showId;
					that.setId();
					that.initPos();
					o.stop();
				}else{
					$(that.contentArr[that.showId]).css({
						left   : that.aData[o.acNum]
					});
					$(that.contentArr[that.preId]).css({
						left   : that.aData[o.acNum] - sWidth
					});
					$(that.contentArr[that.nextId]).css({
						left   : that.aData[o.acNum] + sWidth
					});
				}
			},100);
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
			if(toId == this.showId){
				return;
			}
			var that = this;
			for(var i=0; i < this.contentLen; i++){
				$(this.contentArr[i]).css({
					"left" : (i - this.showId) * this.scrollWidth,
					"opacity" : 1,
					"display" : "block",
					"top"  : 0
				});
			}
			var aStart = parseInt($(this.contentArr[this.showId]).css("left"),10);
			var aEnd   = (this.showId - toId) * this.scrollWidth;
			var tEnd  = 1000 / (1000/60);
			this.aData = vvGetAnimateData(aStart,aEnd,tEnd,vvTween.Quart.easeOut);
			new vvSchedule(function(o){
				if(o.acNum >= that.aData.length){
					that.scrollLock = 0;
					that.showId = toId;
					that.refresh();
					o.stop();
				}else{
					for(var i=0; i < that.contentLen; i++){
						$(that.contentArr[i]).css({
							"left"  : that.aData[o.acNum] + (i - that.showId) * that.scrollWidth
						});
					}
				}
			});
		}
	}
	
	window.sliderTheme1 = sliderTheme1;
	
})(window, document);
