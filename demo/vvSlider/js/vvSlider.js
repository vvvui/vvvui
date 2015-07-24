
(function(window, document){
	
	var themeDir = vvGetFileDir("vvSlider.js");
	themeDir += "sliderTheme/";
	
	var vvSlider = function (param) {
		this.param = param;
		this.domId = this.param.domId || "vvSlider";
		this.dom   = $("#" + this.domId);
		this.addPos = this.param.addPos || 30;
		this.domPosition = this.param.domPosition || "absolute";
		this.theme = this.param.theme || 0;
		this.loop  = this.param.loop  || 0;
		this.speed = this.param.speed || (vvIe ? 10 : 20);
		this.loadedTheme = [];
		this.themeInit(1);
	}
	
	vvSlider.prototype = {
		initialize : function(ac){
			switch(this.theme){
				case 0:
					sliderTheme0.call(this);
				break;
				case 1:
					sliderTheme1.call(this);
				break;
				case 2:
					sliderTheme2.call(this);
				break;
				case 3:
					sliderTheme3.call(this);
				break;
				case 4:
					sliderTheme4.call(this);
				break;
			}
			switch(ac){
				case 1:
					this.init();
				break;
				case 2:
					this.refresh();
				break;
			}
		},
		init : function(){
			this.dom.css({
				"position" : "relative",
				"overflow" : "hidden"
			});
			this.scrollWidth  = this.dom.find(".sp").width();
			this.scrollHeight = this.dom.find(".sp").height();
			this.domInit();
			this.setId();
			this.initPos();
			this.actionInit();
			this.acLock = 0;
		},
		refresh : function(){
			this.domInit();
			this.setId();
			this.initPos();
		},
		themeInit : function(ac){
			if(this.loadedTheme && this.loadedTheme[this.theme]){
				this.initialize(ac);
				return;
			}
			var themeRequire = vvRequire(themeDir + "sliderTheme" + this.theme + ".js");
			var that = this;
			themeRequire.onload = function(){
				that.initialize(ac);
			}
			this.loadedTheme[this.theme] = 1;
		},
		actionInit : function(){
			this.preDomId  = this.param.preDomId || "preFrame";
			this.preDom    = $("#" + this.preDomId);
			this.nextDomId = this.param.nextDomId || "nextFrame";
			this.nextDom   = $("#" + this.nextDomId);
			this.preDom.bindTouch(this.showPreFrame,this);
			this.nextDom.bindTouch(this.showNextFrame,this);
			this.dom.bindTouchGroup(this);
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
			$(window).bind("resize",function(event){
				that.refresh();
			});
		},
		showPreFrame : function(obj,that){
			that.scrollLock = 1;
			that.setStartPos();
			that.themeShowPreFrame();
			that.setEndPos();
		},
		showNextFrame : function(obj,that){
			that.scrollLock = 1;
			that.setStartPos();
			that.themeShowNextFrame();
			that.setEndPos();
		},
		domInit : function(){
			this.themeDomInit();
			this.contentArr = this.dom.find(".sp");
			this.contentLen = this.contentArr.length;
			if(this.theme == 4){
				this.theme4InitData();
			}
		},
		setId : function(){
			this.showId = this.showId || 0;
			this.preId  = this.showId - 1 < 0 ? this.contentLen - 1 : this.showId - 1;
			this.nextId = this.showId + 1 > this.contentLen - 1 ? 0 : this.showId + 1;
			this.showContent = $(this.contentArr[this.showId]).find('.sliderContent');
		},
		initPos : function(){
			this.themeInitPos();
		},
		setStartPos : function(){
			this.sT = this.contentArr[this.showId].offsetTop;
			this.sTPre = this.contentArr[this.preId].offsetTop;
			this.sTNext = this.contentArr[this.nextId].offsetTop;
			this.sL = this.contentArr[this.showId].offsetLeft;
			this.sLPre = this.contentArr[this.preId].offsetLeft;
			this.sLNext = this.contentArr[this.nextId].offsetLeft;
		},
		setMovePos : function(changeX,changeY){
			switch(this.theme){
				case 0:
					if(!this.loop && ((this.showId == this.contentLen - 1 && changeY < 0) || (this.showId == 0 && changeY > 0))){
						return;
					}
					if(Math.abs(changeY) < 20){
						return;
					}
					this.themeSetMovePos(changeY);
				break;
				case 1:
				case 2:
				case 3:
				case 4:
					if(!this.loop && ((this.showId == this.contentLen - 1 && changeX < 0) || (this.showId == 0 && changeX > 0))){
						return;
					}
					if(Math.abs(changeX) < 20){
						return;
					}
					this.themeSetMovePos(changeX);
				break;
			}
		},
		setEndPos : function(){
			this.themeSetEndPos();
		},
		checkMoveDerectionX : function(){
			var derection;
			if(Math.abs(this.sX-this.eX) < this.actionDistance){
				derection = 0;
			}else if(this.sX > this.eX){
				derection = -1;
				if(!this.loop && this.showId == this.contentLen - 1){
					derection = 0;
				}
			}else{
				derection = 1;
				if(!this.loop && this.showId == 0){
					derection = 0;
				}
			}
			return derection;
		},
		checkMoveDerectionY : function(){
			var derection;
			if(Math.abs(this.sY-this.eY) < this.actionDistance){
				derection = 0;
			}else if(this.sY > this.eY){
				derection = -1;
				if(!this.loop && this.showId == this.contentLen - 1){
					derection = 0;
				}
			}else{
				derection = 1;
				if(!this.loop && this.showId == 0){
					derection = 0;
				}
			}
			return derection;
		},
		touchDown : function(event,eventObj){
			if(this.acLock) return;
			if(this.scrollLock) return;
			this.sX = event.pageX || event.x;
			this.sY = event.pageY || event.y;
			if(this.lockTop && this.sY > this.lockTop) return;
			this.mX = 0;
			this.mY = 0;
			this.scrollLock = 1;
			this.moveLock = true;
			this.setStartPos();
		},
		touchMove : function(event,eventObj){
			var that = this;
			if(that.it){
				clearTimeout(that.it);
			}
			this.isToAction = 0;
			that.it = setTimeout(function(){
				that.isToAction = 1;
				that.touchUp(event,eventObj);
				clearTimeout(that.it);
			},300);
			if(!this.moveLock) return;
			this.scrollLock = 0;
			this.mX = event.pageX || event.x;
			var changeX = this.mX - this.sX;
			this.mY = event.pageY || event.y;
			var changeY = this.mY - this.sY;
			this.setMovePos(changeX,changeY);
		},
		touchUp : function(event,eventObj){
			if(!this.moveLock) return;
			this.moveLock = false;
			if(this.scrollLock){
				this.scrollLock = 0;
				return;
			}
			if(this.mX == undefined || this.mY == undefined){
				this.sX = 0;
				this.eX = -this.actionDistance - 1;
				this.sY = 0;
				this.eY = -this.actionDistance - 1;
			}else{
				this.eX = this.mX || this.sX;
				this.eY = this.mY || this.sY;
			}
			this.setEndPos();
		}
	}
	
	/* control bar */
	vvSlider.prototype.setSlideControl = function(){
		this.controlId = this.param.FrameCode || "FrameCode";
		this.controlDom = $("#" + this.controlId);
		var controlArr = this.controlDom.find(".sliderFrameId");
		var cLen = controlArr.length;
		var that = this;
		for(var i=0; i < cLen; i++){
			(function(id){
				$(controlArr[id]).bindTouch(function(obj,that){
					that.scrollLock = 1;
					var toId = Math.abs(parseInt(id) % that.contentLen);
					that.themeSlideTo(toId);
				},that);
			})(i);
		}
	}
	
	//callBack
	window.vvSlider = vvSlider;
	
})(window, document);
