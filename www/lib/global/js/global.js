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
    // {{{ add burger menu
    $("#main-nav").on("click", function() {
        $(this).toggleClass("active");
    });
    // }}}
    // {{{ add toc scrolling
    var $links = $("a");
    $links.on("click", function() {
        var url = $(this).attr('href') || '';
        var base = window.location.href.replace(/#.*/, '');

        if (url.substring(0, base.length) === base || url.indexOf(':') === -1) {
            var id = this.hash;
            var $target = $(id);

            if ($target.length > 0) {
                var offset = $target.offset().top - 100;

                $(this).blur();

                $('html, body').animate({
                    scrollTop: offset
                }, {
                    duration: 400,
                    easing: "swing"
                });

                history.pushState({}, "", url);

                return false;
            }
        }
    });
    // }}}
}
// }}}

// {{{ onPageLoad()
function onPageLoad() {
    $(".image img, .image object").each(function() {
        var $img = $(this);
        var $caption = $("<span class=\"caption\"></span");

        $img.css({ width: (this.naturalWidth / 2) + "px"});
        $caption.insertAfter($img).text($img.attr("alt"));
    });
}
// }}}

// add workaround for not included smart menus plugin
$.fn.smartmenus = function() {};

// {{{ register events
$(document).ready(function() {
    if (window.frameElement) {
        $("body").addClass("embedded");
    }

    // replace content
    replaceInteractiveContent();

    $(window).on("statechangecomplete", replaceInteractiveContent);
    $(window).on("load", onPageLoad);
});
// }}}

/* vim:set ft=javascript sw=4 sts=4 fdm=marker : */
