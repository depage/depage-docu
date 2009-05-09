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
    // get language from content tag in header
    var lang = $("meta[name = 'Content-Language']")[0].content;

    // add click event for teaser
    $(".teaser").click( function() {
        document.location = $("a", this)[0].href;
    });
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

