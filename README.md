# vvVui
a light weight web frame

---------- include modules ---------- <br>
vvResizeObject <br>
vvCalendar <br>
vvScroll <br>
vvScrollbar <br>
vvSlider <br>
vvPopWindow <br>
vvColorPicker <br>
---------- include modules end ---------- <br><br>
vvResizeObject <br>
<div style="padding:10px; border:1px solid #fdfdfd;">
	new vvResizeObject({
		domId : "#obj1", // dom id
		limit : 1, // 是否限制拖动范围
		moveCallBack : function(bo){
			console.log(bo); // return position x position y
		},
		resizeCallBack : function(bo){
			log.show(bo); // return position x position y width height rotateZ
		},
		callBack : function(){
			console.log("touchUp");  // return position x position y
		}
	});
</div>
