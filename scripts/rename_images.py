"""Rename gallery and certificate files for Vercel-safe URLs (no spaces)."""
import os
import re

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GALLERY_ROOT = os.path.join(BASE, "static", "images", "gallery")
CERT_DIR = os.path.join(BASE, "static", "certificates")

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}

# folder name -> filename prefix
FOLDER_PREFIX = {
    "all": "highlights",
    "nsui": "nsui",
    "zanzaawat": "zanzaawat",
    "make-a-difference": "make-a-difference",
    "new-era": "new-era",
}

CERT_RENAMES = {
    "pythonr c.jpeg": "python_certificate_01.jpeg",
    "WhatsApp Image 2026-05-31 at 3.37.53 PM.jpeg": "certificate_02.jpeg",
}


def rename_gallery_folder(folder_name):
    folder_path = os.path.join(GALLERY_ROOT, folder_name)
    if not os.path.isdir(folder_path):
        return []

    prefix = FOLDER_PREFIX.get(folder_name, folder_name)
    files = sorted(
        f
        for f in os.listdir(folder_path)
        if not f.startswith(".") and os.path.splitext(f)[1].lower() in IMAGE_EXTENSIONS
    )

    renames = []
    for index, old_name in enumerate(files, start=1):
        ext = os.path.splitext(old_name)[1].lower()
        new_name = f"{prefix}_{index:04d}{ext}"
        old_path = os.path.join(folder_path, old_name)
        new_path = os.path.join(folder_path, new_name)

        if old_name == new_name:
            continue

        # Avoid collision if target exists
        if os.path.exists(new_path) and old_path.lower() != new_path.lower():
            base = f"{prefix}_{index:04d}_tmp"
            temp_path = os.path.join(folder_path, base + ext)
            os.rename(old_path, temp_path)
            old_path = temp_path
            old_name = os.path.basename(temp_path)

        os.rename(old_path, new_path)
        renames.append((folder_name, old_name, new_name))

    return renames


def rename_certificates():
    renames = []
    if not os.path.isdir(CERT_DIR):
        return renames

    for old_name, new_name in CERT_RENAMES.items():
        old_path = os.path.join(CERT_DIR, old_name)
        new_path = os.path.join(CERT_DIR, new_name)
        if os.path.isfile(old_path):
            os.rename(old_path, new_path)
            renames.append(("certificates", old_name, new_name))

    # Rename any remaining files with spaces
    counter = 10
    for filename in sorted(os.listdir(CERT_DIR)):
        if filename.startswith(".") or " " not in filename:
            continue
        ext = os.path.splitext(filename)[1].lower()
        if ext not in IMAGE_EXTENSIONS | {".pdf"}:
            continue
        new_name = f"certificate_{counter:04d}{ext}"
        counter += 1
        os.rename(os.path.join(CERT_DIR, filename), os.path.join(CERT_DIR, new_name))
        renames.append(("certificates", filename, new_name))

    return renames


def main():
    all_renames = []
    for folder_name in FOLDER_PREFIX:
        all_renames.extend(rename_gallery_folder(folder_name))

    all_renames.extend(rename_certificates())

    print(f"Renamed {len(all_renames)} files:")
    for folder, old, new in all_renames:
        print(f"  [{folder}] {old} -> {new}")


if __name__ == "__main__":
    main()
