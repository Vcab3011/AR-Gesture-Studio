@echo off
title Gesture Meme Server (iPad / LAN)
cd /d "%~dp0"

echo [*] Starting HTTPS Local Server for iPad...
if exist ".venv\Scripts\python.exe" (
    .\.venv\Scripts\python.exe server.py 8443
) else (
    python server.py 8443
)

pause
