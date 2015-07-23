$(function(){
	var homeWidth = 850;
	if(vvMobile){
		homeWidth = 310;
		$(".demoList").css({
			width : 145
		});
		$(".demoGroup").css({
			"margin-top" : 0
		});
		$(".homeTitle").hide();
	}
	$(".vvHomeScene").css({
		width : homeWidth
	});
});
