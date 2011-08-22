var Move;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
$(function() {
  var testjson;
  window.lyric = new Move();
  testjson = '{"Lyrics":[{"Content":"Coldplay - A Whisper","Time":0},{"Content":"","Time":8000},{"Content":"A whisper, a whisper, a whisper, a whisper","Time":17035},{"Content":"A whisper, a whisper, a whisper, a whisper","Time":25013},{"Content":"","Time":29089},{"Content":"I hear the sound like the ticking of clocks","Time":36085},{"Content":"Remember your face and remember to see when you are gone","Time":40093},{"Content":"I hear the sound like the ticking of clocks","Time":53008},{"Content":"Come back and look for me","Time":56099},{"Content":"Look for me when I am lost","Time":58096},{"Content":"","Time":62006},{"Content":"Just a whisper, a whisper, a whisper, a whisper","Time":64071},{"Content":"Just a whisper, a whisper, a whisper, a whisper","Time":72068},{"Content":"","Time":78044},{"Content":"Not since the day","Time":85085},{"Content":"When I still had these questions","Time":89018},{"Content":"Who just could blame","Time":93041},{"Content":"Shall I go forwards or backwards","Time":96097},{"Content":"Not since today","Time":101034},{"Content":"And I still get no answers","Time":105049},{"Content":"","Time":108057},{"Content":"Just a whisper, a whisper, a whisper, a whisper","Time":113061},{"Content":"Just a whisper, a whisper, a whisper, a whisper","Time":121043},{"Content":"","Time":126060},{"Content":"I hear the sound like the ticking of clocks","Time":134002},{"Content":"Remember your face and remember to see when you are gone","Time":138003},{"Content":"I hear the sound like the ticking of clocks","Time":146006},{"Content":"Come back and look for me","Time":150001},{"Content":"Look for me when I am lost","Time":152018},{"Content":"","Time":155008},{"Content":"Just a whisper, a whisper, a whisper, a whisper","Time":157096},{"Content":"Just a whisper, a whisper, a whisper, a whisper","Time":165093},{"Content":"","Time":171021},{"Content":"","Time":222096},{"Content":"~~END~~","Time":233019}]}';
  window.lyric.update(testjson);
  window._time = 7000;
  return window.setInterval(function() {
    window._time += 500;
    return window.GiPlayerPosition(window._time);
  }, 500);
});
Move = (function() {
  function Move() {
    this.DRAG_SPEED = 1;
    this.AUTO_SCROLL = true;
    this.DISPLAY_OFFSET = 4;
    this.LINE_HEIGHT = parseInt($("#lyric").css('line-height'));
    this.DISPLAY_OFFSET = parseInt($("#lyric").height() / this.LINE_HEIGHT / 2);
    $("#lyric").bind('mousedown', __bind(function(e) {
      console.log("mousedown");
      this.mouse_start = e.clientY;
      this.lyric_start = $('#lyric').scrollTop();
      $(document).bind('mousemove', __bind(function(e) {
        var distance, moveto;
        distance = e.clientY - this.mouse_start;
        moveto = this.lyric_start - this.DRAG_SPEED * distance;
        if (moveto < 0) {
          moveto = 0;
        }
        moveto = moveto + this.DISPLAY_OFFSET * this.LINE_HEIGHT;
        return $("#lyric").scrollTop(moveto);
      }, this));
      return $(document).bind('mouseup', __bind(function(e) {
        $(document).unbind("mousemove").unbind("mouseup");
        return this.AUTO_SCROLL = true;
      }, this));
    }, this));
  }
  Move.prototype.clear = function() {
    $("#lyric").html(__("NO_LYRIC"));
    this._begin = 0;
    return this.lyrics = null;
  };
  Move.prototype.update = function(info) {
    var base_offset_top, empty, i, key, top, value, _len, _ref, _ref2, _results;
    this.clear();
    this.lyrics = $.parseJSON(info)['Lyrics'];
    $("#lyric").empty();
    for (i = 1, _ref = this.DISPLAY_OFFSET; 1 <= _ref ? i <= _ref : i >= _ref; 1 <= _ref ? i++ : i--) {
      empty = $("<div>&nbsp;</div>").appendTo("#lyric");
    }
    base_offset_top = $("#lyric").offset().top + this.DISPLAY_OFFSET * this.LINE_HEIGHT;
    _ref2 = this.lyrics;
    _results = [];
    for (key = 0, _len = _ref2.length; key < _len; key++) {
      value = _ref2[key];
      top = $("<div>" + value.Content + "</div>").attr("id", "lyric-" + key).appendTo("#lyric").offset().top - base_offset_top;
      _results.push(this.lyrics[key]['top'] = top);
    }
    return _results;
  };
  Move.prototype.pos = function(time) {
    var index, top;
    if (!this.lyrics) {
      return time;
    }
    index = this.searchIndexFromTime(time);
    if (index !== this._begin) {
      $("#lyric-" + this._begin).removeClass();
      $("#lyric-" + index).addClass("current-line");
      top = this.lyrics[index].top;
      this.scrollTo(top);
      return this._begin = index;
    } else {
      return index;
    }
  };
  Move.prototype.searchIndexFromTime = function(time) {
    var index, len, _results;
    len = this.lyrics.length;
    if (len < 2) {
      return 0;
    }
    if (time > this.lyrics[len - 2].Time) {
      return len - 1;
    }
    if (time < this.lyrics[1].Time) {
      return 0;
    }
    index = this._begin;
    _results = [];
    while (true) {
      window.count += 1;
      if (time >= this.lyrics[index].Time && time < this.lyrics[index + 1].Time) {
        return index;
      } else if (time >= this.lyrics[index + 1].Time) {
        index++;
      } else {
        index--;
      }
    }
    return _results;
  };
  Move.prototype.scrollTo = function(location) {
    return $("#lyric").scrollTop(location);
  };
  return Move;
})();