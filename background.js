var members = [];

chrome.webRequest.onBeforeRequest.addListener(
	function(details){
		switch (details.url) {
		case "https://www.facetouch.jp/webApi/frontLogin":
			parseFrontLogin(details);
			break;
		case "https://www.facetouch.jp/webApi/getMemberDetail":
			parseGetMemberDetail(details);
			break;
		case "https://www.facetouch.jp/webApi/sendMail":
			parseSendMail(details);
			break;
		}
		return details;
	},
	{
		urls: [
			"https://www.facetouch.jp/webApi/frontLogin",
			"https://www.facetouch.jp/webApi/getMemberDetail",
			"https://www.facetouch.jp/webApi/sendMail"
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
				members[this.user_id] = this;
			});
			$.each(data.posts, function(){
				var post_name = this.post_name;
				$.each(this.members, function(){
					members[this]['post_name'] = post_name;
				});
			})
		}
	);
}

function parseGetMemberDetail(details) {
}

function parseSendMail(details) {
	var user_id = details.requestBody.formData.user_id.join('');
	var user = members[user_id];
	if (!user) return;
	if (localStorage['calling_api']) {
		$.post(
			localStorage['calling_api'],
			{
				user: user
			},
			console.log
		);
	}
}

