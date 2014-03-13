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
			console.log
		);
	}
	if (localStorage['idobata_api']) {
		var pattern = '[%s] @%s : %sさん、お客様がお見えになりました。';
		var source = sprintf(pattern, user.post_name, user.jid.split('.')[0], user.family_name);
		$.post(
			localStorage['idobata_api'],
			{
				source: source
			},
			console.log
		);
	}
}

