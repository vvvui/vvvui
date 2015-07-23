$(function(){
	var homeWidth = 850;
	if(vvMobile){
		homeWidth = 310;
		$(".demoList").css({
			width : 145
		});
	}
	$(".vvHomeScene").css({
		width : homeWidth
	});
});
