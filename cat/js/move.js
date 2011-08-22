var Move;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
$(function() {
  return window.lyric = new Move();
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
    base_offset_top = $("#lyric").offset().top;
    _ref2 = this.lyrics;
    _results = [];
    for (key = 0, _len = _ref2.length; key < _len; key++) {
      value = _ref2[key];
      top = $("<div>" + value.Content + "</div>").attr("id", "lyric-" + key).appendTo("#lyric").offset().top;
      _results.push(this.lyrics[key]['top'] = top);
    }
    return _results;
  };
  Move.prototype.pos = function(time) {
    var index, top;
    if (!this.lyrics) {
      return time;
    }
    $("#lyric-" + this._begin).removeClass();
    index = this.searchIndexFromTime(time);
    $("#lyric-" + index).addClass("current-line");
    top = this.lyrics[index].top;
    this.scrollTo(top);
    console.log("Time:" + time + " Index:" + index + " Top:" + top);
    return index;
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
        return this._begin = index;
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