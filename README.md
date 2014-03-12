hook_facetouch_front
====================

Messaging from FaceTouch to IRC


### user情報の例
```
Array
(
    [image_detail_path] => /webApi/getMemberImage/9999/list?key=%HASH_192_CHAR%
    [image_path] => /webApi/getMemberImage/9999/list?key=%HASH_192_CHAR%
    [user_id] => 9999
    [jid] => moyashipan.hoge.com
    [family_name] => もや本
    [first_name] => パン一郎
    [family_name_kana] => モヤモト
    [first_name_kana] => パンイチロウ
    [post_id1] => 12345
    [post_name] => 開発 # 独自に追加
    [comment] =>
    [backoffice_tantou_flag] => false
    [substitute] =>
)
```

### How to use
0. Set the Facetouch to your office!

1. [Install extension for Chrome][install]

2. Open extension's option page

3. Input API URL(s)

4. Open [Facetouch Front][facetouch-front] on Chrome

5. Call someone!

[install]: https://chrome.google.com/webstore/detail/hook-facetouch-front/ekpikmnnbikmmaheeolcmlijhmmggkoo
[facetouch-front]: https://www.facetouch.jp/front/
