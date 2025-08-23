<?php
    $clave = $_POST['clave2'];           // 件

    // Ensure internal encoding is UTF-8
    setlocale(LC_ALL, 'en_US.UTF-8'); // or 'ja_JP.UTF-8' if available
    mb_internal_encoding("UTF-8");

    // Paths with Japanese characters
    $svgPath = "media/".$clave.".svg";
    $jpgPath = 'media/0.jpg'; // Replace with your actual JPG path

    // Load SVG
    $dom = new DOMDocument();
    // $dom->load($svgPath, LIBXML_NOENT | LIBXML_NOCDATA);
    $dom->load($svgPath);

    // Find <image id="fotico">
    $imageElement = null;
    foreach ($dom->getElementsByTagName('image') as $img) {
            $imageElement = $img;
            break;
    }

    if ($imageElement) {
        // Read JPG and encode as base64
        $jpgData = file_get_contents($jpgPath);
        $base64 = base64_encode($jpgData);
        $mimeType = 'image/jpeg';
        $dataUri = "data:$mimeType;base64,$base64";

        // Replace href or xlink:href
        if ($imageElement->hasAttribute('xlink:href')) {
            $imageElement->setAttribute('xlink:href', $dataUri);
        } else {
            $imageElement->setAttribute('href', $dataUri);
        }

        // Save updated SVG (you can overwrite or save as new)
        $dom->save($svgPath);
        echo "✅ SVG updated successfully.";
    } else {
        echo "⚠️ No <image id='fotico'> found in SVG.";
    }
?>