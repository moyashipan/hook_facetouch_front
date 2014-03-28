var members = [];

chrome.webRequest.onBeforeRequest.addListener(
	function(details){
		// TODO: URL何回も書いてるのをやめる
		switch (details.url) {
		case "https://www.facetouch.jp/webApi/frontLogin":
			parseFrontLogin(details);
			break;
		case "https://www.facetouch.jp/webApi/getMemberDetail":
			parseGetMemberDetail(details);
			break;
		default:
			if (details.url.indexOf('https://www.facetouch.jp/webApi/v2/8/callUser/') == 0) {
				parseSendMail(details);
				break;
			}
		}
		return details;
	},
	{
		urls: [
			"https://www.facetouch.jp/webApi/frontLogin",
			"https://www.facetouch.jp/webApi/getMemberDetail",
			"https://www.facetouch.jp/webApi/v2/8/callUser/*" // TODO: 会社ID(8)を省く
		]
	},
	[
		"requestBody"
	]
);

function convertKeyNames(source) {
	var retval = {};
	$.each(source, function(i){
		retval[camelcaseToSnakecase(i)] = this;
	})
	return retval;
}

function camelcaseToSnakecase(s) {
	return s.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
}

function parseFrontLogin(details) {
	// 2回目のリクエストであれば無視
	if (details.requestBody.formData.second) return;

	// メンバ一覧が欲しいので2回目のリクエストであるフラグを追加して再度postする
	var formData = details.requestBody.formData;
	for (var i in formData) {
		formData[i] = formData[i].join("");
	}
	formData.second = '1';

	$.post(
		details.url,
		formData,
		function(data){
			$.each(data.members, function(){
				var member = convertKeyNames(this);
				members[member.user_id] = member;
			});
			$.each(data.posts, function(){
				var post = convertKeyNames(this);
				var post_name = post.post_name;
				$.each(post.members, function(){
					members[this]['post_name'] = post_name;
				});
			})
		}
	);
}

function parseGetMemberDetail(details) {
}

function postToIdobata(source) {
	$.post(
		localStorage['idobata_api'],
		{
			source: source
		},
		function(){}
	);
}

function getCamera(callback) {
	if(navigator.webkitGetUserMedia) {
		navigator.webkitGetUserMedia(
			{ video:true },
			function(stream) {
				var video = document.createElement('video');
				var url = window.webkitURL.createObjectURL(stream);
				video.src = url;

				var canvas = document.createElement('canvas');
				canvas.width = 160;
				canvas.height = 120;
				var context = canvas.getContext('2d');
				setTimeout(function(){
					context.drawImage(video, 0, 0, canvas.width, canvas.height);

					var type = 'image/jpeg';
					var dataurl = canvas.toDataURL(type);
					var bin = atob(dataurl.split(',')[1]);
					var buffer = new Uint8Array(bin.length);
					for (var i = 0; i < bin.length; i++) {
						buffer[i] = bin.charCodeAt(i);
					}
					var blob = new Blob([buffer.buffer], {type: type});

					callback.call(null, blob);
					video.src=null;
				}, 1000);
			},
			function (error){}
		);
	} else {
		callback.call(null, null);
	}
}

function parseSendMail(details) {
	var user_id = parseInt(details.url.replace('https://www.facetouch.jp/webApi/v2/8/callUser/', ''));
	var user = members[user_id];
	if (!user) return;
	if (localStorage['calling_api']) {
		$.post(
			localStorage['calling_api'],
			{
				user: user
			},
			function(){}
		);
	}
	if (localStorage['idobata_api']) {
		getCamera(function(blob){
			if (blob && localStorage['gyazo_api']) {
				var data = new FormData();
				data.append('imagedata', blob);
				data.append('id', ''); // TODO: set gyazo id
				$.ajax({
					url: localStorage['gyazo_api'],
					data: data,
					cache: false,
					processData: false,
					contentType: false,
					type: 'POST'
				}).done(function(gyazo_url){
					var pattern = "[%s] @%s : %sさん、お客様がお見えになりました。\n%s";
					var source = sprintf(pattern, user.post_name, user.jid.split('.')[0], user.family_name, gyazo_url);
					postToIdobata(source);
				}).fail(function(msg){
					console.log('fail');
					console.log(msg);
				});
			} else {
				var pattern = '[%s] @%s : %sさん、お客様がお見えになりました。';
				var source = sprintf(pattern, user.post_name, user.jid.split('.')[0], user.family_name);
				postToIdobata(source);
			}
		});
	}
}

