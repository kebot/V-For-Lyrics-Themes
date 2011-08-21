var GiPlayerPosition;
window.__ = function(key) {
  return key;
};
window.track = {};
window.iTunesSongChanged = function(info) {
  var dict;
  console.log(info);
  dict = jQuery.parseJSON(info);
  window.track = dict;
  console.log("song changed:");
  $('#title').text(dict.title);
  $('#artist').text(dict.artist);
  $('#album').text(dict.album);
  $('#cover img').attr('src', dict.AlbumPic);
  return $('#full-time').text(GiFormatTime(dict.duration));
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
  return $("#lyric").html(__("NO_LYRIC"));
};
window.iTunesPlaying = function(info) {
  var dict;
  dict = jQuery.parseJSON(info);
  return GiPlayerPosition(dict.currentPlayerPosition);
};
window.iTunesLyricsReady = function(info) {
  console.log("Lyrics Ready:");
  return console.log(info);
};
GiPlayerPosition = function(position) {
  position = position / 1000;
  $(".blank").css("margin-left", parseInt(200 * position / track.duration));
  return $("#player-position").html(GiFormatTime(position));
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