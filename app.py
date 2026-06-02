import os
import re
from flask import Flask, jsonify, render_template, send_from_directory, abort, url_for
from flask import send_from_directory

app = Flask(__name__)

@app.route('/sitemap.xml')
def sitemap():
    return send_from_directory('static', 'sitemap.xml')

@app.route('/robots.txt')
def robots():
    return send_from_directory('static', 'robots.txt')
GITHUB_USERNAME = "vidhitam"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
CERT_EXTENSIONS = IMAGE_EXTENSIONS | {".pdf"}

# Gallery subfolders under static/images/gallery/ — upload images into each folder
GALLERY_FOLDERS = [
    ("all", "general", "Highlights", False),
    ("nsui", "nsui", "NSUI", True),
    ("zanzaawat", "zanzaawat", "Zanzaawat Sanstha", True),
    ("make-a-difference", "make-a-difference", "Make a Difference", True),
    ("new-era", "new-era", "New Era Socials", True),
]


def _gallery_root():
    return os.path.join(BASE_DIR, "static", "images", "gallery")


def _ensure_gallery_folders():
    root = _gallery_root()
    os.makedirs(root, exist_ok=True)
    for folder_name, *_ in GALLERY_FOLDERS:
        os.makedirs(os.path.join(root, folder_name), exist_ok=True)


def _humanize_filename(name):
    base = os.path.splitext(name)[0]
    base = re.sub(r"[_\-]+", " ", base)
    base = re.sub(r"\s+", " ", base).strip()
    return base.title() if base else "Certificate"


def _scan_gallery_images():
    images = []
    root = _gallery_root()

    for folder_name, category_id, label, show_filter in GALLERY_FOLDERS:
        folder_path = os.path.join(root, folder_name)
        if not os.path.isdir(folder_path):
            continue
        for filename in sorted(os.listdir(folder_path)):
            if filename.startswith(".") or os.path.splitext(filename)[1].lower() not in IMAGE_EXTENSIONS:
                continue
            images.append(
                {
                    "src": f"images/gallery/{folder_name}/{filename}",
                    "category": category_id,
                    "caption": label,
                    "filename": filename,
                }
            )

    return images


def _get_certificates_list():
    cert_dir = os.path.join(BASE_DIR, "static", "certificates")
    os.makedirs(cert_dir, exist_ok=True)
    certificates = []

    for filename in sorted(os.listdir(cert_dir)):
        if filename.startswith(".") or filename == ".gitkeep":
            continue
        ext = os.path.splitext(filename)[1].lower()
        if ext not in CERT_EXTENSIONS:
            continue
        certificates.append(
            {
                "filename": filename,
                "title": _humanize_filename(filename),
                "is_image": ext in IMAGE_EXTENSIONS,
            }
        )

    return certificates


_ensure_gallery_folders()


@app.route("/")
def index():
    return render_template("index.html", certificates=_get_certificates_list())


@app.route("/api/github")
def github_data():
    import requests

    headers = {"Accept": "application/vnd.github.v3+json"}
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"

    try:
        user_resp = requests.get(
            f"https://api.github.com/users/{GITHUB_USERNAME}",
            headers=headers,
            timeout=10,
        )
        repos_resp = requests.get(
            f"https://api.github.com/users/{GITHUB_USERNAME}/repos",
            headers=headers,
            params={"sort": "updated", "per_page": 6},
            timeout=10,
        )

        user = user_resp.json() if user_resp.ok else {}
        repos = repos_resp.json() if repos_resp.ok else []

        if isinstance(repos, dict):
            repos = []

        return jsonify(
            {
                "profile": {
                    "login": user.get("login", GITHUB_USERNAME),
                    "name": user.get("name") or "Vidhitam Chakole",
                    "avatar_url": user.get("avatar_url", ""),
                    "bio": user.get("bio", ""),
                    "public_repos": user.get("public_repos", 0),
                    "followers": user.get("followers", 0),
                    "following": user.get("following", 0),
                    "html_url": user.get("html_url", f"https://github.com/{GITHUB_USERNAME}"),
                    "created_at": user.get("created_at", ""),
                },
                "repos": [
                    {
                        "name": repo.get("name"),
                        "description": repo.get("description") or "No description provided.",
                        "html_url": repo.get("html_url"),
                        "language": repo.get("language"),
                        "stargazers_count": repo.get("stargazers_count", 0),
                        "forks_count": repo.get("forks_count", 0),
                        "updated_at": repo.get("updated_at"),
                    }
                    for repo in repos
                    if not repo.get("fork", False)
                ][:6],
            }
        )
    except requests.RequestException:
        return jsonify({"error": "Unable to fetch GitHub data"}), 503


@app.route("/download/resume")
def download_resume():
    resume_dir = os.path.join(BASE_DIR, "static", "resume")
    filename = "Vidhitam_Chakole_Resume.pdf"
    filepath = os.path.join(resume_dir, filename)
    if not os.path.isfile(filepath):
        for name in os.listdir(resume_dir) if os.path.isdir(resume_dir) else []:
            if name.lower().endswith(".pdf"):
                filename = name
                break
        else:
            abort(404)
    return send_from_directory(resume_dir, filename, as_attachment=True)


@app.route("/api/gallery")
def gallery_data():
    images = _scan_gallery_images()
    filters = []
    for folder_name, category_id, label, show_filter in GALLERY_FOLDERS:
        if category_id == "general" or show_filter:
            filters.append({"id": category_id, "label": label})
    return jsonify({"images": images, "filters": filters})


@app.route("/api/certificates")
def certificates_data():
    certificates = []
    for cert in _get_certificates_list():
        certificates.append(
            {
                **cert,
                "preview_url": url_for("static", filename=f"certificates/{cert['filename']}"),
                "download_url": url_for("download_certificate", filename=cert["filename"]),
            }
        )
    return jsonify({"certificates": certificates})


@app.route("/certificates/<path:filename>")
def download_certificate(filename):
    cert_dir = os.path.join(BASE_DIR, "static", "certificates")
    if not os.path.isfile(os.path.join(cert_dir, filename)):
        abort(404)
    return send_from_directory(cert_dir, filename, as_attachment=True)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
