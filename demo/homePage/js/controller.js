$(function(){
	// resize
	var homeWidth = 850;
	if(vvMobile){
		homeWidth = 310;
		$(".demoList").css({
			width : 145,
			height : 175
		});
		$(".demoThumb").css({
			height : 145
		});
		$(".demoGroup").css({
			"margin-top" : 0
		});
		$(".homeTitle").hide();
	}
	$(".vvHomeScene").css({
		width : homeWidth
	});
	
	// demoList initialize
	(function(){
		var demoData = {
			vvCalendar : {
				name : "日历控件",
				picUrl : "demo/homePage/images/thumb/vvCalendar.jpg",
				link : "http://vvvui.github.io/demo/vvCalendar/"
			},
			vvResizeObject : {
				name : "多点控制",
				picUrl : "demo/homePage/images/thumb/vvResizeObject.jpg",
				link : "http://vvvui.github.io/demo/vvResizeObject/"
			}
		};
		var inner = "";
		for(var i in demoData){
			inner += '<div class="demoList">';
			inner += '	<div class="demoThumb">';
			inner += '		<a href="' + demoData[i].link + '"><img src="' + demoData[i].picUrl + '">';
			inner += '		</a>';
			inner += '	</div>';
			inner += '	<div class="demoThumbText">';
			inner += '		<a href="' + demoData[i].link + '">' + demoData[i].name + '</a>';
			inner += '	</div>';
			inner += '</div>';
		}
		$(".demoGroup").html(inner);
	})();
});
