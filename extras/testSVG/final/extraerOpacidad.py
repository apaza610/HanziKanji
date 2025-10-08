import os
import subprocess

# Supported image extensions
image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp', '.tga'}

# Ask user for folder path
folder_path = input("Enter the full path to the folder: ").strip()

# Ask user for suffix filter
suffix_filter = input("Enter the suffix filter (e.g., _D), or leave blank to list all images: ").strip()

# Check if the path exists and is a directory
if os.path.isdir(folder_path):
    files = os.listdir(folder_path)
    image_files = []

    for f in files:
        name, ext = os.path.splitext(f)
        ext = ext.lower()
        if ext in image_extensions:
            if suffix_filter:
                if name.endswith(suffix_filter):
                    image_files.append(f)
            else:
                image_files.append(f)

    if image_files:
        print("\nImages found:")
        for img in image_files:
            print(f"- {img}")

        print("\nExtracting alpha channels using ImageMagick...")

        for img in image_files:
            name, ext = os.path.splitext(img)
            input_path = os.path.join(folder_path, img)

            # Strip suffix if present
            base_name = name[:-len(suffix_filter)] if suffix_filter and name.endswith(suffix_filter) else name
            output_name = base_name + "_A" + ext
            output_path = os.path.join(folder_path, output_name)

            command = [
                "magick", input_path,
                "-alpha", "extract",
                output_path
            ]

            try:
                subprocess.run(command, check=True)
                print(f"✔ Alpha extracted: {output_name}")
            except subprocess.CalledProcessError as e:
                print(f"✖ Failed to extract alpha from {img}: {e}")
    else:
        print("No matching image files found.")
else:
    print("Invalid folder path. Please check and try again.")
