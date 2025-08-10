<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="codigo/estilo.css">
    <title>Document</title>
</head>
<body>
    <input type="text" name="" id="">
    <input type="button" value="buscar">
    <hr>
    <?php 
        $listaSVGs = [];
        $ubicacion = "media";
        $iterador = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($ubicacion));

        foreach ($iterador as $fileInfo){
            if($fileInfo->isFile()){
                $nombre = $fileInfo->getPathname();
                if(preg_match('/\.svg$/i', $nombre)){
                    $listaSVGs[] = $nombre;
                    // echo '<img src="' . $nombre . '" title="' . $nombre . '">';
                    // echo '<img src="' . $nombre . '">';
                    $cadena = explode('.', $nombre)[0];
                    $cadena = explode('\\', $cadena)[1];
                    // echo sprintf("<ruby>%s<rt>%s</rt></ruby>",'<img src="' . $nombre . '">', $cadena);

                    $dom = new DOMDocument();
                    $dom->loadXML(file_get_contents($nombre));
                    $metadata = $dom->getElementsByTagName('metadata')->item(0);

                    $metadataContent = '';
                    if($metadata){
                        $metadataContent = $metadata->textContent;
                        // echo $metadataContent;
                    }else{
                        $metadataContent = '~';
                        // echo '...';
                    }
                    echo sprintf("<ruby>%s<rt>%s..%s</rt></ruby>",'<img src="' . $nombre . '">', $cadena ,$metadataContent);
                }
            }
        }

        // echo nl2br(print_r($listaSVGs, true));
        
    ?>
    
</body>
</html>