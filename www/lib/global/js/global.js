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
// {{{ jquery.browser.flash
jQuery.extend(jQuery.browser, {
    flash: (function (neededVersion) {
        var found = false;
        var version = "0,0,0";

        try {
            // get ActiveX Object for Internet Explorer
            version = new ActiveXObject("ShockwaveFlash.ShockwaveFlash").GetVariable('$version').replace(/\D+/g, ',').match(/^,?(.+),?$/)[1];
        } catch(e) {
            // check plugins for Firefox, Safari, Opera etc.
            try {
                if (navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin) {
                    version = (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]).description.replace(/\D+/g, ",").match(/^,?(.+),?$/)[1];
                }
            } catch(e) {
                return false;
            }           
        }

        var pv = version.match(/\d+/g);
        var rv = neededVersion.match(/\d+/g);

        for (var i = 0; i < 3; i++) {
            pv[i] = parseInt(pv[i] || 0, 10);
            rv[i] = parseInt(rv[i] || 0, 10);

            if (pv[i] < rv[i]) {
                // player is less than required
                return false;
            } else if (pv[i] > rv[i]) {
                // player is greater than required
                return true;
            }
        }
        // major version, minor version and revision match exactly
        return true;
    })
});
// }}}
// {{{ jquery.browser.iphone
jQuery.browser.iphone = function() {
    return (/iphone/).test(navigator.userAgent.toLowerCase());
}();
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
// {{{ replaceFlashContent()
function replaceFlashContent() {
    $("img.flash_repl").each(function() {
        var parent = $(this).parent().prepend( 
            $().flash({
                src:            this.src.replace(/\.jpg|\.gif|\.png/, ".swf").replace(/\&/, "&amp;"),
                width:          this.width,
                height:         this.height,
                className:      "flash",
                id:             this.id ? this.id + "_flash" : null,
                transparent:    $(this).hasClass("trans")
            }) 
        );
        if (parent[0].nodeName == "A") {
            parent.click(function() {
                return false;
            });
        }
    });
}
// }}}
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
    // email antispam
    $("a[href*='mailto:']").depageAntispam();
    
    // setup social buttons
    $(".social").depageSocialButtons({
        services: [
            'twitter',
            'facebookShare',
            'googleplusShare',
            'digg',
            'reddit',
            'mail'
        ]
    });
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
    // {{{ add handlers for slideshow images
    $(".slideshow").depageSlideshow({
        elements: "div"
    });
    // }}}
        // {{{ add handlers for compare images
        $(".compare").depageCompareImages();
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
    // }}}

    if (!$.browser.iphone) {
        // {{{ add handlers for zoom images
        var zoomRatio;
        var thumbMoveRatio;
        var oldWidth;
        var newWidth;

        $(".zoom").each( function() {
            var hoverText = "Zum \"Zoomen\" mit der Maus über das Bild fahren.";
            if ($(".back img", this).length == 1) {
                hoverText += " Klicken, um zwischen Vorder- und Rückseite zu wechseln.";
            }

            $(this).append("<p class=\"info\">(" + hoverText + ")</p>");
            $(this).append("<span class=\"thumb\"><span class=\"border\"></span><img src=\"" + $(".front img", this)[0].src + "\"></span>");
        });

        $(".zoom").click( function() {
            if ($(".back img", this).length == 1) {
                var frontsrc = $(".front img", this)[0].src;
                var backsrc = $(".back img", this)[0].src;

                $(".front img", this)[0].src = backsrc;
                $(".thumb img", this)[0].src = backsrc;
                $(".back img", this)[0].src = frontsrc;
            }
        });
        $(".zoom").mouseover( function() {
            $(this).addClass("zoomed");

            if ($(".back img", this).length == 1) {
                $(".front img", this).css("cursor", "pointer");
            } else {
                $(".front img", this).css("cursor", "crosshair");
            }

            $(".front", this).height($(".front img", this).height());

            oldWidth = $(".front img", this).width();
            $(".front img", this).css("width", "auto");
            newWidth = $(".front img", this).width();

            $(".thumb", this).dequeue();
            $(".thumb", this).fadeIn(200);

            zoomRatio = newWidth / oldWidth;
            thumbMoveRatio = ($(".thumb img", this).width() - $(".thumb img", this).width() / zoomRatio) / oldWidth;

            $(".thumb .border", this).css({
                width: $(".thumb img", this).width() / zoomRatio,
                height: $(".thumb img", this).height() / zoomRatio,
                background: $.browser.msie ? "none": "#ffffff"
            });
        });
        $(".zoom").mouseout( function() {
            $(this).removeClass("zoomed");

            $(".front img", this).css({
                width: oldWidth,
                marginLeft: 0,
                marginTop: 0
            });

            $(".thumb", this).dequeue();
            $(".thumb", this).css("opacity", 1);
            $(".thumb", this).fadeOut(200);
        });
        $(".zoom").mousemove( function(e) {
            var offsetX = $(this).offset().left - e.pageX;
            var offsetY = $(this).offset().top - e.pageY;
            
            $(".front img", this).css({
                marginLeft: offsetX * (zoomRatio - 1),
                marginTop: offsetY * (zoomRatio - 1)
            });
            $(".thumb .border", this).each( function() {
                $(this).css({
                    left: - (offsetX * thumbMoveRatio),
                    top: - (offsetY * thumbMoveRatio)
                });
            });
        });
        // }}}
    }
}
// }}}

// fix browser behaviours
// {{{ fixHeightIE6()
function fixHeightIE6() {
    var body = $("body");
    var content = $("content");

    if (body.height() > content.height()) {
        content.height(body.height());
    }
}
// }}}
// {{{ fixFlashDisplayOpera()
function fixFlashDisplayOpera(numcall) {
    numcall++;
    if (numcall < 20) {
        setTimeout("fixFlashDisplayOpera(" + numcall + ")", 200);
    }

    if (numcall % 2 === 0) {
        $("object").css({ border: "0px solid" });
    } else {
        $("object").css({ border: "none" });
    }
}
// }}}

// {{{ register events
$(document).ready(function() {
    // replace content
    replaceInteractiveContent();
    prettyPrint();

    // add flash content
    if ($.browser.flash("8,0,0")) {
        replaceFlashContent();

        $("body").addClass("flash");
    }

    // fix browser bugs
    if ($.browser.msie) {
        fixHeightIE6();
        $(window).resize( fixHeightIE6 );
    }
    if ($.browser.opera) {
        fixFlashDisplayOpera(0);
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
