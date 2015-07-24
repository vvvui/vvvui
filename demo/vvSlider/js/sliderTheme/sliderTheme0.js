
(function(window, document){
	
	var sliderTheme0 = function(){
		
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
				overflow : "hidden"
			});
		}
		
		this.themeInitPos = function(){
			this.actionDistance = this.param.actionDistance || parseInt(this.scrollHeight/10);
			$(this.contentArr[this.showId]).css({
				display : "block",
				left : 0,
				top  : 0
			});
			$(this.contentArr[this.preId]).css({
				display : "block",
				left : 0,
				top  : -this.scrollHeight
			});
			$(this.contentArr[this.nextId]).css({
				display : "block",
				left : 0,
				top  : this.scrollHeight
			});
		}
		
		this.themeSetMovePos = function(changeY){
			var addplus = changeY > 0 ? 1 : -1;
			$(this.contentArr[this.showId]).css({
				"top" : this.sT + (Math.abs(changeY) < this.scrollHeight ? changeY : this.scrollHeight *addplus)
			});
			$(this.contentArr[this.preId]).css({
				"top" : this.sTPre + (Math.abs(changeY) < this.scrollHeight ? changeY : this.scrollHeight *addplus)
			});
			$(this.contentArr[this.nextId]).css({
				"top" : this.sTNext + (Math.abs(changeY) < this.scrollHeight ? changeY : this.scrollHeight *addplus)
			});
		}
		
		this.themeSetEndPos = function(){
			this.derection = this.checkMoveDerectionY();
			this.endT = this.sT + this.scrollHeight * this.derection;
			if(this.acLock) return;
			this.acLock = 1;
			var that = this;
			var aStart = parseInt($(this.contentArr[this.showId]).css("top"),10);
			var aEnd   = this.endT;
			var tEnd  = 500 / (1000/80);
			this.aData = vvGetAnimateData(aStart,aEnd,tEnd,vvTween.Sine.easeOut);
			var sHeight = parseInt($(that.contentArr[that.showId]).css("height"),10);
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
						top   : that.aData[o.acNum]
					});
					$(that.contentArr[that.preId]).css({
						top   : that.aData[o.acNum] - sHeight
					});
					$(that.contentArr[that.nextId]).css({
						top   : that.aData[o.acNum] + sHeight
					});
				}
			},100);
		}
		
		this.themeShowPreFrame = function(){
			this.sY = 0;
			this.eY = this.sY + 100;
		}
		
		this.themeShowNextFrame = function(){
			this.sY = 0;
			this.eY = this.sY - 100;
		}
		
		this.themeSlideTo = function(toId){
			if(toId == this.showId){
				return;
			}
			var that = this;
			for(var i=0; i < this.contentLen; i++){
				$(this.contentArr[i]).css({
					"left" : 0,
					"opacity" : 1,
					"display" : "block",
					"top"  : (i - this.showId) * this.scrollHeight
				});
			}
			var aStart = parseInt($(this.contentArr[this.showId]).css("top"),10);
			var aEnd   = (this.showId - toId) * this.scrollHeight;
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
							"top"  : that.aData[o.acNum] + (i - that.showId) * that.scrollHeight
						});
					}
				}
			});
		}
		
	}
	
	window.sliderTheme0 = sliderTheme0;
	
})(window, document);
