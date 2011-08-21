function __(key){
    // return key;
	return window.itunes.localize_(key);
}

function print(str){
//	if(DEBUG){
//		console.log(str);
//	} else {
		window.itunes.debug_(str);
}

// @var Object
var track ;
// @var Boolean
var is_showLyric = false;


$(function(){  
  
//  $("#info div").dblclick(function(){
//      var ids = ['title','artist','album'];
//      for(var i in ids){
//        var attr = ids[i]
//        var ti_input = $("<input />").val( $('#'+attr).html() );
//        $("#"+attr).empty().append(ti_input);
//      }
//  });
  
  Lyric.show();
  $("#playpause").attr("title",__("PLAY_PAUSE"));
  $("#next").attr("title",__("NEXT_SONG"));
  $("#previous").attr("title",__("PREVIOUS_SONG"));
  window.setTimeout("GiSongChanged()",5000);
  //window.itunes.debug_("App starts");
  
  
});

function xxx(){
    var ids = ['title','artist','album'];
    for(var i in ids){
        var attr = ids[i]
        
        
    }
    var val = $(this).val();
    $('#'+attr).empty().text(val);

}


function GiSongChanged(){
  Lyric.has_download = true;
  
	var json = window.itunes.currentSong();
  track = jQuery.parseJSON( json );
  if(track.state && ( track.state == 'playing' ) ){
		$("#playpause").removeClass('play').addClass('pause');
	} else {
		$("#playpause").removeClass('pause').addClass('play');
	}
  if(!track.artwork) track.artwork = "default.png";
  if(!track.name) track.name =__("UNKNOW_NAME");
  if(!track.artist) track.artist =__("UNKNOW_ARTIST");
  if(!track.album) track.album =__("UNKNOW_ALBUM");
  if(!track.duration) track.duration = 0;
  
  $("#title").html(track.name);
  $("#artist").text(track.artist);
  $("#album").text(track.album);

  $("#cover img").attr("src",track.artwork);

  $("#full-time").text( GiFormatTime(track.duration) );
  getFav(track.rating);
  Lyric.refresh();
}

function GiPlayerPosition(position) {
  if(!position) position = 0;
  //print("position"+position);
  track.position = position;
  $(".blank").css("margin-left",parseInt(200*position/track.duration ));
  $("#player-position").html( GiFormatTime(position) );
  Lyric.scrollLyric();
}

function GiNotPlaying(){
  $("#playpause").removeClass('pause').addClass('play');
  $("#title").text(__("ITUNES_NOT_PLAYING"));
  $("#artist").text(__("UNKNOW_ARTIST"));
  $("#album").text(__("UNKNOW_ALBUM"));
  GiPlayerPosition(0);
  $("#lyric").empty();
}


function GiFormatTime(num){
	num = parseInt(num);
	var second = num%60;
	var minute =( num - second ) / 60;
	if(second < 10){
		second = '0'+second;
	}
	if(minute < 10){
		minute = '0'+minute;
	}
	return minute+":"+second;
}


function getFav(rate){
	var i = rate/20;
	for(var m=5;m>0;m--){
		if(m>i){
			$("#star-"+m).removeClass("love-it").addClass("love");
		} else {
			$("#star-"+m).removeClass("love").addClass("love-it");
		}
	}
}

function rate(i){
	window.itunes.rate_(i);
	getFav(i);
}

function playPause(){
	window.itunes.playPause();
	GiSongChanged();
}

function nextSong(){
	window.itunes.next();
}

function previousSong(){
  window.itunes.previous()
}

// Called from ObjC
function refreshLyric(){
	Lyric.refresh();
}

// Make the song label Changable 
$(function(){
    var arr = ['title','album','artist'];
    for(var i in arr){
        var id = arr[i];
        $('#'+id).dblclick(function(){
            var attr  = $(this).attr('id');
            var input = $("<input />").val( $(this).text() ).attr('name',attr).focusout(function(){
                var id = $(this).attr('name');
                var value = $(this).val();
                $( '#'+id ).text(value).show();
                $('#input-'+id).remove();
                window.itunes.setSongValue_forkind_(value,id);
            });
            var div   = $("<div></div>").attr('id','input-'+attr).append(input);
            $(this).hide().after(div);
        });
    }
  
});

function changeable(attr){
    var ti_input = $("<input />").val( $('#title').html() ).change(
        function(){
            var val = $(this).val();
            $("#title").empty().text(val);
        }
    );
    $("#title").empty().append(ti_input);
}
