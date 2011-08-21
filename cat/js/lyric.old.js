/*
 //  lyric.js
 //  GiTuns
 //	
 //  Created by Yao Keith on 2/6/11.
 //  Copyright 2011 http://kebot.me/. All rights reserved.
 */

// Variable info about the current track~~
// Do Everything with the lyric Frame

var DEBUG = false;
var DEBUGINAPP = false;

// user-config
var AUTO_DOWNLOAD_AFTER = 5;

//config variable
var LYRIC_TAG_ID = "#lyric";

// the red line will move down 4 lines
var LYRIC_DISPLAY_OFFSET = 4;
var LYRIC_LINE_HEIGHT;
function bindEvent(){
	// bind events
	var lyric_mouse_start_position = 0;
	var lyric_line_start_position = 0;
	var lyric_mouse_move_speed = 1;
	var lyric_song_moveto;
	var lyric_frame = $("#lyric");
	
	var lyric_mouse_up = function(e){
		if(DEBUGINAPP){
			$('#title').text('mouseup');		
		}
		$(document).unbind("mousemove",lyric_mouse_move);
		$(document).unbind("mouseup",lyric_mouse_up);
		
		Lyric.auto_scroll = true;
		if(lyric_song_moveto){
			var pos = Lyric.getTimeFromScrollTop(lyric_song_moveto);
			//debug(pos);
			Lyric.playerPosition(pos);
		}
	};
	
	var lyric_mouse_move = function(e){
		//print("MOUSEMOVE:"+e.clientY);
		
		var distance = e.clientY - lyric_mouse_start_position;
		var moveto = lyric_line_start_position - lyric_mouse_move_speed * distance;
		
		if(moveto<0){
			moveto = 0;
		}
		 
		
		moveto = moveto + LYRIC_DISPLAY_OFFSET * LYRIC_LINE_HEIGHT;
		//print("move-to"+moveto);
		
		
		Lyric.scrollTo(moveto);
		lyric_song_moveto = moveto;
		//var position = parseInt( moveto / LYRIC_LINE_HEIGHT );
		//lyric_to_song_position = lyric_time[position];
	};
	var mousedown = function(e){
		Lyric.auto_scroll = false;
		lyric_mouse_start_position = e.clientY;
		lyric_line_start_position = lyric_frame.scrollTop();
		//$("#lyric-"+last_index).offset().top+LYRIC_LINE_HEIGHT*LYRIC_DISPLAY_OFFSET;//
		$(document).bind("mousemove",lyric_mouse_move);
		$(document).mouseup(lyric_mouse_up);
	};
	return function(){
		$("#lyric").bind('mousedown',mousedown);
	}
	// bind end
}

$(function(){
  if(!DEBUG){
	AUTO_DOWNLOAD_AFTER = parseInt( window.itunes.getConfig_('AUTO_DOWNLOAD_AFTER_SECONDS') );
  }
  if(!AUTO_DOWNLOAD_AFTER){
	AUTO_DOWNLOAD_AFTER = 5;
  }
  AUTO_DOWNLOAD_AFTER *= 1000;
  
  bindEvent()();
});


var Lyric = new function(){
	// configs
	this.delay = 1000;
	
	// flag
	// var boolean
	this.isLyricShow = true;
	
  	this.toggle = function(){
		
		if(this.isLyricShow){
			this.hide();
		} else {
			this.show();
		}
		return this;
	}
	
	this.show = function(){
    	$("#lyric").show(this.delay);
    	this._setWindow(386);
    	this.isLyricShow = true;
  	}
	
	this.hide = function(){
    	$("#lyric").hide(this.delay);
    	this._setWindow(160);
    	this.isLyricShow = false;
  	}
	
  	this._setWindow = function(height){
		if(!DEBUG){
			return;
			window.itunes.setWindowSizeHeight_withWidth_(height,420);
		}
    	return this;
	}
	
	//config
	this.auto_scroll = true;
  	this.lyric_time = new Array();
  	this.lyric_text = new Array();
	
//	this.intervalHandle;
  	this.refresh = function(){
		LYRIC_LINE_HEIGHT = parseInt( $(LYRIC_TAG_ID).css('line-height') );
        LYRIC_DISPLAY_OFFSET = parseInt( $(LYRIC_TAG_ID).height()/LYRIC_LINE_HEIGHT/2 );
        
		this.lyric_time = new Array();
		this.lyric_text = new Array();
		this.lyric_top  = new Array();
//    	if(!this.isLyricShow){
//      		return ;
//    	}
        
		lyric = this.getLyric();
        
		if(!lyric){
			return;
		}
    	
		var div_lyr = $("#lyric");
		
		//clean the lyric tag
		div_lyr.empty();
		
		//remove to Python this.parseLyric();
		
		for(var i=0;i<LYRIC_DISPLAY_OFFSET;i++){
			var empty_div = $("<div>&nbsp;</div>");
			div_lyr.append(empty_div);
		}
		// set the offset-top
		var base_offsetTop = div_lyr.offset().top;
		
		for(var i=0;i<this.lyric_time.length;i++)
		{
			var div = $("<div></div>").attr("id","lyric-"+i);//attr("onClick","PlayerPosition("+lyric_time[i]+");");
			div.text(this.lyric_text[i]);
			div_lyr.append(div);
			var top = div.offset().top - base_offsetTop;
			this.lyric_top[i] = top;
			/*
			 if(DEBUG){
			 div.text(top);
			 }
			 */
		}
		for(var i=0;i<LYRIC_DISPLAY_OFFSET;i++){
			var empty_div = $("<div>&nbsp;</div>");
			div_lyr.append(empty_div);
		}
		
		$("#lyric-0").addClass("current-line");
  	}
	
	/* rewrite these to Python
	// parse the lyric into array
	this.parseLyric = function(){
		var index=0;
		var temp_lyric = this.getLyric();
		
		if(!temp_lyric){
	    	return;
		}
		
		
		var array = temp_lyric.split("\n");
		
		for(line in array){
			var str = array[line];
			var last = 0;
			var leftCount = 0;
			var leftArr = new Array();
			for(var k=0; k<str.length ; k++){
				if(str.charAt(k)=="["){
					var start = k;
					var end = -1;
					for(;k<str.length;k++){
						if(str.charAt(k)=="]"){
							end = k;
							last = end;
							break;
						}
					}
					time = str.substring(start+1,end);
					leftArr[leftCount] = this.toSecond(time);
					leftCount ++ ;
				}
			}
			lyric = $.trim( str.substring(last+1) ); 
			if(lyric){
				for(var i=0;i<leftCount;i++){
					this.lyric_time[index] = leftArr[i];
					this.lyric_text[index] = lyric;
					index++;
				}
			}
		}
		this.sortAr();
	}
	
	// sort the lyric_time & the lyric_text array.
	this.sortAr= function()
	{
		var temp=null;
		var temp1=null;
		for(var k=0;k<this.lyric_time.length;k++){
			for(var j=0;j<this.lyric_time.length-k;j++)
			{
				if(this.lyric_time[j]>this.lyric_time[j+1])
				{
					temp=this.lyric_time[j];
					temp1=this.lyric_text[j];
					this.lyric_time[j]=this.lyric_time[j+1];
					this.lyric_text[j]=this.lyric_text[j+1];
					this.lyric_time[j+1]=temp;
					this.lyric_text[j+1]=temp1;
				}
			}
		}
	}
	
	
	// Parse the time to second.
	this.toSecond = function(t){
		var m=t.substring(0,t.indexOf(":"));
		var s=t.substring(t.indexOf(":")+1);
		s=parseInt(s.replace(/\b(0+)/gi,""));
		if(isNaN(s))
			s=0;
		var totalt=parseInt(m)*60+s;
		if(isNaN(totalt))
			return 0;
		return totalt;
	}
	*/
	
	
	this.getLyric = function () {
		var lyric = window.itunes.getLyric();
		if(lyric){
			var result = $.parseJSON(lyric);
			if(result.lyric_time && result.lyric_text){
				this.lyric_time = result.lyric_time;
				this.lyric_text = result.lyric_text;
                Lyric.auto_scroll = true;
				$("#lyric").css('overflow-y','hidden').show();
				$("#config").hide();
				return true;
			}
		} else {
			this.lyric_time = new Array();
			this.lyric_text = new Array();

            var txt = window.itunes.getLyric_("txt");
            if(txt){
                txt = txt.replace(/\n/g,'<br>');
                Lyric.auto_scroll = false;
                $("#config").hide();
                $("#lyric").empty().html(txt).css('overflow-y','auto').show();
                return false;
            }
            
			this.searchLyric();
			return false;
		}
	}
    
    this._in_search = false;
    
    this.searchLyric = function(engine){
        if(this._in_search){
            return;
        }
        engine = parseInt(engine);
        if(engine || engine == 0){
			window.itunes.searchLyric_(engine);
		} else {
			window.itunes.searchLyric();
		}
        jQuery("#config").text( __("Searching...") );
        this._in_search = true;
    }
    
	this.searchCallback = function(json){
//        var json = window.itunes.search   Result();
        //print(json);
        var result = $.parseJSON(json);
		
		// the result
        this.has_download = false;
        
		if(result.length > 1){
			// show result
			$("#lyric").hide(1000);
			$("#config").show(1000);
			$("#config").empty();
			for(var i in result){
				var node = jQuery("<a href=\"#\"></a>")
				.attr("onClick","Lyric.download(\""+result[i].downloadurl+"\")")
				.text(result[i].title +" - "+result[i].artist);
				var div = jQuery("<div></div>").append(node);
				jQuery("#config").append(div);
			}
			window.setTimeout("Lyric.download(\""+ result[0].downloadurl +"\")",AUTO_DOWNLOAD_AFTER);
		} else if(result.length == 1){
			lyric = this.download(result[0].downloadurl);
		} else {
			$("#lyric").hide(1000);
			$("#config").show(1000);
			$("#config").empty();
			$("#config").html(__("LYRIC_NO_FOUND")+"<br>");
			window.setTimeout("Lyric.showConfig()",1000);
            this._in_search = false;
		}
	}
	
	this.showConfig = function (){
		$("#config").empty();
		//$("#config").html(__("LYRIC_NO_FOUND")+"<br>");
		// @todo , get it from objc
		var engines = ['QianQian','Lyricist','LyricWiki'];
		for(var i in engines){
			$("<a href=\"#\"></a>").attr("onClick","Lyric.searchLyric("+i+")").text(__("TRY_SEARCH")+" "+engines[i]).appendTo("#config");
			$("<br>").appendTo("#config");
		}
		//$("config").html();
	}
	
	
	
	this.has_download = false;
	
	this.download = function(url){
		if(this.has_download){
			return;
		} else {
			if(url){
                print('download and url is'+url);
				//@todo maybe return true or false
				window.itunes.downloadLyric_(url);
			}
			this.has_download = true;
			$("#lyric").show();
			$("#config").hide();
            GiSongChanged();
            setTimeout ('GiSongChanged()' , 1000);
            this._in_search = false;
		}
	}
	
	this.scrollTo = (function(){
						 var location;
						 var dely;
						 
						 var is_start=false;
						 
						 function set(loca,de){
					 
							 location = loca- LYRIC_DISPLAY_OFFSET*LYRIC_LINE_HEIGHT;
							 
							 //this.trace('Move to:'+location)
							 
							 dely = de;
							 if(!is_start){
								move();
							 }
						}
					 
					 function move(){
             var MAX_SCROLL_DISTANCE = 50;
						 var frame = $("#lyric");
						 var top = frame.scrollTop();
						 var to;
						 //			alert('moveTo'+location+'top'+top);
						 
						 if(location == top){
						 //alert('moveTo'+location+'top'+top);
							is_start = false;
							return;
						 }
						 if( top > location ){
                   if( (top - location) > MAX_SCROLL_DISTANCE){
                   to = location + MAX_SCROLL_DISTANCE;
                   }else{
                   to = top -1;
                   }
						 } else {
                   if( (location - top) > MAX_SCROLL_DISTANCE){
                   to = location - MAX_SCROLL_DISTANCE;
                   }else {
                   to = top +1;
                   }
                   
							
						 }
						 if(!dely || !Lyric.auto_scroll){
							to = location;
							is_start = false;
						 } else {
							is_start = true;
							window.setTimeout(move,1);
						 }

						 frame.scrollTop(to);
					 }
					 return set;
					 })();
	
	
	
	
	this.last_index = 0;
	this.scrollLyric = function(){
		if(this.auto_scroll){
			if(this.lyric_time.length == 0){
				return;
			}
			var time = this.playerPosition();
			var index= this.getIndexFromTime(time);
			if(this.last_index != index){
				$("#lyric-"+index).addClass("current-line");
				$("#lyric-"+this.last_index).removeClass("current-line");
				this.last_index = index;
			}
			this.scrollTo(this.lyric_top[index],20);
		} else {
			return ;
		}
		//this.toggle();
	}
	
	this.getIndexFromTime = function(position){
		return this.getIndexFrom(position,false);
	}
	
	this.getIndexFrom = function(position,top){
		if(top){
			lyric_time = this.lyric_top;
		} else {
			lyric_time = this.lyric_time;
		}
		// 0 1 2 3 4 5 6 7 8 9 - length 10
		var length = lyric_time.length;
		
		if(this.last_index>length-2){
			this.last_index = 0;
		}
		var index = this.last_index;
		
		if(position <= lyric_time[0]){
			return 0;
		}
		
		if(position >= lyric_time[length-1]){
			return length - 1;
		}
		
		if(position>lyric_time[index+1]){
			while( position > lyric_time[index+1] ){
				if( index < lyric_time.length-1 ){
					index++;
				} else {
					break;
				}
			}
		}
		
		if(position<lyric_time[index]){
			while( position < lyric_time[index] ){
				if(index>0){
					index--;
				} else {
					break;
				}
			}
		}
		return index;
	}
	
	this.getTimeFromScrollTop = function(top){
		var index = this.getIndexFrom(top,true);
		
		var temp =  (top - this.lyric_top[index]) / (this.lyric_top[index+1] - this.lyric_top[index]);		
		
		var time = this.lyric_time[index] + 
		parseInt( 
				 (this.lyric_time[index+1] - this.lyric_time[index]) * temp  
				 );
  		return time;
	}
	
	// get and set player position
	this.playerPosition = function(pos){
		if(DEBUG){
			player = jQuery("#player").get(0);
			if(pos || pos==0){
				player.currentTime = pos;
			}
			return player.currentTime;
		}
		if(pos || pos==0){
			pos = pos/1000
			window.itunes.setPosition_(pos);
			track.pos = position;
			return 0;
			//set pos
		} else {
			return track.position * 1000;
		}
	}
	
	this.trace = function(msg){
		if(DEBUGINAPP){
			$('#title').text(msg);
		}
	}
}



// test case
if(DEBUG){
	$(function(){
	  $('body').append('<audio id=\"player\" src=\"See You Soon.mp3\" controls preload> </audio>')
	  .append("<div id=\"debug\"></div>");		
	  //		var client = setLocation();
	  
	  });
}
