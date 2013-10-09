/**
 * @file    js/global.js
 *
 * copyright (c) 2006-2009 Frank Hellenkamp [jonas@depagecms.net]
 *
 * @author    Frank Hellenkamp [jonas@depagecms.net]
 */

// global helpers
// {{{ getHexColorFromString()
function getHexColorFromString(colorString) {
    var hexCode;
    if (colorString == "transparent") {
        hexCode = "000000";
    } else if (colorString.substr(0, 3) == "rgb") {
        var components = colorString.match(/[0-9]+/g);
        var r = parseInt(components[0], 10).toString(16);
        var g = parseInt(components[1], 10).toString(16);
        var b = parseInt(components[2], 10).toString(16);

        if (r.length < 2) r = "0" + r;
        if (g.length < 2) g = "0" + g;
        if (b.length < 2) b = "0" + b;

        hexCode = r + g + b;
    } else if (colorString.charAt(0) == "#") {
        hexCode = colorString.substring(1);
    }

    return "0x" + hexCode;
}
/* }}} */

// javascript flash detection
// {{{ jquery.browser.iphone
jQuery.browser.iphone = function() {
    return (/iphone/).test(navigator.userAgent.toLowerCase());
}();
// }}}
// {{{ jquery.browser.has3d
jQuery.extend(jQuery.browser, {
    has3d: (function () {
        var el = document.createElement('p'), 
            has3d,
            transforms = {
                'webkitTransform':'-webkit-transform',
                'OTransform':'-o-transform',
                'msTransform':'-ms-transform',
                'MozTransform':'-moz-transform',
                'transform':'transform'
            };

        // Add it to the body to get the computed style.
        document.body.insertBefore(el, null);

        for (var t in transforms) {
            if (el.style[t] !== undefined) {
                el.style[t] = "translate3d(1px,1px,1px)";
                has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
            }
        }

        document.body.removeChild(el);

        return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
    })
});
// }}}
// {{{ jquery.flash
jQuery.fn.flash = function(params) {
    var html1 = "";
    var html2 = "";
    var flashParam = [];

    for (var p in params.params) {
        flashParam.push(p + "=" + encodeURI(params.params[p]));
    }

    //object part
    html1 += "<object type=\"application/x-shockwave-flash\" ";
    html1 += "data=\"" + params.src + "?" + flashParam.join("&amp;") + "\" ";
    if (params.width !== undefined) {
        html1 += "width=\"" + params.width + "\" ";
    }
    if (params.height !== undefined) {
        html1 += "height=\"" + params.height + "\" ";
    }
    if (params.className !== undefined) {
        html1 += "class=\"" + params.className + "\" ";
    }
    if (params.id !== undefined) {
        html1 += "id=\"" + params.id + "\" ";
    }

    //param part
    html2 += "<param name=\"movie\" value=\"" + params.src + "?" + flashParam.join("&amp;") + "\" />";

    if (params.transparent === true) {
        html1 += "mwmode=\"transparent\"";
        html2 += "<param name=\"wmode\" value=\"transparent\" />";
    }
    html1 += ">";

    return $(html1 + html2 + "</object>");
};
// }}}

// embedded jquery plugins
// {{{ jquery pause
/*
 * Jonathan Howard
 *
 * jQuery Pause
 * version 0.2
 *
 * Requires: jQuery 1.0 (tested with svn as of 7/20/2006)
 *
 * Feel free to do whatever you'd like with this, just please give credit where
 * credit is do.
 *
 *
 *
 * pause() will hold everything in the queue for a given number of milliseconds,
 * or 1000 milliseconds if none is given.
 *
 *
 *
 * unpause() will clear the queue of everything of a given type, or 'fx' if no
 * type is given.
 */

$.fn.pause = function(milli,type) {
        milli = milli || 1000;
        type = type || "fx";
        return this.queue(type,function(){
                var self = this;
                setTimeout(function(){
                        $.dequeue(self);
                },milli);
        });
};

$.fn.clearQueue = $.fn.unpause = function(type) {
        return this.each(function(){
                type = type || "fx";
                if(this.queue && this.queue[type]) {
                        this.queue[type].length = 0;
                }
        });
};
// }}}
// {{{ jquery fx custom
jQuery.fx.prototype.custom = function(from, to, unit){
    this.startTime = (new Date()).getTime();
    this.start = from;
    this.end = to;
    this.unit = unit || this.unit || "px";
    this.now = this.start;
    this.pos = this.state = 0;
    this.update();

    var self = this;
    function t(){
        return self.step();
    }

    t.elem = this.elem;

    jQuery.timers.push(t);

    if ( jQuery.timers.length == 1 ) {
        var timer = setInterval(function(){
            var timers = jQuery.timers;
            
            for ( var i = 0; i < timers.length; i++ ) {
                if ( !timers[i]() ) {
                    timers.splice(i--, 1);
                }
            }

            if ( !timers.length ) {
                clearInterval( timer );
            }
        }, 75);
    }
};
// }}}

// replace content, depending on reader capabilities
// {{{ replaceInteractiveContent()
function replaceInteractiveContent() {
    var formnum = 0;

    // {{{ get language from content tag in header
    var lang = $("html").attr("lang");
    // }}}
    // {{{ add click event for teaser
    $(".teaser").click( function() {
        document.location = $("a", this)[0].href;
    });
    // }}}
    // {{{ replace buttons by textlinks
    $("form").each(function() {
        var form = this;

        if (!form.id) {
            form.id = "textbutton" + formnum++ + "form";
        }
        $("input.textbutton", form).each( function() {
            $(this).hide();

            if (this.type == "submit") {
                ionclick = "document.forms." + form.id + ".submit(); return false;";
            } else if (this.type == "reset") {
                ionclick = "document.forms." + form.id + ".reset(); return false;";
            } else {
                ionclick = this.onclick;
            }

            $(this).after("<a href=\"#\" onclick=\"" + ionclick + "\">" + this.value + "</a>");
        });
    });
    // }}}
    // {{{ add handlers for code-listings
    var text_source_showplain;
    var text_source_showstyled;
    if (lang == "de") {
        text_source_showplain = "Quelltext als reinen Text anzeigen";
        text_source_showstyled = "Quelltext formatiert anzeigen";
    } else {
        text_source_showplain = "View this source in Plain Text";
        text_source_showstyled = "View this source as Highlighted Code";
    }
    $('.source pre').each(function() { //on each code box do
        $(this)
            .before('<a href="#" class="codeswitch">' + text_source_showplain + '</a>') //write a code right before the code-box
            .after('<div><textarea rows="' + ($(this).children().html().split("\n").length-1) + '" cols="50">' + $(this).children().html() + '</textarea></div>'); //write a textarea with the content of the code-box after it
    });

    $('.codeswitch').toggle(function() { //hide code-box and show textarea
        $(this)
            .text(text_source_showstyled) //change text of the link
            .next().hide().next().show(); //first next is code-box, second is textarea
        }, function() { //hide textarea and show code box
        $(this)
            .text(text_source_showplain)
            .next().show().next().hide();
    });
    
    // style source code
    //prettyPrint();
    // }}}
     // {{{ change height of iframe
    $("iframe[seamless]").iframeAutoHeight({
        heightOffset: 30
    });
    // }}}
}
// }}}

// {{{ addDoxygenBehaviours()
function addDoxygenBehaviours() {
    $(".dynheader").toggle( function() {
        $(this).addClass("active");
        $(".dyncontent").show();
    }, function() {
        $(this).removeClass("active");
        $(".dyncontent").hide();
    });
    $(".dyncontent").hide();
}
// }}}
    // {{{ onDocumentScroll()
    function onDocumentScroll() {
        var scrollTop = window.pageYOffset || $(window).scrollTop();
        var windowHeight = $(window).height();
        $(".articlefooter").each(function() {
            var $el = $(this);
            $el.toggleClass("in-view", $el.offset().top - windowHeight / 3 * 2 < scrollTop);
        });
    }
    // }}}

// {{{ register events
$(document).ready(function() {
    // replace content
    replaceInteractiveContent();
    addDoxygenBehaviours();

    $(window).on("statechangecomplete", replaceInteractiveContent);
    $(window).on("scroll resize", onDocumentScroll);

    // add 3d flag
    if ($.browser.has3d()) {
        $("html").addClass("css-3dtransform");
    }

    // hide urlbar
    if ($.browser.iphone) {
        $(window).load(function() {
            this.scrollTo(0, 1);
        });
    }
});
// }}}
    
/* vim:set ft=javascript sw=4 sts=4 fdm=marker : */
