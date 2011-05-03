<?php
    require_once("lib_getimage.php");

    if (false && is_callable("apache_request_headers")) {
        $headers = apache_request_headers();
        
        // @todo add not-modified header, dependig on mtime
        if (preg_match("/^max-age=[123456789]+/", $headers["Cache-Control"]) == 1) {
            header("HTTP/1.1 304 Not Modified");
            die();
        }
    }
    $img = new getimage($_GET['src']);
    if ($_GET['iphone'] == "true") {
        // get iphone optimized version
        $img->getIPhone($_GET['src']);
    } elseif (preg_match("/^([X0123456789]+)x([X0123456789]+)$/", $_GET['resize'], $matches)) {
        // get resized image
        $img->getResized($_GET['src'], $matches[1], $matches[2]);
    } else if (preg_match("/^([X0123456789]+)x([X0123456789]+)$/", $_GET['thumb'], $matches)) {
        // get thumbnail image
        $img->getThumb($_GET['src'], $matches[1], $matches[2]);
    }

/* vim:set ft=php sw=4 sts=4 fdm=marker : */
?>
