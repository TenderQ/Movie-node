var thumbnailWidth = 100, thumbnailHeight = 100;
var $list = $("#fileList");

var uploader = WebUploader.create({ 
    auto: true, // 选完文件后，是否自动上传。
    swf: '/libs/webuploader/Uploader.swf',// swf文件路径
    server: '/admin/movie/fileUpload',// 文件接收服务端。
    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
    pick: {
    	id: '#filePicker',
    	multiple: false
    },
    fileNumLimit: 1,//限制只传一张图片
    // 只允许选择图片文件。
    accept: {
        title: 'Images',
        extensions: 'gif,jpg,jpeg,bmp,png',
        mimeTypes: 'image/*'
    }
});
uploader.on( 'fileQueued', function( file) {
    var $li = $(
            '<div id="' + file.id + '" class="file-item thumbnail">' +
                '<img>' +
                '<div class="info">' + file.name + '</div>' +
            '</div>'
            ),
        $img = $li.find('img');
        
    $list.append( $li );

    // 创建缩略图   thumbnailWidth x thumbnailHeight 为 100 x 100
    uploader.makeThumb( file, function( error, src ) {
        if ( error ) {
            $img.replaceWith('<span>不能预览</span>');
            return;
        }

        $img.attr( 'src', src );
    }, thumbnailWidth, thumbnailHeight );
});
// 文件上传过程中创建进度条实时显示。
uploader.on( 'uploadProgress', function( file, percentage ) {
    var $li = $( '#'+file.id ),
        $percent = $li.find('.progress span');

    // 避免重复创建
    if ( !$percent.length ) {
        $percent = $('<p class="progress"><span></span></p>')
                .appendTo( $li )
                .find('span');
    }

    $percent.css( 'width', percentage * 100 + '%' );
});

// 文件上传成功，给item添加成功class, 用样式标记上传成功。
uploader.on( 'uploadSuccess', function( file,data ) {
    $( '#'+file.id ).addClass('upload-state-done');
    $("#poster").val(data.src);
});
//限制上传一张图片错误提示
uploader.on('error', function(handler) {
    if (handler == "Q_EXCEED_NUM_LIMIT") {
        alert("只能上传一张图片");
    }
});
// 文件上传失败，显示上传出错。
uploader.on( 'uploadError', function( file ) {
    var $li = $( '#'+file.id ),
        $error = $li.find('div.label-error');
    // 避免重复创建
    if ( !$error.length ) {
        $error = $('<div class="label label-error"></div>').appendTo( $li );
    }
    $error.text('上传失败');
});
// 完成上传完了，成功或者失败，先删除进度条。
uploader.on( 'uploadComplete', function( file ) {
    $( '#'+file.id ).find('.progress').remove();
});


$(function(){
	$("#douban").blur(function(){
		var _this = $(this);
		var id = _this.val();
		if(id){
			$.ajax({
				url: "http://api.douban.com/v2/movie/subject/"+id,
				cache: true,
				type: 'get',
				dataType: 'jsonp',
				crossDomain: true,
				jsonp: 'callback',
				success: function(data){
					var directors = [],actors = [];
					for(var i=0;i<data.directors.length;i++){
						var director = data.directors[i];
						directors.push(director.name);
					}
					for(var i=0;i<data.casts.length;i++){
						var actor = data.casts[i];
						actors.push(actor.name);
					}
					directors.join('/');
					actors.join('/');
					$("#title").val(data.title);
					$("#director").val(directors);
					$("#actors").val(actors);
					$("#country").val(data.countries[0]);
					$("#poster").val(data.images.large);
					$("#year").val(data.year);
					$("#summary").val(data.summary);
				}
				
			})
		}
	})
	$('#category').change(function(){
		checkCategory();
	})
	$(document).on('keyup','[required]',function(){
		if(!$(this).val()){
			$(this).parent().addClass('has-error');
		} else {
			$(this).parent().removeClass('has-error');	
		}
	})
	
	$("#form-movie").submit(function(){
		var _this = $(this);
		if(!checkCategory()){
			return false;
		}

		$.ajax({
			url:'/admin/movie/add',
			type:'POST',
			data: _this.serialize(),
			dataType: 'json',
			success: function(data){
				var index = parent.layer.getFrameIndex(window.name); //获取当前窗体索引
				parent.location.reload();
				parent.layer.close(index);
			},
		})
		return false;
	})
})

function checkCategory(){
	if(!$('#category').val()){
		$('#category').parent().addClass('has-error');
		return false;
	} else {
		$('#category').parent().removeClass('has-error');
		return true;
	}
}