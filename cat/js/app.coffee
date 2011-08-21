# Translate function
window.__ = (key)->
    key

window.track = {}

window.iTunesSongChanged = (info)->
    console.log info
    dict = jQuery.parseJSON info
    window.track = dict
    console.log "song changed:"
    $('#title').text(dict.title)
    $('#artist').text(dict.artist)
    $('#album').text(dict.album)
    $('#cover img').attr('src',dict.AlbumPic)
    $('#full-time').text( GiFormatTime( dict.duration ) )

window.iTunesLaunched = (info)->
    console.log "Launched:"
    windot.iTunesSongChanged info

window.iTunesClosed = (info)->
    console.log "closed:"
    $("#playpause").removeClass('pause').addClass('play');
    $("#title").text(__("ITUNES_NOT_PLAYING"));
    $("#artist").text(__("UNKNOW_ARTIST"));
    $("#album").text(__("UNKNOW_ALBUM"));
    GiPlayerPosition(0);
    $("#lyric").html( __("NO_LYRIC") );

window.iTunesPlaying = (info)->
    dict = jQuery.parseJSON info
    GiPlayerPosition dict.currentPlayerPosition

window.iTunesLyricsReady= (info)->
    console.log "Lyrics Ready:"
    console.log info

GiPlayerPosition= (position)->
    position = position/1000
    $(".blank").css("margin-left",parseInt(200*position/track.duration ))
    $("#player-position").html( GiFormatTime(position) )
    # Lyric.scrollLyric();

window.GiFormatTime = (num)->
	num = parseInt(num)
	second = num%60
	minute =( num - second ) / 60
	second = '0'+second if second<10
	minute = '0'+minute if minute < 10
	minute+":"+second
