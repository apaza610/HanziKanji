<link rel="stylesheet" href="estilo.css">
<?php
    // Set UTF-8 locale for multibyte safety
    setlocale(LC_ALL, 'en_US.UTF-8'); // or 'ja_JP.UTF-8' if needed

    $claves = [trim($_POST['clave1']), trim($_POST['clave2']), trim($_POST['clave3'])];
                                    // tradicional       shinjitaiJP      simplificado
    $cadena = implode($claves);

    $newText = $_POST['divContent'];    // bla bla <span class='a'>bla</span>
    $newText = html_entity_decode($newText);
    $newText = str_replace('<br>', '', $newText);               // svg doesnt understand br
    $newText = str_replace('<span', '<tspan', $newText);
    $newText = str_replace('/span>', '/tspan>', $newText);
    $newText = str_replace('<div>', '<tspan x="0" dy="22">', $newText);
    $newText = str_replace('</div>', '</tspan>', $newText);
    // file_put_contents("media/output.txt", $newText);        // en TXT < y > salen OK
    // echo "Para: ".$clave." grabando: ".$newText;
    echo "Working on: " . $cadena . "<br>";

    foreach(mb_str_split($cadena) as $char){
        $nuevoSVG = "media/".$char. ".svg";
        echo "<br> para: " . $nuevoSVG;
        copy("media/0.svg", $nuevoSVG);

        $content = file_get_contents($nuevoSVG);
        $newContent = str_replace('0.jpg', $char . '.jpg', $content);
        file_put_contents($nuevoSVG, $newContent);
        
        grabarMnemonico($nuevoSVG, $newText);
        colocarHanziKanji($nuevoSVG, $claves);
    }
    echo "<br>Operacion terminada...";
    
    // modificar el SVG como si fuera TXT usando linea 15
    // $filePath = 'media/moldeMOD.svg'; // Replace with your actual file path
    // $lines = file($filePath, FILE_IGNORE_NEW_LINES);
    // $lines[14] = $newText;                                  // Line 15 es del texto deseado
    // file_put_contents($filePath, implode(PHP_EOL, $lines)); // Write back to file

    // $newText = urldecode($newText);  

    function grabarMnemonico($tempSVG, $newText){       // media/發.svg ... "bla bla bla"
        // Load the SVG file
        $doc = new DOMDocument();
        $doc->load($tempSVG);
        // $doc->preserveWhiteSpace = false;
        // $doc->formatOutput = true;

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
        $doc->save($tempSVG);

        // Return response to JavaScript
        echo "<br>";
        echo "✅ SVG updated! <br>";
        echo "<a href='".$tempSVG."' target='_blank'>Open modified SVG</a>";
    }

    function colocarHanziKanji($nuevoSVG, $claves){
        $doc = new DOMDocument();   // Load the SVG file
        $doc->load($nuevoSVG); // put your SVG filename here

        // Use XPath to find the <tspan> with id="simpli"
        $xpath = new DOMXPath($doc);
        
        $nodes = $xpath->query("//*[@id='tradi']");
        if ($nodes->length > 0) {
            $tspan = $nodes->item(0);
            $tspan->nodeValue = $claves[0]; // replace text
        } 
        $nodes = $xpath->query("//*[@id='shinji']");
        if ($nodes->length > 0) {
            $tspan = $nodes->item(0);
            $tspan->nodeValue = $claves[1]; // replace text
        } 
        $nodes = $xpath->query("//*[@id='simpli']");
        if ($nodes->length > 0) {
            $tspan = $nodes->item(0);
            $tspan->nodeValue = $claves[2]; // replace text
        } 
        $doc->save($nuevoSVG);  
    }
?>
