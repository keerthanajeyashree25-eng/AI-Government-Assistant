import os
from pathlib import Path


def _load_env_file():
    env_path = Path(__file__).resolve().parent / ".env"
    if not env_path.exists():
        return

    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


_load_env_file()

# Set GEMINI_API_KEY in your environment or local .env file.
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", "")
GEMINI_MODELS = [
    model.strip()
    for model in os.environ.get(
        "GEMINI_MODELS",
        "gemini-flash-lite-latest,gemini-3.8-flash,gemini-3.7-flash,gemini-3.6-flash",
    ).split(",")
    if model.strip()
]

# Minimum retrieval score (0-1) below which we tell the user
# we could not verify the information, instead of guessing.
RETRIEVAL_CONFIDENCE_THRESHOLD = 0.15

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
