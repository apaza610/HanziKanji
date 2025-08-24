<?php
$svgFiles = glob("*.svg");

echo "<!DOCTYPE html><html><head><title>SVG Gallery</title>
<style>
  .svg-container {
    display: inline-block;
    margin: 10px;
    text-align: center;
  }
  object {
    width: 400px;
    height: 400px;
    border: 1px solid #ccc;
  }
</style>
<script>
function copyToClipboard(text) {
  console.log(text);
  navigator.clipboard.writeText(text).then(() => {
    alert('Copied: ' + text);
  }).catch(err => {
    alert('Failed to copy: ' + err);
  });
}
</script>

</head><body>";

echo "<h4>SVG Files in This Folder</h4>";

if (empty($svgFiles)) {
    echo "<p>No SVG files found.</p>";
} else {
    foreach ($svgFiles as $file) {
        echo "<div class='svg-container'>";
	      $nombre = str_replace('.svg','',$file); 
        echo "<p>$nombre</p>";
        echo "<object type='image/svg+xml' data='$file'></object>";
        echo "</div>";
    }
}

echo "</body></html>";
?>