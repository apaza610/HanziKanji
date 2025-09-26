<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="estilo.css">
  <title>HanziConvert</title>
</head>
<body>
<?php
// Habilitar la notificación de errores para depuración
error_reporting(E_ALL);
ini_set('display_errors', 1);
mb_internal_encoding('UTF-8');

$target_dir = "media/";
$target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
$uploadOk = 1;
$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));

// Check if image file is a actual image or fake image
if(isset($_POST["submit"])) {
  $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
  if($check !== false) {
    echo "File SI es imagen - " . $check["mime"] . ".";
    $uploadOk = 1;
  } else {
    echo "File NO es imagen.";
    $uploadOk = 0;
  }
}

// Allow certain file formats
if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif" ) {
  echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
  $uploadOk = 0;
}

// Check if $uploadOk is set to 0 by an error
if ($uploadOk == 0) {
  echo "Sorry, your file was NOT uploaded.";
// if everything is ok, try to upload file
} else {
  if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
    echo "<br>The file ". htmlspecialchars( basename( $_FILES["fileToUpload"]["name"])). " has been uploaded.";
  } else {
    echo "Sorry, hubo error uploading your file.";
  }
}

$salida = $target_dir .$_POST['union'].'.jpg';
convertAndResize($target_file, $salida);
echo "✅ conversion ha terminado, comenzando Duplicacion...";

foreach(mb_str_split($_POST['union']) as $char){
  echo "<br> para ... " . $char;
  copy($salida, $target_dir . $char . ".jpg");
}

if (mb_strlen($_POST['union']) > 1) {
    if(unlink($salida)){    // borrando imagen vieja
      echo "<br>File duplicated and original deleted";
    }else{
      echo "<br>error deleting original file";
    }
}

// convirtiendo imagenes a .jpg
function convertAndResize($inputFile, $outputFile) {
    echo "<br>--------------de: " . $inputFile . " a: " . $outputFile . "--------------";
    
    if (!file_exists($inputFile)) {
        echo "<br>ERROR: El archivo de entrada no existe: " . $inputFile;
        return;
    }

    try {
        $imagick = new Imagick($inputFile);
    } catch (ImagickException $e) {
        echo "<br>Error al leer la imagen de entrada: " . $e->getMessage();
        return;
    }

    $imagick = $imagick->flattenImages();   // flatten layers of PSDs or PNPGs with transparency

    // Crop & resize to fill 512x512 (preserve aspect ratio, center crop)
    $imagick->scaleImage(512, 512, true);     // true = best fit (maintain ratio)
    $imagick->cropThumbnailImage(512, 512);   // center crop to exact size

    $imagick->setImageFormat("jpg");        // Set format and quality
    $imagick->setImageCompressionQuality(85);

    try {
        $success = $imagick->writeImage($outputFile);   // write to file
    } catch (ImagickException $e) {
        echo "<br>Error al escribir la imagen: " . $e->getMessage();
        $success = false;
    }

    if ($success) {
        echo "<br>writeImage() tuvo exito.";
        if (file_exists($outputFile)) {
            echo "<br>El archivo de salida existe: " . $outputFile;
            if (file_exists($inputFile)) {
                unlink($inputFile);           // delete original file
                echo "<br>Archivo original eliminado: " . $inputFile;
            } else {
                echo "<br>No se encontro el archivo original para eliminar: " . $inputFile;
            }
        } else {
            echo "<br>ERROR: El archivo de salida NO existe despues de writeImage(): " . $outputFile;
        }
    } else {
        echo "<br>ERROR: writeImage() fallo.";
    }

    $imagick->clear();        // clean up
    $imagick->destroy();
    echo "<br>Conversion ha TERMINADO !!";
}

?>

</body>
</html>