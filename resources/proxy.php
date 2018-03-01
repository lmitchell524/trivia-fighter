<?php
    $url = filter_var($_POST['url'], FILTER_VALIDATE_URL);

    if(empty($url)){
        exit(400);
    };

    if (strpos($url, 'http://superheroapi.com/api.php') === 0) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HEADER, 'Access-Control-Allow-Origin: *');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $return = curl_exec($ch);
        echo $return;
    }
?>
