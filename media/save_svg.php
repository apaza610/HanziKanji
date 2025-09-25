<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['svgCode'])) {
        $code = $_POST['svgCode'];
        $glifos = $_POST['glifos'];         // 遲遅迟

        for ($i = 0; $i < mb_strlen($glifos, 'UTF-8'); $i++) {
            $char = mb_substr($glifos, $i, 1, 'UTF-8');
            // echo $char . "\n";
            $filename = __DIR__ . "/".$char.".svg";
    
            if (file_put_contents($filename, $code) !== false) {
                echo "✅ File saved successfully as ".$char.".svg";
                echo "<br>";
            } else {
                echo "❌ Error: could not save file.";
            }
        }

    } else {
        echo "❌ No SVG code received.";
    }
} else {
    echo "❌ Invalid request.";
}
?>
