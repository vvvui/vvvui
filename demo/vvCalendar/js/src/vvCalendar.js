/**
* 2015-07-23
* author cxj@1123588845@qq.com
* https://github.com/vvvui
*/

(function(window, document){
	
	var vvCalendar = function (param) {
		this.param = param;
		this.initalId = this.param.initalId || 0;
		this.titleArr = this.param.titleArr || ["一","二","三","四","五","六","日"];
		this.dateArr  = [];
		this.halfDayHour = this.param.halfDayHour || 14;
		this.showDate = this.param.showDate || 0;
		this.enableBegin = this.param.enableBegin || 0;
		this.enableEnd = this.param.enableEnd || 0;
		this.showDays = this.param.showDays || 30;
		this.showType = this.param.showType || this.param.showType == 0 ? this.param.showType : 0;
		// this.enableBegin = "2015-05-01";
		// this.enableEnd = "2015-07-30";
		// this.showDate = "2015-06-01";
		this.limit = this.param.limit || this.param.limit == 0 ? this.param.limit : 0;
		this._initTag();
		this.init();
		this._initFunction();
	}
	
	vvCalendar.prototype = {
		init : function(){
			this.initTime = this.param.initTime || new Date().getTime();
			if(new Date().getTime().toString().length > this.initTime.toString().length){
				this.initTime = this.initTime * Math.pow(10,(new Date().getTime().toString().length - this.initTime.toString().length));
			}
			this.showDate = this.showDate || timeToStr(this.initTime);
			this._checkEnableBegin();
			this._checkEnableEnd();
			this._initDate();
			this._setDom();
		},
		refresh : function(){
			this.dateArr  = [];
			this._checkEnableBegin();
			this._checkEnableEnd();
			this._initDate();
			this._setDateDom();
		},
		setPreMonth : function(){
			var showDate = this.preYear + "" + formartZero(this.preMonth);
			if(!this.enableBegin){
				this._showPreMonth();
			}else{
				var beginArr = this.enableBegin.split("-");
				var beginDate = beginArr[0] + "" + beginArr[1];
				if(parseInt(showDate) >= parseInt(beginDate)){
					this._showPreMonth();
				}
			}
		},
		_showPreMonth : function(){
			this.showDate = this.preYear + "-" + formartZero(this.preMonth) + "-" + (this.showDay < this.preDaysNum ? formartZero(this.showDay) : formartZero(this.preDaysNum));
			this.refresh();
		},
		setNextMonth : function(){
			var showDate = this.nextYear + "" + formartZero(this.nextMonth);
			if(!this.enableEnd){
				this._showNextMonth();
			}else{
				var endArr = this.enableEnd.split("-");
				var endDate = endArr[0] + "" + endArr[1];
				if(parseInt(showDate) <= parseInt(endDate)){
					this._showNextMonth();
				}
			}
		},
		_showNextMonth : function(){
			this.showDate = this.nextYear + "-" + formartZero(this.nextMonth) + "-" + (this.showDay < this.nextDaysNum ? formartZero(this.showDay) : formartZero(this.nextDaysNum));
			this.refresh();
		},
		_checkEnableEnd : function(){
			if(!this.enableEnd && this.showDays && this.limit){
				this.endTime = this.initTime + this.showDays * 24 *3600 * 1000;
				this.enableEnd = timeToStr(this.endTime);
			}
		},
		_checkEnableBegin : function(){
			if(!this.enableBegin && this.limit){
				this.enableBegin = this.showDate;
			}
		},
		_initTag : function(){
			this.theme     = $("#" + (this.param.containerId || "vvCalendar"));
			this.titleTag  = this.theme.find(".vvCalendarTitle").html();
			this.dateTag   = this.theme.find(".vvCalendarDate").html();
			this.titleBody = this.theme.find(".vvCalendarTitle");
			this.dateBody  = this.theme.find(".vvCalendarDate");
			this.showBody  = this.theme.find(".vvCalendarShow");
		},
		_initFunction : function(){
			var that = this;
			$(".preMonth").bindTouch(function(obj){
				that.setPreMonth();
			});
			$(".nextMonth").bindTouch(function(obj){
				that.setNextMonth();
			});
		},
		_setCallBackFunction : function(){
			var that = this;
			this.dateBody.find(".tag").bindTouch(function(obj){
				var reg = /\d+/;
				if(!reg.test($(obj).find(".dateShow").text())){
					return;
				}
				that._callback(obj.id);
			});
		},
		_callback : function(date){
			var checkedDate;
			var dArrLen = this.dateArr.length;
			for(var i=0; i < dArrLen; i++){
				if(this.dateArr[i].date == date){
					checkedDate = this.dateArr[i];
					break;
				}
			}
			if(checkedDate && checkedDate.clickable){
				// this.showDate = checkedDate.date;
				// this._setClass();
				if(this.param.callBack){
					this.param.callBack(checkedDate);
				}
			}
		},
		_setDom : function(){
			this._setTitleDom();
			this._setDateDom();
		},
		_setTitleDom : function(){
			var tArrLen = this.titleArr.length;
			var titleInner = "";
			for(var i=0; i<tArrLen; i++){
				titleInner += this.titleTag.replace("%Tag%",this.titleArr[i]);
			}
			this.titleBody.html(titleInner);
		},
		_setDateDom : function(){
			var dArrLen = this.dateArr.length;
			var dateInner = "";
			for(var i=0; i<dArrLen; i++){
				if(this.showType){
					if(i < this.preDaysShow){
						dateInner += this.dateTag.replace("%Tag%","&nbsp;").replace("%Id%",this.dateArr[i].date);
					}else if(i < this.preDaysShow + this.showDaysNum){
						dateInner += this.dateTag.replace("%Tag%",this.dateArr[i].day).replace("%Id%",this.dateArr[i].date);
					}else if(i < 35 || this.preDaysShow + this.showDaysNum > 35){
						dateInner += this.dateTag.replace("%Tag%","&nbsp;").replace("%Id%",this.dateArr[i].date);
					}
				}else{
					dateInner += this.dateTag.replace("%Tag%",this.dateArr[i].day).replace("%Id%",this.dateArr[i].date);
				}
			}
			this.dateBody.html(dateInner);
			this.showBody.html(formartShow(this.showDate));
			this._setClass();
			this._setCallBackFunction();
		},
		_setClass : function(){
			this.dateBody.find(".tag").removeClass("tagVisible tagSelected");
			this.dateBody.find(".dateShow").removeClass("dateShowSelected");
			var dArrLen = this.dateArr.length;
			for(var i=0; i < dArrLen; i++){
				if(this.dateArr[i].visible){
					$("#" + this.dateArr[i].date).addClass("tagVisible");
				}
				if(this.dateArr[i].date == this.showDate && this.dateArr[i].clickable){
					$("#" + this.dateArr[i].date).addClass("tagSelected");
					$("#" + this.dateArr[i].date).find(".dateShow").addClass("dateShowSelected");
					this.showDay = this.dateArr[i].day;
				}
			}
		},
		_initDate : function(){
			var date = strToDate(this.showDate);
			this.showDaysNum = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
			this.preDaysNum  = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
			this.nextDaysNum = new Date(date.getFullYear(), date.getMonth() + 2, 0).getDate();
			this.preDaysShow = new Date(date.getFullYear(), date.getMonth(), this.initalId).getDay();
			this.showYear  = date.getFullYear();
			this.showMonth = date.getMonth() + 1;
			this.showDay = date.getDate();
			this.preYear   = date.getMonth() == 0 ? this.showYear - 1 : this.showYear;
			this.preMonth  = date.getMonth() == 0 ? 12 : date.getMonth();
			this.nextYear  = date.getMonth() + 2 > 12 ? this.showYear + 1 : this.showYear;
			this.nextMonth = date.getMonth() + 2 > 12 ? 1 : date.getMonth() + 2;
			var initNum = 0;
			var pushNum;
			var datePush;
			while(initNum < 42){
				var month;
				if(initNum < this.preDaysShow){
					pushNum = this.preDaysNum - this.preDaysShow + initNum + 1;
					datePush = this.preYear + "-" + formartZero(this.preMonth) + "-" + formartZero(pushNum);
					month = this.preMonth;
				}else if(initNum < this.showDaysNum + this.preDaysShow){
					pushNum = initNum - this.preDaysShow + 1;
					datePush = this.showYear + "-" + formartZero(this.showMonth) + "-" + formartZero(pushNum);
					month = this.showMonth;
				}else{
					pushNum = initNum - this.preDaysShow - this.showDaysNum + 1;
					datePush = this.nextYear + "-" + formartZero(this.nextMonth) + "-" + formartZero(pushNum);
					month = this.nextMonth;
				}
				this.dateArr.push({
					date : datePush,
					day : pushNum,
					month : month
				});
				initNum ++;
			}
			this._setVisible();
		},
		_setVisible : function(){
			var visibleTimeBegin = this.enableBegin ? strToTime(this.enableBegin) : 0;
			var visibleTimeEnd   = this.enableEnd   ? strToTime(this.enableEnd)   : 0;
			var arrLen = this.dateArr.length;
			if(visibleTimeBegin == 0 && visibleTimeEnd == 0){
				for(var i=0; i < arrLen; i++){
					this.dateArr[i].visible = 1;
					this.dateArr[i].clickable = 1;
				}
			}else if(visibleTimeBegin == 0){
				for(var i=0; i < arrLen; i++){
					if(strToTime(this.dateArr[i].date) <= visibleTimeEnd){
						this.dateArr[i].visible   = 1;
						this.dateArr[i].clickable = 1;
					}else{
						this.dateArr[i].visible   = 0;
						this.dateArr[i].clickable = 0;
					}
				}
			}else if(visibleTimeEnd == 0){
				for(var i=0; i < arrLen; i++){
					if(strToTime(this.dateArr[i].date) >= visibleTimeBegin){
						this.dateArr[i].visible   = 1;
						this.dateArr[i].clickable = 1;
					}else{
						this.dateArr[i].visible   = 0;
						this.dateArr[i].clickable = 0;
					}
				}
			}else{
				for(var i=0; i < arrLen; i++){
					if(strToTime(this.dateArr[i].date) >= visibleTimeBegin && strToTime(this.dateArr[i].date) <= visibleTimeEnd){
						this.dateArr[i].visible   = 1;
						this.dateArr[i].clickable = 1;
					}else{
						this.dateArr[i].visible   = 0;
						this.dateArr[i].clickable = 0;
					}
				}
			}
			for(var i=0; i < arrLen; i++){
				if(this.dateArr[i].month != this.showMonth){
					this.dateArr[i].visible = 0;
				}
			}
		}
	}
	
	function strToTime(str){
		var reg = /(\d{4}).*(\d{2}).*(\d{2})/;
		var dateArr = str.match(reg);
		var time = new Date(parseInt(dateArr[1],10),parseInt(dateArr[2],10) - 1,parseInt(dateArr[3],10)).getTime();
		return time;
	}
	
	function timeToStr(time){
		var date = new Date(time);
		var str = date.getFullYear() + "-" + formartZero(date.getMonth() + 1) + "-" + formartZero(date.getDate());
		return str;
	}
	
	function strToDate(str){
		var reg = /(\d{4}).*(\d{2}).*(\d{2})/;
		var dateArr = str.match(reg);
		var time = new Date(parseInt(dateArr[1],10),parseInt(dateArr[2],10) - 1,parseInt(dateArr[3],10)).getTime();
		return new Date(time);
	}
	
	function formartZero(num){
		var num = parseInt(num,10);
		var str = num < 10 ? "0" + num : num;
		return str;
	}
	
	function formartShow(str){
		var reg = /(\d{4}).*(\d{2}).*(\d{2})/;
		var dateArr = str.match(reg);
		return dateArr[1] + "年" + dateArr[2] + "月";
	}
	
	//callback
	window.vvCalendar = vvCalendar;
	
})(window, document);
