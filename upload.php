<?php

// Main entry point for the upload process.
// This function will orchestrate the validation, processing, and final output.
function handleImageUpload()
{
    // 1. Configuration
    $targetDir = "media/";
    $allowedFormats = ["jpg", "png", "jpeg", "gif"];

    // Use a try-catch block for clean error handling.
    try {
        // 2. Validate the upload
        if (empty($_FILES["fileToUpload"])) {
            throw new RuntimeException('No file was uploaded.');
        }
        $uploadedFile = $_FILES["fileToUpload"];
        $tempPath = validateUploadedFile($uploadedFile, $allowedFormats);

        // 3. Get the 'union' string for naming files.
        if (empty($_POST['union'])) {
            throw new RuntimeException('The "union" parameter is required.');
        }
        $union = $_POST['union'];
        mb_internal_encoding('UTF-8');

        // 4. Process the image: move, convert, and resize.
        $tempImageName = $targetDir . basename($uploadedFile["name"]);
        if (!move_uploaded_file($tempPath, $tempImageName)) {
            throw new RuntimeException('Failed to move uploaded file.');
        }

        $baseName = $targetDir . $union . '.jpg';
        processImage($tempImageName, $baseName);

        // 5. Duplicate files if needed and gather final paths.
        $finalImagePaths = duplicateAndCleanup($baseName, $union, $targetDir);

        // 6. Render the success response.
        renderSuccess($finalImagePaths);

    } catch (RuntimeException $e) {
        // Render an error response if anything goes wrong.
        renderError($e->getMessage());
    }
}

/**
 * Validates the uploaded file against a set of rules.
 *
 * @param array $file The $_FILES entry for the upload.
 * @param array $allowedFormats A list of allowed file extensions.
 * @return string The temporary path of the validated file.
 * @throws RuntimeException If the file is invalid.
 */
function validateUploadedFile(array $file, array $allowedFormats): string
{
    // Check for upload errors
    if ($file['error'] !== UPLOAD_ERR_OK) {
        throw new RuntimeException('File upload error: ' . $file['error']);
    }

    // Check if it's a real image
    $tempPath = $file['tmp_name'];
    if (!getimagesize($tempPath)) {
        throw new RuntimeException('File is not a valid image.');
    }

    // Check file format
    $imageFileType = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($imageFileType, $allowedFormats)) {
        throw new RuntimeException('Sorry, only ' . implode(', ', $allowedFormats) . ' files are allowed.');
    }

    return $tempPath;
}

/**
 * Converts, resizes, and saves the uploaded image.
 *
 * @param string $inputFile The path to the source image.
 * @param string $outputFile The path to save the processed image.
 * @throws ImagickException
 */
function processImage(string $inputFile, string $outputFile)
{
    if (!file_exists($inputFile)) {
        throw new RuntimeException('Input file for processing does not exist: ' . $inputFile);
    }

    $imagick = new Imagick($inputFile);
    $imagick->flattenImages();
    $imagick->scaleImage(512, 512, true);
    $imagick->cropThumbnailImage(512, 512);
    $imagick->setImageFormat("jpg");
    $imagick->setImageCompressionQuality(85);

    // Overwrite if exists
    if (file_exists($outputFile)) {
        unlink($outputFile);
    }

    if (!$imagick->writeImage($outputFile)) {
        throw new RuntimeException('Failed to write processed image to ' . $outputFile);
    }

    $imagick->clear();
    $imagick->destroy();

    // Delete the original temporary file
    if (file_exists($inputFile)) {
        unlink($inputFile);
    }
}

/**
 * Duplicates the processed image for each character in the union string.
 *
 * @param string $sourceImage The base image to copy from.
 * @param string $union The string of characters.
 * @param string $targetDir The directory to save the copies.
 * @return array A list of paths to the final created images.
 */
function duplicateAndCleanup(string $sourceImage, string $union, string $targetDir): array
{
    $finalImagePaths = [];
    $unionChars = mb_str_split($union);
    $isMultiChar = count($unionChars) > 1;

    if ($isMultiChar) {
        // For multiple characters, copy the source to each character's file.
        foreach ($unionChars as $char) {
            $destination = $targetDir . $char . '.jpg';
            if (copy($sourceImage, $destination)) {
                $finalImagePaths[] = $destination;
            }
        }
        // Delete the temporary composite source image.
        unlink($sourceImage);
    } else {
        // For a single character, the source image is the final image.
        $finalImagePaths[] = $sourceImage;
    }

    return $finalImagePaths;
}

/**
 * Renders a success HTML page with links to the created images.
 *
 * @param array $imagePaths List of paths to the final images.
 */
function renderSuccess(array $imagePaths)
{
    echo "<h2>Upload Successful!</h2>";
    if (empty($imagePaths)) {
        echo "<p>No images were created.</p>";
    } else {
        echo "<p>The following image(s) have been created:</p>";
        echo "<ul>";
        foreach ($imagePaths as $path) {
            echo "<li><a href='{$path}' target='_blank'>{$path}</a></li>";
        }
        echo "</ul>";
    }
}

/**
 * Renders an error HTML page.
 *
 * @param string $message The error message to display.
 */
function renderError(string $message)
{
    echo "<h2>Upload Failed</h2>";
    echo "<p style='color:red;'>" . htmlspecialchars($message) . "</p>";
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="estilo.css">
  <title>HanziConvert - Upload Status</title>
</head>
<body>
  <h1>Upload Status</h1>
  <?php handleImageUpload(); ?>
  <br>
  <a href="index.html">Upload another file</a>
</body>
</html>
