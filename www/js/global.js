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
    if (colorString == "transparent") {
	var hexCode = "000000";
    } else if (colorString.substr(0, 3) == "rgb") {
        var components = colorString.match(/[0-9]+/g);
        var r = parseInt(components[0]).toString(16);
        var g = parseInt(components[1]).toString(16);
        var b = parseInt(components[2]).toString(16);

        if (r.length < 2) r = "0" + r;
        if (g.length < 2) g = "0" + g;
        if (b.length < 2) b = "0" + b;

        var hexCode = r + g + b;
    } else if (colorString.charAt(0) == "#") {
        var hexCode = colorString.substring(1);
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
	    pv[i] = parseInt(pv[i] || 0);
	    rv[i] = parseInt(rv[i] || 0);

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

// replace content, depending on reader capabilities
// {{{ replaceEmailChars()
function replaceEmailChars(mail) {
    mail = unescape(mail);
    mail = mail.replace(/ \*at\* /g, "@");
    mail = mail.replace(/ \*dot\* /g, ".");
    mail = mail.replace(/ \*punkt\* /g, ".");
    mail = mail.replace(/ \*underscore\* /g, "_");
    mail = mail.replace(/ \*unterstrich\* /g, "_");
    mail = mail.replace(/ \*minus\* /g, "-");
    mail = mail.replace(/mailto: /, "mailto:");

    return mail;
}
// }}}
// {{{ replaceEmailRefs()
function replaceEmailRefs() {
    $("a[href*='mailto:']").each(function() {
        // replace attribute
        $(this).attr("href", replaceEmailChars($(this).attr("href")));
        
        //replace content if necessary
        if ($(this).text().indexOf(" *at* ") > 0) {
            $(this).text(replaceEmailChars($(this).text()));
        }
    });
}
// }}}
// {{{ replaceFlashContent()
function replaceFlashContent() {
    $("img.flash_repl").each(function() {
	var parent = $(this).parent().prepend( 
	    $().flash({
		src:		this.src.replace(/\.jpg|\.gif|\.png/, ".swf").replace(/\&/, "&amp;"),
		width:		this.width,
		height:		this.height,
		className:	"flash",
		id:		this.id ? this.id + "_flash" : null,
		transparent:    $(this).hasClass("trans")
	    }) 
	);
	if (parent[0].nodeName == "A") {
	    // deactivate link for surrounding a-node in safari
	    parent[0].href = "javascript:return false;";
	}
    });
}
// }}}
// {{{ replaceInteractiveContent()
function replaceInteractiveContent() {
    // {{{ get language from content tag in header
    var lang = $("meta[name = 'Content-Language']")[0].content;
    // }}}
    // {{{ add click event for teaser
    $(".teaser").click( function() {
        document.location = $("a", this)[0].href;
    });
    // }}}
    // {{{ add handlers for zoom images
    var zoomRatio;
    var thumbMoveRatio;

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

        var oldWidth = $(".front img", this).width();
        $(".front img", this).css("width", "auto");
        var newWidth = $(".front img", this).width();

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
            "width": null,
            "marginLeft": null,
            "marginTop": null
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
    // {{{ add handlers for compare images
    $(".compare").each( function() {
        var divs = $("div", this);
        var perc = 100 / divs.length;
        var percZoomed = 40 / (divs.length - 1);

        for (var i = 0; i < divs.length; i++) {
            $(divs[i]).css({
                left: i * perc + "%",
                top: 0
            });
        }
        $(this).mouseover( function(e) {
            var activeDiv = $(e.target).parent()[0];

            if (activeDiv.nodeName == "DIV") {
                var xpos = 0;

                for (var i = 0; i < divs.length; i++) {
                    $(divs[i]).dequeue();
                    $(divs[i]).animate({
                        left: xpos + "%"
                    });

                    if (divs[i] == activeDiv) {
                        xpos += 60;
                    } else {
                        xpos += percZoomed;
                    }
                }
            }
        });
        $(this).mouseout( function() {
            for (var i = 0; i < divs.length; i++) {
                $(divs[i]).dequeue();
                $(divs[i]).animate({
                    left: i * perc + "%"
                });
            }
        });
    });
    // }}}
    // {{{ add handlers for slideshow images
    $(".slideshow").each( function() {
        var divs = $("div", this);
        var speed = 3000;
        var pause = 3000;

        divs.css({
            top: 0
        });
        var fadeIn = function(n) {
            // wait
            $(divs[n]).animate({top: 0}, pause, function() {
                // fade in
                $(this).fadeIn(speed, function() {
                    if (n < divs.length - 1) {
                        // fade in next image
                        fadeIn(n + 1);
                    } else {
                        // hide all images, fade out last
                        for (var i = 1; i < divs.length - 1; i++) {
                            $(divs[i]).hide();
                        }
                        $(divs[n]).animate({top: 0}, pause, function() {
                            $(divs[n]).fadeOut(speed, function() {
                                fadeIn(1);
                            });
                        });
                    }
                });
            });
        }
        fadeIn(1);
    });
    // }}}
    // {{{ add handlers timeline
    $(".timeline").each( function() {
        var timeline = this;
        var animTime = 200;
        var count =  $("dt", timeline).length;
        var i = 0;

        $(timeline).addClass("interactive");

        $("dl", this).prepend("<div class=\"slider\"><div></div></div>");
        var slider = $(".slider div", timeline);
        slider.css({
            height: (100 / count) + "%",
            top: "0%"
        });

        $("dt", timeline).each( function() {
            this.contentElement = $(this).next("dd")[0];
            this.timelinePos = i++;

            this.show = function() {
                $(this).addClass("active");
                $(this.contentElement).fadeIn(animTime);
                slider.animate({
                    top: this.timelinePos * (100 / count) + "%"
                }, animTime);
            }
            this.hide = function() {
                $(this).removeClass("active");
                $(this.contentElement).fadeOut(animTime);
            }
            $(this).mouseup( function() {
                // hide others
                $("dt.active", timeline).not(this).each( function() {
                    this.hide();
                });
                // show content
                this.show();
            });
        });

        $("dd", timeline).hide();
        $("dt:first", timeline).mouseup();
    });
    // }}}
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

    if (numcall % 2 == 0) {
	$("object").css({ border: "0px solid" });
    } else {
	$("object").css({ border: "none" });
    }
}
// }}}

// {{{ register events
$(document).ready(function() {
    // replace content
    replaceEmailRefs();
    replaceInteractiveContent();

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
});
// }}}
    
/* vim:set ft=javascript sw=4 sts=4 fdm=marker : */

