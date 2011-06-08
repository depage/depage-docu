#!/usr/bin/env php
<?php
    require(__DIR__ . "/lib/markdown.php");

    if (count($argv) < 2) {
        echo("no input or output specified\n");
        die();
    }

    $source = $argv[1];
    $target = $argv[2];

    echo("converting......");
    $markdown = file_get_contents($source);
    $html = Markdown($markdown);
    file_put_contents($target, $html);
    echo("finished.\n");

