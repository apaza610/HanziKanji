import os
import subprocess

def is_image(filename):
    return filename.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.gif', '.tiff', '.webp', '.tga'))

def main():
    folder = input("Enter the full folder path: ").strip('"')
    if not os.path.isdir(folder):
        print("Invalid folder path.")
        return

    suffix = input("Enter a suffix filter (e.g., '_N'), or press Enter to skip: ").strip()

    print("\nProcessing matching image files:")
    for file in os.listdir(folder):
        if is_image(file):
            name, ext = os.path.splitext(file)
            if suffix:
                if not name.endswith(suffix):
                    continue
                base_name = name[:-len(suffix)]  # Remove the suffix
                output_name = f"{base_name}_NDX{ext}"
            else:
                output_name = f"{name}_NDX{ext}"

            print(f"  {file} → {output_name}")
            input_path = os.path.join(folder, file)
            output_path = os.path.join(folder, output_name)

            subprocess.run([
                "magick", input_path,
                "-channel", "G", "-negate",
                output_path
            ])

if __name__ == "__main__":
    main()
