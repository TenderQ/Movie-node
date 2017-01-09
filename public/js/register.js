$(function(){
	showTab();
	drawBackground();
	window.onhashchange = function(){
		showTab();
	}
	$(document).on('keyup','[required]',function(){
		if(!$(this).val()){
			formTip($(this),true,'此处不能为空');
		} else {
			formTip($(this),false);
		}
	})
	$(document).on('keyup','[signup-confirm]',function(){
		if($("[signup-pass]").val() != $(this).val()){
			formTip($(this),true,'两次密码输入不一致');
		} else {
			formTip($(this),false);
		}
	})
	
	$("#form-signup").submit(function(){
		var _this = $(this);
		$.ajax({
			url:'/user/signup',
			method:'POST',
			data: _this.serialize(),
			dataType: 'json',
			success: function(data){
				if(!data.issuccess){
					if(data.place == 'name'){
						formTip($("[signup-name]"),true,data.data);
					}
				} else {
					window.location.href = document.referrer;
				}
				
			},
		})
		return false;
	})
	
	$("#form-signin").submit(function(){
		var _this = $(this);
		$.ajax({
			url:'/user/signin',
			method:'POST',
			data: _this.serialize(),
			dataType: 'json',
			success: function(data){
				if(!data.issuccess){
					if(data.place == 'name'){
						formTip($("[signin-name]"),true,data.data);
					} else if (data.place == 'password'){
						formTip($("[signin-pass]"),true,data.data);
					}
				} else {
					window.location.href = document.referrer;
				}
				
			},
		})
		return false;
	})
})

function formTip(ele,isShow,data){
	if(isShow){
		ele.siblings('label').html(data).addClass('visible');
	}else{
		ele.siblings('label').removeClass('visible');
	}
}

function showTab(){
	if(window.location.hash == "#signin"){
		$(".tab-nav").attr("data-index",1);
		$(".tab-nav").find('a').eq(1).addClass('active').siblings('a').removeClass('active');
		$(".tab").hide();
		$(".tab-signin").show();
	} else {
		$(".tab-nav").attr("data-index",0);
		$(".tab-nav").find('a').eq(0).addClass('active').siblings('a').removeClass('active');
		$(".tab").hide();
		$(".tab-signup").show();
	}
}

function drawBackground(){
	//定义画布宽高和生成点的个数
	var WIDTH = window.innerWidth, HEIGHT = window.innerHeight, POINT = 25;
	var canvas = document.getElementById('canvas');
	canvas.width = WIDTH,
	canvas.height = HEIGHT;
	var context = canvas.getContext('2d');
	context.strokeStyle = 'rgba(0,0,0,0.02)',
	context.strokeWidth = 1,
	context.fillStyle = 'rgba(0,0,0,0.05)';
	var circleArr = [];

	//线条：开始xy坐标，结束xy坐标，线条透明度
	function Line (x, y, _x, _y, o) {
		this.beginX = x,
		this.beginY = y,
		this.closeX = _x,
		this.closeY = _y,
		this.o = o;
	}
	//点：圆心xy坐标，半径，每帧移动xy的距离
	function Circle (x, y, r, moveX, moveY) {
		this.x = x,
		this.y = y,
		this.r = r,
		this.moveX = moveX,
		this.moveY = moveY;
	}
	//生成max和min之间的随机数
	function num (max, _min) {
		var min = arguments[1] || 0;
		return Math.floor(Math.random()*(max-min+1)+min);
	}
	// 绘制原点
	function drawCricle (cxt, x, y, r, moveX, moveY) {
		var circle = new Circle(x, y, r, moveX, moveY)
		cxt.beginPath()
		cxt.arc(circle.x, circle.y, circle.r, 0, 2*Math.PI)
		cxt.closePath()
		cxt.fill();
		return circle;
	}
	//绘制线条
	function drawLine (cxt, x, y, _x, _y, o) {
		var line = new Line(x, y, _x, _y, o)
		cxt.beginPath()
		cxt.strokeStyle = 'rgba(0,0,0,'+ o +')'
		cxt.moveTo(line.beginX, line.beginY)
		cxt.lineTo(line.closeX, line.closeY)
		cxt.closePath()
		cxt.stroke();

	}
	//初始化生成原点
	function init () {
		circleArr = [];
		for (var i = 0; i < POINT; i++) {
			circleArr.push(drawCricle(context, num(WIDTH), num(HEIGHT), num(15, 2), num(10, -10)/40, num(10, -10)/40));
		}
		draw();
	}

	//每帧绘制
	function draw () {
		context.clearRect(0,0,canvas.width, canvas.height);
		for (var i = 0; i < POINT; i++) {
			drawCricle(context, circleArr[i].x, circleArr[i].y, circleArr[i].r);
		}
		for (var i = 0; i < POINT; i++) {
			for (var j = 0; j < POINT; j++) {
				if (i + j < POINT) {
					var A = Math.abs(circleArr[i+j].x - circleArr[i].x),
						B = Math.abs(circleArr[i+j].y - circleArr[i].y);
					var lineLength = Math.sqrt(A*A + B*B);
					var C = 1/lineLength*7-0.009;
					var lineOpacity = C > 0.03 ? 0.03 : C;
					if (lineOpacity > 0) {
						drawLine(context, circleArr[i].x, circleArr[i].y, circleArr[i+j].x, circleArr[i+j].y, lineOpacity);
					}
				}
			}
		}
	}

	init();
	setInterval(function () {
		for (var i = 0; i < POINT; i++) {
			var cir = circleArr[i];
			cir.x += cir.moveX;
			cir.y += cir.moveY;
			if (cir.x > WIDTH) cir.x = 0;
			else if (cir.x < 0) cir.x = WIDTH;
			if (cir.y > HEIGHT) cir.y = 0;
			else if (cir.y < 0) cir.y = HEIGHT;
		}
		draw();
	}, 16);
}
