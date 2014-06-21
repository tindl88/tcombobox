// tindl88@gmail.com
;(function($) {
    var unique, uniqueId, currentText, markup;
    var opts = {};
    var def = {
        width:'auto',
        height:30,
        fadeSpeed: 140,
        arrowWidth: 25,
        onChange: function(){}
    }
    var methods = {
        init: function(options){
            methods.clickOut();
            return this.each(function () {
                opts = $.extend(def, options || {});
                methods.draw($(this));
            });

        },
        draw: function(elm){
            // Lấy cấu trúc <select> và tạo 'styleCombo'
            unique = new Date().getTime();
            uniqueId = 'tCombobox'+unique;
            var items = '';
            var w = opts.width=='auto' ? elm.outerWidth() : opts.width;
            currentText = elm.find("option:selected").text();
            $.each(elm.find("option"), function(i,o){
                items+='<li opt-value="'+$(o).val() + '" '+($(o).is(":selected")?' class="active"':'')+'><a>'+$(o).text()+'</a></li>';
            });
            elm.attr('rel','#'+uniqueId);
            markup='<div class="tComboboxWrap" id="'+uniqueId+'" style="z-index:'+elm.attr('t-index')+';position:absolute;left:'+elm.position().left+'px;top:'+elm.position().top+'px"><div class="tCombobox"><div class="select" style="width:'+w+'px"><div class="text" style="width:'+(w-opts.arrowWidth)+'px;height:'+opts.height+'px"><span>'+currentText+'</span></div><div class="sep" style="width:'+opts.arrowWidth+'px;height:'+opts.height+'px"></div><div class="clearfix"></div></div><div class="option"><ul>'+items+'</ul></div></div></div>';
            elm.after(markup);

            // Gán sự kiện
            methods.bindEvents(elm);
        },
        bindEvents: function(elm){
            var $cbx = $(elm.attr('rel'));
            methods.unbindEvents(elm);
            // Sự kiện click cho mũi tên
            $cbx.find('.text').add($cbx.find('.sep')).bind('click', function() {
                if($cbx.find('ul').css('display') == 'none'){
                    $cbx.find('ul').fadeToggle(opts.fadeSpeed);
                }
            });

            // Sự kiện click chọn <option>
            $cbx.find('li').bind('click', function(){
                $cbx.find('ul').fadeOut(opts.fadeSpeed);
                if($(this).hasClass('active')) return;
                $cbx.find('li').removeClass('active');
                $(this).addClass("active");
                $cbx.find('.text span').text($(this).text());
                elm.val($(this).attr('opt-value'));
                opts.onChange.call(elm);
            });
        },
        unbindEvents: function(elm){
            var $cbx = $(elm.attr('rel'));
            $cbx.find('ul').fadeOut(opts.fadeSpeed);
            $cbx.find('.text').add($cbx.find('.sep'),$cbx.find('li')).unbind('click');
        },
        enabled: function(value){
            $.each(this, function(i,o){
                var $cbx = $($(o).attr('rel'));
                if(value){
                    $(o).removeAttr('disabled');
                    $cbx.removeClass('tComboboxDisabled');
                    methods.bindEvents($(o));
                }
                else{
                    $(o).attr('disabled', 'disabled');
                    $cbx.addClass('tComboboxDisabled');
                    methods.unbindEvents($(o));
                }
            });
        },
        resize: function(){
            $.each(this, function(i,o){
                var $cbx = $($(o).attr('rel'));
                $cbx.find('ul').fadeOut(opts.fadeSpeed);
                $cbx.css({left:$(o).position().left,top:$(o).position().top});
            });
        },
        clickOut: function(){
            $(document).on('mouseup', function(e) {
                $('.tComboboxWrap ul').fadeOut(opts.fadeSpeed);
            });
        }
    };
    $.fn.tCombobox = function(method) {
        if (methods[method])
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        else if (typeof method === 'object' || !method)
            return methods.init.apply(this, arguments);
        else 
            $.error('tMenu: Method ' + method + ' does not exist.');
    };
})(jQuery);