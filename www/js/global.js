/**
 * @file    js/global.js
 *
 * copyright (c) 2006 Frank Hellenkamp [jonas@depagecms.net]
 *
 * @author    Frank Hellenkamp [jonas@depagecms.net]
 */

// {{{ global variables
var js;
var isIE  = (navigator.appVersion.indexOf("MSIE") != -1) ? true : false;
var isWin = (navigator.appVersion.toLowerCase().indexOf("win") != -1) ? true : false;
var isOpera = (navigator.userAgent.indexOf("Opera") != -1) ? true : false;
var fsVersion;
// }}}

// global helpers
// {{{ registerEventHandler()
function registerEventHandler(element, name, func) {
    if (typeof element.addEventListener != 'undefined') {
    element.addEventListener(name, func, false);
    } else if (element == window && typeof document.addEventListener != 'undefined') {
    document.addEventListener(name, func, false);
    } else if (typeof element.attachEvent != 'undefined') {
    element.attachEvent('on' + name, func);
    }
}
// }}}
// {{{ includeJs()
function includeJs(file, js_loaded) {
    var header = document.getElementsByTagName('head')[0];
    js = document.createElement('script');
    js.setAttribute('type', 'text/javascript');
    js.setAttribute('src', file);
    header.appendChild(js);

    /*
    js.onreadystatechange = function () {
        if (js.readyState == 'complete') {
        js_loaded();
        }
    }
    */

    registerEventHandler(js, "load", js_loaded);

    return false;
}
// }}}
// {{{ createCSS()
function createCSS(selector, value) {
    var header = document.getElementsByTagName("head")[0];

    istyle = document.createElement("style");
    istyle.setAttribute("type", "text/css");
    istyle.setAttribute("media", "screen");

    if (!isIE) istyle.appendChild(document.createTextNode(selector + " {" + value + "}"));

    header.appendChild(istyle);
    if (isIE && !isOpera && document.styleSheets && document.styleSheets.length > 0) {
	var styles = document.styleSheets[document.styleSheets.length - 1];
	if (typeof styles.addRule == "object") styles.addRule(selector, value);
    }
}
// }}}

// javascript flash detection
// {{{ fsControlVersion()
function fsControlVersion() {
    var version;
    var axo;
    var e;

    try {
        // version will be set for 7.X or greater players
        axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
        version = axo.GetVariable("$version");
    } catch (e) {
    }
    if (!version) {
        try {
            // version will be set for 6.X players only
            axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
            
            // installed player is some revision of 6.0
            // GetVariable("$version") crashes for versions 6.0.22 through 6.0.29,
            // so we have to be careful. 
            
            // default to the first public version
            version = "WIN 6,0,21,0";

            // throws if AllowScripAccess does not exist (introduced in 6.0r47)        
            axo.AllowScriptAccess = "always";

            // safe to call for 6.0r47 or greater
            version = axo.GetVariable("$version");

        } catch (e) {
        }
    }
    if (!version) {
        try {
            // version will be set for 4.X or 5.X player
            axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
            version = axo.GetVariable("$version");
        } catch (e) {
        }
    }
    if (!version) {
        try {
            // version will be set for 3.X player
            axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
            version = "WIN 3,0,18,0";
        } catch (e) {
        }
    }
    if (!version) {
        try {
            // version will be set for 2.X player
            axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
            version = "WIN 2,0,0,11";
        } catch (e) {
            version = -1;
        }
    }
    
    return version;
}
// }}}
// {{{ fsGetVer()
function fsGetVer(){
    if (fsVersion != undefined) {
	return fsVersion;
    }
    // JavaScript helper required to detect Flash Player PlugIn version information
    // NS/Opera version >= 3 check for Flash plugin in plugin array
    var fsVersion = -1;
    
    if (navigator.plugins != null && navigator.plugins.length > 0) {
        if (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]) {
            var swVer2 = navigator.plugins["Shockwave Flash 2.0"] ? " 2.0" : "";
            var flashDescription = navigator.plugins["Shockwave Flash" + swVer2].description;            
            var descArray = flashDescription.split(" ");
            var tempArrayMajor = descArray[2].split(".");
            var versionMajor = tempArrayMajor[0];
            var versionMinor = tempArrayMajor[1];
            if ( descArray[3] != "" ) {
                tempArrayMinor = descArray[3].split("r");
            } else {
                tempArrayMinor = descArray[4].split("r");
            }
            var versionRevision = tempArrayMinor[1] > 0 ? tempArrayMinor[1] : 0;
            var fsVersion = versionMajor + "." + versionMinor + "." + versionRevision;
        }
    }
    // MSN/WebTV 2.6 supports Flash 4
    else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.6") != -1) fsVersion = 4;
    // WebTV 2.5 supports Flash 3
    else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.5") != -1) fsVersion = 3;
    // older WebTV supports Flash 2
    else if (navigator.userAgent.toLowerCase().indexOf("webtv") != -1) fsVersion = 2;
    else if ( isIE && isWin && !isOpera ) {
        fsVersion = fsControlVersion();
    }    
    return fsVersion;
}
// }}}
// {{{ fsHasFlashVer()
function fsHasFlashVer(reqMajorVer, reqMinorVer, reqRevision) {
    // When called with reqMajorVer, reqMinorVer, reqRevision returns true if that version or greater is available
    fsVersionStr = fsGetVer();
    if (fsVersionStr == -1 ) {
        return false;
    } else if (fsVersionStr != 0) {
        if(isIE && isWin && !isOpera) {
            // Given "WIN 2,0,0,11"
            tempArray         = fsVersionStr.split(" ");     // ["WIN", "2,0,0,11"]
            tempString        = tempArray[1];            // "2,0,0,11"
            versionArray      = tempString.split(",");    // ['2', '0', '0', '11']
        } else {
            versionArray      = fsVersionStr.split(".");
        }
        var versionMajor      = versionArray[0];
        var versionMinor      = versionArray[1];
        var versionRevision   = versionArray[2];

	// is the major.revision >= requested major.revision AND the minor version >= requested minor
        if (versionMajor > parseFloat(reqMajorVer)) {
            return true;
        } else if (versionMajor == parseFloat(reqMajorVer)) {
            if (versionMinor > parseFloat(reqMinorVer)) {
                return true;
            } else if (versionMinor == parseFloat(reqMinorVer)) {
                if (versionRevision >= parseFloat(reqRevision)) {
                    return true;
		}
            }
        }
        return false;
    }
}
// }}}

// replace content, depending on reader capabilities
// {{{ replaceEmailChars()
function replaceEmailChars(mail) {
    mail = unescape(mail);
    mail = mail.replace(/ \*at\* /, "@");
    mail = mail.replace(/ \*dot\* /, ".");
    mail = mail.replace(/ \*punkt\* /, ".");
    mail = mail.replace(/ \*underscore\* /, "_");
    mail = mail.replace(/ \*unterstrich\* /, "_");
    mail = mail.replace(/ \*minus\* /, "-");
    mail = mail.replace(/mailto: /, "mailto:");

    return mail;
}
// }}}
// {{{ replaceEmailRefs()
function replaceEmailRefs() {
    ref = document.getElementsByTagName("a");
    for (i = 0; i < ref.length; i++) {
	if (ref[i].href.indexOf("mailto:") == 0) {
	    ref[i].href = replaceEmailChars(ref[i].href);
	    if (ref[i].firstChild.data.indexOf(" *at* ") > 0) {
		ref[i].firstChild.data = replaceEmailChars(ref[i].firstChild.data);
	    }
	}
    }
}
// }}}
// {{{ replaceFlashContent()
function replaceFlashContent() {
    imgs = document.getElementsByTagName("img");
    if (fsHasFlashVer(6, 0, 0)) {
	for (i = imgs.length - 1; i >= 0; i--) {
	    if (imgs[i].getAttribute("class") == "flashrepl" || imgs[i].className == "flashrepl") {
		var iparent = imgs[i].parentNode;
		var isrc = imgs[i].src.substring(0, imgs[i].src.length - 4) + '.swf';
		var iwidth = imgs[i].width;
		var iheight = imgs[i].height;
		var ilt = imgs[i].getAttribute("alt");
		var ihtml = iparent.innerHTML;

		// generate flash element
		iparent.innerHTML = "<object type=\"application/x-shockwave-flash\" data=\"" + isrc + "\" width=\"" + iwidth + "\" height=\"" + iheight + "\" wmode=\"transparent\" class=\"flash\"><param name=\"movie\" value=\"" + isrc + "\" /><param name=\"wmode\" value=\"transparent\" /></object>" + ihtml;
	    }
	}
	createCSS("img.flashrepl", "display: none;");
    }
}
// }}}
// {{{ hideNonFlashContent()
function hideNonFlashContent() {
    if (fsHasFlashVer(6, 0, 0)) {
	createCSS("img.flashrepl", "visibility: hidden;");
    }
}
// }}}

// register onload actions
//registerEventHandler(window, "load", hideNonFlashContent);
registerEventHandler(window, "load", replaceEmailRefs);
registerEventHandler(window, "load", replaceFlashContent);
hideNonFlashContent();
    
/* vim:set ft=javascript sw=4 sts=4 fdm=marker : */
