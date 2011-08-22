window.__ = function(key) {
  return key;
};
window.track = {};
window.iTunesSongChanged = function(info) {
  var dict;
  console.log("song changed:");
  console.log(info);
  dict = jQuery.parseJSON(info);
  window.track = dict;
  $('#title').text(dict.title);
  $('#artist').text(dict.artist);
  $('#album').text(dict.album);
  $('#cover img').attr('src', dict.AlbumPic);
  $('#full-time').text(GiFormatTime(dict.duration));
  return GiUpdateRating(dict.rating);
};
window.iTunesLaunched = function(info) {
  console.log("Launched:");
  return windot.iTunesSongChanged(info);
};
window.iTunesClosed = function(info) {
  console.log("closed:");
  $("#playpause").removeClass('pause').addClass('play');
  $("#title").text(__("ITUNES_NOT_PLAYING"));
  $("#artist").text(__("UNKNOW_ARTIST"));
  $("#album").text(__("UNKNOW_ALBUM"));
  GiPlayerPosition(0);
  GiUpdateRating(0);
  return $("#lyric").html(__("NO_LYRIC"));
};
window.iTunesPlaying = function(info) {
  var dict;
  dict = jQuery.parseJSON(info);
  return GiPlayerPosition(dict.currentPlayerPosition);
};
window.iTunesLyricsReady = function(info) {
  console.log("Lyrics Ready:");
  if (window['lyric']) {
    return window.lyric.update(info);
  }
};
window.GiPlayerPosition = function(position) {
  var _position;
  _position = position / 1000;
  $(".blank").css("margin-left", parseInt(200 * position / track.duration));
  $("#player-position").html(GiFormatTime(_position));
  if (window['lyric']) {
    return window.lyric.pos(position);
  }
};
window.GiFormatTime = function(num) {
  var minute, second;
  num = parseInt(num);
  second = num % 60;
  minute = (num - second) / 60;
  if (second < 10) {
    second = '0' + second;
  }
  if (minute < 10) {
    minute = '0' + minute;
  }
  return minute + ":" + second;
};
window.GiUpdateRating = function(rate) {
  var i, m;
  i = rate / 20;
  for (m = 5; m >= 1; m--) {
    if (m > i) {
      $("#star-" + m).removeClass().addClass('love');
    } else {
      $('#star-' + m).removeClass().addClass('love-it');
    }
  }
  return rate;
};