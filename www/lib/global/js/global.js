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
    // {{{ add burger menu
    $("#main-nav").on("click", function() {
        $(this).toggleClass("active");
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

// add workaround for not included smart menus plugin
$.fn.smartmenus = function() {};

// {{{ register events
$(document).ready(function() {
    // replace content
    replaceInteractiveContent();
    addDoxygenBehaviours();

    $(window).on("statechangecomplete", replaceInteractiveContent);
    $(window).on("scroll resize", onDocumentScroll);
});
// }}}

/* vim:set ft=javascript sw=4 sts=4 fdm=marker : */
