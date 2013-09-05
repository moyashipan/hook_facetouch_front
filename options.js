$('#calling_api')
	.val(localStorage["calling_api"])
	.on('input', function(){
		localStorage["calling_api"] = $(this).val();
	});
