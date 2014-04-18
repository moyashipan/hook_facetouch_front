hook_facetouch_front
====================

Messaging from FaceTouch to IRC


### user情報の例
実際にはLowerCamelCase
```
Array
(
    [image_detail_path] => /webApi/getMemberImage/9999/list?key=%HASH_192_CHAR%
    [image_path] => /webApi/getMemberImage/9999/list?key=%HASH_192_CHAR%
    [user_id] => 9999
    [jid] => moyashipan.hoge.com
    [full_name] => もや本 パン一郎
    [full_name_kana] => モヤモト パンイチロウ
    [post_id1] => 12345
    [post_name] => 開発 # 独自に追加
    [comment] =>
    [backoffice_tantou_flag] => false
    [substitute] =>
    [display_flag] => true
    [firstLetter_id] => 123
    [substitute] => [123, 456, 789] # バックオフィス達
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

### その他
facetouch個人情報管理ページのコメント欄に、以下のようなコメントを書くと`idobata:`以降の文字がidobataにポストされます。
```
<!-- idobata:えっ！もやしに来客が!? -->
```
