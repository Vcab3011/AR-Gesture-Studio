@echo off
cd /d "%~dp0"

if not exist ".venv\Scripts\python.exe" (
    echo [!] Setting up virtual environment and installing dependencies...
    python -m venv .venv
    .\.venv\Scripts\python.exe -m pip install --upgrade pip
    .\.venv\Scripts\pip.exe install -r requirements.txt
)

echo [*] Starting Gesture Meme Detector...
.\.venv\Scripts\python.exe gesture_meme.py
pause
