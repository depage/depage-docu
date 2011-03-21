<?php
    function based_rand($min, $max) {
        $t_max = $max - $min + 1;

        $n = mt_rand(0, pow($t_max, 2));
        $n = (int) sqrt($n) + $min;
        
        if ($n < $min) {
            $n = $min;
        } else if ($n > $max) {
            $n = $max;
        }

        return $max - $n + 1;
    }

$testarray = array();

for ($i = 0; $i < 10000; $i++) {
    $testarray[based_rand(1, 7)]++;
}

for ($i = 0; $i <= 10; $i++) {
    echo("$i: {$testarray[$i]}<br>");
}

