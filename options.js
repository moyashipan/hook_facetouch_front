$.each(
	['calling_api', 'idobata_api'],
	function(i, key) {
		$('#' + key)
			.val(localStorage[key])
			.on('input', function(){
				localStorage[key] = $(this).val();
			});
	}
)
