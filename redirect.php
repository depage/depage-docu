<?php
    $url = "Docs/html/index.html";
    header('Location: ' . $url);
    die("Tried to redirect you to <a href=\"$url\">$url</a>");
