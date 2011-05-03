<?php 
/**
 * @file    lib_getimage.php
 *
 * File System Library
 *
 * This file defines Classes for accessing different file
 * system like the lokal file system or an ftp filesystem
 * with same function calls.
 *
 *
 * copyright (c) 2007-2008 Frank Hellenkamp [jonas@depagecms.net]
 *
 * @author    Frank Hellenkamp [jonas@depagecms.net]
 */

class getimage {
    var $imgObject;
    var $src;

    // {{{ getImage
    function getImage($src = "") {
        if ($src != "") {
            $this->openImage($src);
        }
    }
    // }}}
    // {{{ openImage()
    function openImage($src) {
        $this->src = $src;
        if (file_exists($this->src)) {
            if (($sourceImgInfo = @getimagesize($this->src)) != null && $sourceImgInfo[2] < 9 && $sourceImgInfo[2] != 4) {
                $this->filesize = filesize($this->src);
                $this->filemtime = filemtime($this->src);
                
                $this->type = $sourceImgInfo[2];
                $this->mime = $sourceImgInfo['mime'];
                
                if ($this->type == 1 && function_exists('imagecreatefromgif')) {
                    //GIF
                    $this->imgObject = imagecreatefromgif($this->src);
                } else if ($this->type == 2) {
                    //JPEG
                    $this->imgObject = imagecreatefromjpeg($this->src);
                } else if ($this->type == 3) {
                    //PNG
                    $this->imgObject = imagecreatefrompng($this->src);
                } else if (($this->type == 1 || $this->type > 4) && $conf->path_imageMagick != "" && file_exists($conf->path_imageMagick . "/convert" . ($_ENV["OS"] == "Windows_NT" ? ".exe" : ""))) {
                    $sourceImgTmpPath = tempnam("", "img");
                    if ($this->type == 1) {
                        //GIF
                        exec($conf->path_imageMagick . "/convert -geometry \"" . $conf->thumb_width . "x" . $conf->thumb_height . ">\" GIF:" . $this->src . "[0] PNG:" . $sourceImgTmpPath);
                    } else if ($this->type == 5) {
                        //PSD
                        exec($conf->path_imageMagick . "/convert -geometry \"" . $conf->thumb_width . "x" . $conf->thumb_height . ">\" PSD:" . $this->src . " PNG:" . $sourceImgTmpPath);
                    } else if ($this->type == 6) {
                        //BMP
                        exec($conf->path_imageMagick . "/convert -geometry \"" . $conf->thumb_width . "x" . $conf->thumb_height . ">\" BMP:" . $this->src . " PNG:" . $sourceImgTmpPath);
                    } else if ($this->type == 7 || $this->type == 8) {
                        //TIF
                        exec($conf->path_imageMagick . "/convert -geometry \"" . $conf->thumb_width . "x" . $conf->thumb_height . ">\" TIFF:" . $this->src . " PNG:" . $sourceImgTmpPath);
                    }
                    if (file_exists($sourceImgTmpPath)) {
                        $this->imgObject = imagecreatefrompng($sourceImgTmpPath);
                        unlink($sourceImgTmpPath);
                    }
                }
                $this->width = imagesx($this->imgObject);
                $this->height = imagesy($this->imgObject);
            }
        }
    }
    // }}}
    // {{{ getResized()
    function getResized($imagePath = '', $destWidth, $destHeight) {
        $imgCache = "{$imagePath}.resize_{$destWidth}x{$destHeight}";

        if (!file_exists($imgCache)) {
            if ($this->type < 9 && $this->type != 4) {

                if ($destHeight == "X") {
                    $destHeight = ($this->height / $this->width) * $destWidth ;
                } elseif ($destWidth == "X") {
                    $destWidth = ($this->width / $this->height) * $destHeight ;
                }
                
                if ($destHeight == $this->height && $destWidth == $this->width) {
                    copy($imagePath, $imgCache);
                } else {
                    $destImg = imagecreatetruecolor($destWidth, $destHeight);
                    
                    imagecopyresampled ($destImg, $this->imgObject, 0, 0, 0, 0, $destWidth, $destHeight, $this->width, $this->height);
                    
                    if ($this->type == 1 && function_exists('imagegif')) {
                        //GIF
                        imagegif($destImg, $imgCache);
                    } else if ($this->type == 2) {
                        //JPEG
                        imagejpeg($destImg, $imgCache);
                    } else if ($this->type == 3) {
                        //PNG
                        imagepng($destImg, $imgCache);
                    }
                }
            }
        }
        header("Content-type: {$this->mime}");
        readfile($imgCache);
    }
    // }}}
    // {{{ getIPhone()
    function getIPhone($imagePath = '') {
        $imgCache = "{$imagePath}.iphone";
        $destHeight = "X";
        $destWidth = "440";

        if (!file_exists($imgCache)) {
            if ($this->type < 9 && $this->type != 4) {

                if ($this->width > $destWidth) {
                    if ($destHeight == "X") {
                        $destHeight = ($this->height / $this->width) * $destWidth ;
                    } elseif ($destWidth == "X") {
                        $destWidth = ($this->width / $this->height) * $destHeight ;
                    }
                    
                    if ($destHeight == $this->height && $destWidth == $this->width) {
                        copy($imagePath, $imgCache);
                    } else {
                        $destImg = imagecreatetruecolor($destWidth, $destHeight);
                        
                        imagecopyresampled ($destImg, $this->imgObject, 0, 0, 0, 0, $destWidth, $destHeight, $this->width, $this->height);
                        
                        if ($this->type == 1 && function_exists('imagegif')) {
                            //GIF
                            imagegif($destImg, $imgCache);
                        } else if ($this->type == 2) {
                            //JPEG
                            imagejpeg($destImg, $imgCache);
                        } else if ($this->type == 3) {
                            //PNG
                            imagepng($destImg, $imgCache);
                        }
                    }
                } else {
                    copy($imagePath, $imgCache);
                }
            }
        }
        header("Content-type: {$this->mime}");
        readfile($imgCache);
    }
    // }}}
    // {{{ getThumb()
    function getThumb($imagePath = '', $destWidth, $destHeight) {
        if ($_GET["type"] == "png") {
            $transparency = true;
        } else {
            $transparency = false;
        }
        $imgCache = "{$imagePath}.thumb_{$destWidth}x{$destHeight}";

        if (!file_exists($imgCache)) {
            if ($this->type < 9 && $this->type != 4) {

                if ($destHeight / $destWidth > $this->height / $this->width) {
                    // 200 / 200 > 600 / 800 = 0.75
                    // yes
                    $copyHeight = $this->height;
                    $copyWidth = $this->height / ($destWidth / $destHeight);
                    $copyX = ($this->width - $copyWidth) / 2;
                    $copyY = 0;
                } else {
                    $copyHeight = $this->width / ($destHeight / $destWidth);
                    $copyWidth = $this->width;
                    $copyX = 0;
                    $copyY = ($this->height - $copyHeight) / 2;
                }
                
                $destImg = imagecreatetruecolor($destWidth, $destHeight);
                
                if ($transparency) {
                    $transLen = 8;
                    $transColor = array();
                    $transColor[0] = imagecolorallocate ($destImg, 255, 255, 255);
                    $transColor[1] = imagecolorallocate ($destImg, 230, 230, 230);
                    for ($i = 0; $i * $transLen < $destWidth; $i++) {
                        for ($j = 0; $j * $transLen < $destHeight; $j++) {
                            imagefilledrectangle($destImg, $i * $transLen, $j * $transLen, ($i + 1) * $transLen, ($j + 1) * $transLen, $transColor[$j % 2 == 0 ? $i % 2 : ($i % 2 == 0 ? 1 : 0)]);
                        }
                    }
                }

                imagecopyresampled ($destImg, $this->imgObject, 0, 0, $copyX, $copyY, $destWidth, $destHeight, $copyWidth, $copyHeight);
                
                if ($_GET["type"] == "png") {
                    //PNG
                    imagepng($destImg, $imgCache);
                } else {
                    //JPEG
                    imagejpeg($destImg, $imgCache, 50);
                }
            }
        }
        if ($_GET["type"] == "png") {
            header("Content-type: image/png");
        } else {
            header("Content-type: image/jpeg");
        }
        readfile($imgCache);
    }
    // }}}
}

/* vim:set ft=php sw=4 sts=4 fdm=marker : */
?>
