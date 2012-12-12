<?php 
    $tt_lang = "de";
    $page_id = "1";
    @header('Content-type: text/html; charset=UTF-8');

?><!DOCTYPE html >
<html>
    <!-- {{{ header -->
    <head>
	<title>depage::cms comments</title>
        <link rel="stylesheet" type="text/css" href="lib/global/htmlform/css/depage-forms.css">
	<link rel="stylesheet" type="text/css" href="lib/global/css/global.css" />
	<link rel="stylesheet" type="text/css" href="lib/global/css/colors.css" />
	<link rel="stylesheet" type="text/css" media="print" href="lib/global/css/print.css" />
        <!--[if !IE]> --><link rel="stylesheet" type="text/css" media="only screen and (max-device-width: 480px)" href="lib/global/css/mobile.css" /><!--<![endif]-->

	<script type="text/javascript" src="lib/global/js/jquery-1.8.3.min.js"></script>
        <script type="text/javascript" src="lib/global/htmlform/js/jquery.tools.min.js"></script>
        <script type="text/javascript" src="lib/global/htmlform/js/effect.js"></script>
        <script type="text/javascript" src="lib/global/comments/js/comments.js"></script>
	<script type="text/javascript" src="lib/global/js/global.js"></script>
        <!--[if lt IE 9]><script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script><script>!window.html5 && document.write('<script src="../lib/global/js/html5.js"><\/script>')</script><![endif]-->

        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">

	<meta name="robots" content="index,follow" />
	<meta name="revisit-after" content="1 day" />

	<meta name="description" content="depage::cms ist ein flexibles und erweiterbares Redaktionssystem zur Erstellung von barrierefreien Online-Inhalten." />
	<meta name="author" content="Frank Hellenkamp" />
	<meta name="generator" content="depage::cms" />
	<meta name="Content-Language" content="de" />
	<meta name="keywords" content="Content Management, Content Management System, CMS, contentmanagement, content, management, Redaktionssystem, Redaktionssysteme, web, publishing, usability, accessibility, Webdesign, Design, Interface Design, PHP, Mysql, Apache, Flash, Open Source, opensource, barrierefrei, Barrierefreiheit, BITV" />
    </head>
    <!-- }}} -->
    <body>
	<div id="contentcontainer">
	    <!-- {{{ header -->
	    <div id="header">
		<div id="corner_tl"></div>
		<div id="corner_tr"></div>
		<div id="middle"><a href="#navigation" class="hidden">Zur Navigation springen</a></div>
                <div id="crosslinks">
                    <ul class="left">
                        <li><a href="http://www.depage.net" class="active">depage.net</a></li>
                    </ul>
                    <ul class="right">
                        <li><a href="http://www.depagecms.net">powered by depagecms</a></li>
                    </ul>
                </div>
	    </div>
	    <!-- }}} -->
	    <div id="content">
                <!-- {{{ blog topnav -->
                <ul class="topnav">
                    <li><a href="#">&laquo; vorheriger</a></li>
                    <li><a href="#">nächster &raquo;</a></li>
                </ul>
                <!-- }}} -->
		<!-- {{{ article -->
		<div class="article colorcyan">
                    <div class="section">
                        <img class="thumb" alt="test">
                        <time datetime="2009-05-09">09. Mai 2009</time>
                        <h1>Pop-Up-The-Bathroom</h1>
                        <h2>Trennung von Inhalten und der Darstellung</h2>
                        <p>Zur Erstellung der Inhalte auf einer Seite wird eine Anzahl von Eingabeelementen vorbereitet, die den Redakteuren zur Eingabe der Inhalte zur Verfügung stehen. Dies können ein oder auch mehrsprachige Felder für Text sein, in denen Funktionen zur Auszeichnung  und Formatierung zur Verfügung stehen. Dies können reine Textfelder ohne Auszeichnungen für Überschriften sein, oder Elemente zur Auswahl und Einbettung von Bildern und Multimediaelementen. Diese zusätzlichen Elemente wie Bilder, Animationen oder PDFs werden komfortabel in einer eigenen Dateibibliothek verwaltet.</p>

                    </div>
                    <div class="depage-comments" data-comments-url="lib/global/commentproxy.php?pageId=<?php echo($page_id); ?>&lang=<?php echo($tt_lang); ?>"></div>
		</div>
		<!-- }}} -->
                <!-- {{{ blog bottomnav -->
                <ul class="bottomnav">
                    <li><a href="#">&laquo; vorheriger</a></li>
                    <li><a href="#">nächster &raquo;</a></li>
                </ul>
                <!-- }}} -->
		<!-- {{{ navigation -->
		<div id="navigation" class="navigation_bright">
                    <div class="nav">
                        <h1 class="invisible">Navigation</h1>
                        <ul> 
                            <li><a href="index.html">home</a>
                                <ul> 
                                    <li><a href="structure.html">structure</a></li>
                                    <li><a href="edit.html">edit</a></li>
                                    <li><a href="preview.html">(p)review</a></li>
                                    <li><a href="publish.html">publish</a></li>
                                    <li><a href="depagecms.html">depage::cms</a></li>
                                </ul>
                            </li>
                        </ul>
                        <ul>
                            <li><a href="framework.html">Framework</a></li>
                            <li><a href="referenzen.html">Referenzen</a></li>
                            <li><a href="blog.html" class="active">Blog</a></li>
                            <li><a href="kontakt.html">Kontakt</a></li>
                        </ul>
                    </div>
                    <div class="autolinklist">
                        <h3>Links</h3>
                        <ul>
                            <li><a href="http://www.mysql.com">www.mysql.com</a></li>
                            <li><a href="http://www.php.net">www.php.net</a></li>
                            <li><a href="http://www.some-blog.net/langer-link-der-ueber-mehrere-zeilen-geht.html">www.some-blog.net/langer-link-der-ueber-mehrere-zeilen-geht.html</a></li>
                        </ul>
                    </div>
		</div>
		<!-- }}} -->
	    </div>
	    <!-- {{{ footer -->
	    <div id="footercontainer">
		<div id="footer">
                    <p><small>powered by <a href="http://www.depagecms.net">depage::cms</a></small></p>
		</div>
	    </div>
	    <!-- }}} -->
	</div>
    </body>
    <!-- vim:set ft=php sw=4 sts=4 fdm=marker : -->
</html>
