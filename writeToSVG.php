<?php
// if (!isset($_POST['newText'])) {
//     echo "❌ No text provided!";
//     exit;
// }

$clave = $_POST['clave'];           // 件

$newText = $_POST['divContent'];    // bla bla <span class='a'>bla</span>
$newText = html_entity_decode($newText);
$newText = str_replace('<span', '<tspan', $newText);
$newText = str_replace('/span>', '/tspan>', $newText);
$newText = str_replace('<div>', '<tspan x="0" dy="20">', $newText);
$newText = str_replace('</div>', '</tspan>', $newText);
// file_put_contents("media/output.txt", $newText);        // en TXT < y > salen OK
echo "Para: ".$clave." grabando: ".$newText;

// modificar el SVG como si fuera TXT usando linea 15
// $filePath = 'media/moldeMOD.svg'; // Replace with your actual file path
// $lines = file($filePath, FILE_IGNORE_NEW_LINES);
// $lines[14] = $newText;                                  // Line 15 es del texto deseado
// file_put_contents($filePath, implode(PHP_EOL, $lines)); // Write back to file

// $newText = urldecode($newText);

// Load the SVG file
$doc = new DOMDocument();
$doc->load("media/".$clave.".svg");
$doc->preserveWhiteSpace = false;
$doc->formatOutput = true;

// Register namespace for XPath
$xpath = new DOMXPath($doc);
// $xpath->registerNamespace("svg", "http://www.w3.org/2000/svg");

$nodes = $xpath->query('//*[@id="monogatari"]');    // Find element with id="monogatari"

if ($nodes->length > 0) {
    $node = $nodes->item(0);

    while ($node->firstChild) {                         // Remove old text content
        $node->removeChild($node->firstChild);
    }

    // Insert new mixed content (text + <tspan>)
    $frag = $doc->createDocumentFragment();
    // $frag->appendXML('abc <tspan>jejeje</tspan> final');
    $frag->appendXML($newText);
    $node->appendChild($frag); // Add new text content
}

// Save modified SVG
$doc->save("media/".$clave.".svg");

// Return response to JavaScript
echo "<br>";
echo "✅ SVG updated! <br>";
echo "<a href='media/".$clave.".svg' target='_blank'>Open modified SVG</a>";
?>
