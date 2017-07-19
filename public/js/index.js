$(window).load(function(){
	box_location();
})
$(window).resize(function(){
	box_location();
})

//瀑布流布局
function box_location() {
	var parent = $("#movie-container");
    var boxs = $(".movie-box");

    var box_width = $(".movie-box").outerWidth();//获取box的实际宽度，每个box的宽度为固定值
    var parent_width = $("#movie-container").width();
    var margin = 15;//box之间底部间距
    var count = Math.floor(parent_width/box_width); //一行box的个数
    var h=[];//记录区块高度的数组
    for(var i = 0; i < boxs.length; i ++){
    	var box_height = boxs.eq(i).outerHeight();
    	if(i < count){
    		h[i] = box_height;
    		boxs.eq(i).css({'top':'0','left' : i * box_width});
    	} else {
    		var min_height = Math.min.apply(null,h);
    		var minKey = getArrayKey(h, min_height);//最小的值对应的指针
    		h[minKey] += box_height + margin;
    		boxs.eq(i).css({'top': min_height + margin ,'left' : minKey * box_width});
    	}
    }
    var max = Math.max.apply(null,h) ;
    parent.css("height",max);
}
function getArrayKey(s, v) {
	for(k in s) {
		if(s[k] == v) {
			return k;			
		}
	}
}