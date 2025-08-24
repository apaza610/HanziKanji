import os
import shutil

# Paths
jpg_folder = r"E:\misapps\web\HanziKanji\media"
template_svg = r"F:\paraJDown\aa\0.svg"

# Read template once
with open(template_svg, "r", encoding="utf-8") as f:
    template_content = f.read()

# Process each JPG
for filename in os.listdir(jpg_folder):
    if filename.lower().endswith(".jpg"):
        # Replace "0.jpg" with actual jpg filename
        new_svg_content = template_content.replace("0.jpg", filename)

        # New svg path (same folder as jpg, same base name)
        base_name = os.path.splitext(filename)[0]
        new_svg_path = os.path.join(jpg_folder, base_name + ".svg")

        # Write SVG
        with open(new_svg_path, "w", encoding="utf-8") as out:
            out.write(new_svg_content)

        print(f"Created: {new_svg_path}")
