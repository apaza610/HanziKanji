import os
import re
import base64

def extract_jpg_from_svg(folder):
    # Regex to capture base64-encoded JPEGs inside SVGs
    jpg_pattern = re.compile(r'data:image/jpeg;base64,([A-Za-z0-9+/=]+)')

    for filename in os.listdir(folder):
        if filename.lower().endswith(".svg"):
            filepath = os.path.join(folder, filename)
            
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            
            matches = jpg_pattern.findall(content)
            if not matches:
                print(f"No JPG found in {filename}")
                continue
            
            for i, b64data in enumerate(matches, start=1):
                jpg_bytes = base64.b64decode(b64data)
                out_name = f"{os.path.splitext(filename)[0]}_{i}.jpg"
                out_path = os.path.join(folder, out_name)
                
                with open(out_path, "wb") as img_file:
                    img_file.write(jpg_bytes)
                
                print(f"Extracted: {out_path}")

if __name__ == "__main__":
    folder_path = input("Enter folder path with SVGs: ").strip('"')
    extract_jpg_from_svg(folder_path)
