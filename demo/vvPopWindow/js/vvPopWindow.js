
(function(window, document){
	
	var vvPopWindow = function(param){
		this.param = param;
		this.init();
	}
	
	vvPopWindow.prototype = {
		init : function(){
			this.createMaskLayer();
			this.createWin();
			this.actionInit();
			this.moveInit();
			var that = this;
			$(window).bind("resize",function(event){
				that._resize();
			});
		},
		createWin : function(){
			this.showDomId = this.param.showDomId || "vvPopWin";
			this.openWin   = $("#" + this.showDomId);
			this.winPosition = this.param.winPosition || 0;
			var scrollTop = 0;
			var posotion  = "fixed";
			var dW = $(window).width();
			var dH = $(window).height();
			if(this.winPosition){
				dW = $(document).width();
				dH = $(document).height();
				posotion  = "absolute";
				scrollTop = document.body.scrollTop + document.documentElement.scrollTop;
			}
			this.maskW = dW;
			this.maskH = dH;
			var opww = this.getWidth(this.openWin);
			var ophh = this.getHeight(this.openWin);
			this.openWin.css({
				"display"  : "block",
				"position" : posotion,
				"left"     : this.param.pos ? this.param.pos.left : (dW - opww)/2,
				"top"      : this.param.pos ? this.param.pos.top : scrollTop + (dH - ophh)/2,
				"z-index"  : 10001
			});
		},
		getWidth : function(dom){
			var opww = dom.width();
			opww += parseInt(dom.css("padding-left"),10) || 0;
			opww += parseInt(dom.css("padding-right"),10) || 0;
			opww += parseInt(dom.css("margin-left"),10) || 0;
			opww += parseInt(dom.css("margin-right"),10) || 0;
			return opww;
		},
		getHeight : function(dom){
			var ophh = dom.height();
			ophh += parseInt(dom.css("padding-top"),10) || 0;
			ophh += parseInt(dom.css("padding-bottom"),10) || 0;
			ophh += parseInt(dom.css("margin-top"),10) || 0;
			ophh += parseInt(dom.css("margin-bottom"),10) || 0;
			return ophh;
		},
		createMaskLayer : function(){
			var maskStyle = {
				"background-color" : "#000000",
				"opacity"  : 0.5,
				"z-index"  : 10000
			}
			this.maskStyle = this.param.maskStyle || maskStyle;
			this.maskTouch = this.param.maskTouch || 0;
			this.mask = new vvMaskLayer({
				maskStyle : this.maskStyle
			});
			var that = this;
			if(this.maskTouch){
				this.mask.maskLayer.bindTouch(that.maskTouch,that);
			}else{
				this.mask.maskLayer.bindTouch(that._close,that);
			}
		},
		moveInit : function(){
			var moveId = this.param.moveClass || "move";
			var moveDom = this.openWin.find("." + moveId);
			if(moveDom.html()){
				moveDom.css("cursor","move");
				moveDom.bindTouchGroup(this);
			}
		},
		actionInit : function(){
			var that = this;
			var clearId = this.param.clearClass || "clear";
			var clearDom = this.openWin.find("." + clearId);
			if(clearDom.html()){
				clearDom.bindTouch(that._clearAction,that);
			}
			var checkId = this.param.checkClass || "check";
			var checkDom = this.openWin.find("." + checkId);
			if(checkDom.html()){
				checkDom.bindTouch(that._checkAction,that);
			}
		},
		_clearAction : function(obj,that){
			that.close();
			if(that.param.clearCallBack){
				that.param.clearCallBack();
			}
		},
		_checkAction : function(obj,that){
			that.close();
			if(that.param.checkCallBack){
				that.param.checkCallBack();
			}
		},
		_close : function(obj,that){
			if(that.param.del){
				that.mask.maskLayer.remove();
				that.openWin.remove();
			}else{
				that.mask.maskLayer.hide();
				that.openWin.hide();
			}
		},
		close : function(){
			if(this.param.del){
				this.mask.maskLayer.remove();
				this.openWin.remove();
			}else{
				this.mask.maskLayer.hide();
				this.openWin.hide();
			}
		},
		show : function(){
			this.mask.maskLayer.show();
			this.openWin.show();
		},
		hide : function(){
			this.mask.maskLayer.hide();
			this.openWin.hide();
		},
		_resize : function(){
			var scrollTop = 0;
			var dW = $(window).width();
			var dH = $(window).height();
			if(this.winPosition){
				dW = $(document).width();
				dH = $(document).height();
				scrollTop = document.body.scrollTop + document.documentElement.scrollTop;
			}
			this.maskW = dW;
			this.maskH = dH;
			// this.mask.setMaskSize();
			var opww = this.getWidth(this.openWin);
			var ophh = this.getHeight(this.openWin);
			this.openWin.css({
				left : this.param.pos ? this.param.pos.left : (dW - opww)/2,
				top  : this.param.pos ? this.param.pos.top : scrollTop + (dH - ophh)/2
			});
		},
		touchDown : function(event,touchObj){
			this.moveLock = true;
			var pageX  = event.pageX || event.x;
			var pageY  = event.pageY || event.y;
			this.dLeft = pageX - parseInt(this.openWin.css("left"));
			this.dTop  = pageY - parseInt(this.openWin.css("top"));
		},
		touchMove : function(event,touchObj){
			var pageX = event.pageX || event.x;
			var pageY = event.pageY || event.y;
			if(this.moveLock){
				var sLeft = pageX - this.dLeft;
				0 >= sLeft && (sLeft = 0);
				sLeft = Math.min(this.maskW - parseInt(this.openWin.css("width")), sLeft);
				var sTop = pageY - this.dTop;
				0 >= sTop && (sTop = 0);
				sTop = Math.min(this.maskH - parseInt(this.openWin.css("height")), sTop),
				this.openWin.css({
					top : sTop,
					left : sLeft
				});
			}
		},
		touchUp : function(event,touchObj){
			this.moveLock = false;
		}
	}
	
	window.vvPopWindow = vvPopWindow;
	
	var vvMaskLayer = function(param){
		this.param = param;
		this.init();
	}
	
	vvMaskLayer.prototype = {
		init : function(){
			this.maskStyle = this.param.maskStyle || 0;
			if(!this.maskStyle){
				this.maskStyle = {
					"background-color" : "#000000",
					"opacity"  : 0.5,
					"z-index"  : 0
				}
			}
			this.maskStyle["position"] = "absolute";
			this.maskStyle["top"]  = "0px";
			this.maskStyle["left"] = "0px";
			var maskDiv = document.createElement("div");
			$(maskDiv).appendTo("body").css(this.maskStyle);
			this.maskLayer = $(maskDiv);
			this.setMaskSize();
			var that = this;
			$(window).bind("resize",function(event){
				that.setMaskSize();
			});
		},
		setMaskSize : function(){
			this.element = document.documentElement || document.body;
			this.maskH   = this.element.scrollHeight > this.element.clientHeight ? this.element.scrollHeight : this.element.clientHeight;
			this.maskW   = this.element.scrollWidth > this.element.clientWidth ? this.element.scrollWidth : this.element.clientWidth;
			this.maskLayer.css({
				height : this.maskH,
				width  : this.maskW
			});
		}
	}
	
	window.vvMaskLayer = vvMaskLayer;
	
})(window, document);
