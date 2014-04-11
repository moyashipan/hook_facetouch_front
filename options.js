$.each(
  ['calling_api', 'idobata_api', 'gyazo_api'],
  function(i, key) {
    $('#' + key)
      .val(localStorage[key])
      .on('input', function(){
        localStorage[key] = $(this).val();
      });
  }
)

if(navigator.webkitGetUserMedia) {
  navigator.webkitGetUserMedia(
    { video:true },
    function (stream){},
    function (error){}
  );
}
