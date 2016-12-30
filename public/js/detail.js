var isInsert = false;
$("[toUser]").click(function(){
	var user = $(this).attr("toUser");
	var userId = $(this).attr("userId");
	var commentId = $(this).data('cid');
	if(!isInsert){
		var input_1 = $("<input type='hidden' name='comment[tid]' value="+userId+">");
		var input_2 = $("<input type='hidden' name='comment[cid]' value="+commentId+">");
		$("#replay-form").append(input_1).append(input_2);
		isInsert = true;
	} else {
		$("[name='comment[tid]']").val(userId);
		$("[name='comment[cid]']").val(commentId);
	}
	$("[reply-user]").html(user);
	$("[reply-user]").parent().show();
})