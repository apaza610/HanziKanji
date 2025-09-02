<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['svgCode'])) {
        $code = $_POST['svgCode'];

        $filename = __DIR__ . "/".$_POST['valor'].".svg";

        if (file_put_contents($filename, $code) !== false) {
            echo "✅ File saved successfully as ".$_POST['valor'].".svg";
        } else {
            echo "❌ Error: could not save file.";
        }
    } else {
        echo "❌ No SVG code received.";
    }
} else {
    echo "❌ Invalid request.";
}
?>
