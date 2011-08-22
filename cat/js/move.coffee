$ ->
    window.lyric = new Move()
    # test datas
    # for i in [1..100]
        # $('#lyric').append('kiss<br/>')

    # testjson = '''{"Lyrics":[{"Content":"Coldplay - A Whisper","Time":0},{"Content":"","Time":8000},{"Content":"A whisper, a whisper, a whisper, a whisper","Time":17035},{"Content":"A whisper, a whisper, a whisper, a whisper","Time":25013},{"Content":"","Time":29089},{"Content":"I hear the sound like the ticking of clocks","Time":36085},{"Content":"Remember your face and remember to see when you are gone","Time":40093},{"Content":"I hear the sound like the ticking of clocks","Time":53008},{"Content":"Come back and look for me","Time":56099},{"Content":"Look for me when I am lost","Time":58096},{"Content":"","Time":62006},{"Content":"Just a whisper, a whisper, a whisper, a whisper","Time":64071},{"Content":"Just a whisper, a whisper, a whisper, a whisper","Time":72068},{"Content":"","Time":78044},{"Content":"Not since the day","Time":85085},{"Content":"When I still had these questions","Time":89018},{"Content":"Who just could blame","Time":93041},{"Content":"Shall I go forwards or backwards","Time":96097},{"Content":"Not since today","Time":101034},{"Content":"And I still get no answers","Time":105049},{"Content":"","Time":108057},{"Content":"Just a whisper, a whisper, a whisper, a whisper","Time":113061},{"Content":"Just a whisper, a whisper, a whisper, a whisper","Time":121043},{"Content":"","Time":126060},{"Content":"I hear the sound like the ticking of clocks","Time":134002},{"Content":"Remember your face and remember to see when you are gone","Time":138003},{"Content":"I hear the sound like the ticking of clocks","Time":146006},{"Content":"Come back and look for me","Time":150001},{"Content":"Look for me when I am lost","Time":152018},{"Content":"","Time":155008},{"Content":"Just a whisper, a whisper, a whisper, a whisper","Time":157096},{"Content":"Just a whisper, a whisper, a whisper, a whisper","Time":165093},{"Content":"","Time":171021},{"Content":"","Time":222096},{"Content":"~~END~~","Time":233019}]}'''
    # window.lyric.update testjson

    # window._time = 7000
    # window.setInterval ->
        # window._time += 500
        # window.GiPlayerPosition window._time
    # ,500

    # window.count = 0
    # assign 400 , 0
    # assign 8001 , 1
    # assign 138003 , 25
    # assign 233019 , 34
    # assign 244000 , 34
    # assign 222096 , 33
    # assign 93044 , 16
    # assign 150001, 27
    # console.log "Total Count: #{window.count}"

# assign = ( param , value )->
    # result = window.lyric.pos param
    # if result is value
        # console.log "Success #{window.lyric.lyrics[value].Content}"
    # else
        # console.log "Error! expect value #{value} , got #{result}"

class Move
    constructor:()->
        @DRAG_SPEED = 1
        @AUTO_SCROLL = true
        @DISPLAY_OFFSET = 4
        @LINE_HEIGHT = parseInt( $("#lyric").css('line-height') );
        @DISPLAY_OFFSET = parseInt( $("#lyric").height() / @LINE_HEIGHT / 2 );

        $("#lyric").bind 'mousedown' , (e)=>
            console.log "mousedown"
            @mouse_start = e.clientY
            @lyric_start = $('#lyric').scrollTop()
            $(document).bind 'mousemove',(e)=>
                distance = e.clientY - @mouse_start
                moveto = @lyric_start - @DRAG_SPEED * distance
                moveto = 0 if moveto < 0
                moveto = moveto + @DISPLAY_OFFSET * @LINE_HEIGHT
                $("#lyric").scrollTop(moveto)
                #mousemove
            $(document).bind 'mouseup',(e)=>
                $(document).unbind("mousemove").unbind("mouseup")
                @AUTO_SCROLL = true
                # Todo Scrolltop set player position to pos
    clear:()->
        $("#lyric").html( __("NO_LYRIC") )
        @_begin=0
        @lyrics = null

    update:(info)->
        @clear()
        @lyrics = $.parseJSON(info)['Lyrics']
        $("#lyric").empty()
        for i in [1..@DISPLAY_OFFSET]
            empty = $("<div>&nbsp;</div>").appendTo("#lyric")
        base_offset_top = $("#lyric").offset().top + @DISPLAY_OFFSET * @LINE_HEIGHT
        for value,key in @lyrics
            top = $("<div>#{value.Content}</div>").attr("id","lyric-#{key}").appendTo("#lyric").offset().top - base_offset_top
            @lyrics[key]['top']=top
        # console.log @lyrics

    pos:(time)->
        return time if not @lyrics
        index = @searchIndexFromTime time
        if index != @_begin
            $("#lyric-#{@_begin}").removeClass()
            $("#lyric-#{index}").addClass("current-line")
            top = @lyrics[index].top
            @scrollTo top
            # console.log "- #{@lyrics[index].Content}"
            # console.log "Time:#{time} Index:#{index} Top:#{top}"
            @_begin = index
        else
            index

    searchIndexFromTime:(time)->
        len = @lyrics.length
        return 0 if len<2
        return len-1 if time > @lyrics[len-2].Time
        return 0 if time < @lyrics[1].Time
        index = @_begin
        while true
            window.count += 1
            if ( time >= @lyrics[index].Time and time < @lyrics[index+1].Time ) then return index
            else if time >= @lyrics[index+1].Time then index++
            else index--

    scrollTo:(location)->
        $("#lyric").scrollTop location

