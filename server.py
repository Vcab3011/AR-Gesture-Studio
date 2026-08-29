import os
import sys
import ssl
import socket
import subprocess
from http.server import SimpleHTTPRequestHandler, HTTPServer
from pathlib import Path

# Ensure UTF-8 output on Windows consoles
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

ROOT = Path(__file__).parent.resolve()
os.chdir(ROOT)

def get_lan_ips():
    """Get all non-loopback IPv4 addresses."""
    ips = []
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.settimeout(0.5)
        s.connect(("8.8.8.8", 80))
        primary_ip = s.getsockname()[0]
        s.close()
        if primary_ip and not primary_ip.startswith("127."):
            ips.append(primary_ip)
    except Exception:
        pass

    try:
        hostname = socket.gethostname()
        for ip in socket.gethostbyname_ex(hostname)[2]:
            if not ip.startswith("127.") and ip not in ips:
                ips.append(ip)
    except Exception:
        pass

    if not ips:
        ips.append("127.0.0.1")
    return ips

def ensure_ssl_certs():
    cert_file = ROOT / "cert.pem"
    key_file = ROOT / "key.pem"

    if cert_file.exists() and key_file.exists():
        return cert_file, key_file

    print("[*] Generating self-signed SSL certificate for HTTPS...")
    openssl_paths = [
        "openssl",
        r"C:\Program Files\Git\usr\bin\openssl.exe",
        r"C:\Program Files\OpenSSL-Win64\bin\openssl.exe",
    ]

    openssl_bin = None
    for p in openssl_paths:
        try:
            res = subprocess.run([p, "version"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            if res.returncode == 0:
                openssl_bin = p
                break
        except Exception:
            continue

    if openssl_bin:
        cmd = [
            openssl_bin,
            "req",
            "-x509",
            "-newkey",
            "rsa:2048",
            "-keyout",
            str(key_file),
            "-out",
            str(cert_file),
            "-days",
            "365",
            "-nodes",
            "-subj",
            "/CN=GestureMemeLocal",
        ]
        subprocess.run(cmd, check=True)
        print("[+] SSL certificate created successfully.")
    else:
        print("[!] Using existing cert or fallback...")

    return cert_file, key_file

class CustomRequestHandler(SimpleHTTPRequestHandler):
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        '.js': 'application/javascript',
        '.mjs': 'application/javascript',
        '.wasm': 'application/wasm',
        '.json': 'application/json',
        '.task': 'application/octet-stream',
    }

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        self.send_header('Cross-Origin-Embedder-Policy', 'require-corp')
        super().end_headers()

    def log_message(self, format, *args):
        # Clean logging
        sys.stderr.write(f"[{self.log_date_time_string()}] {args[0]} - {args[1]}\n")

def run_server(port=8443):
    cert_file, key_file = ensure_ssl_certs()
    ips = get_lan_ips()

    server_address = ('0.0.0.0', port)
    httpd = HTTPServer(server_address, CustomRequestHandler)

    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.load_cert_chain(certfile=str(cert_file), keyfile=str(key_file))
    httpd.socket = context.wrap_socket(httpd.socket, server_side=True)

    print("\n" + "=" * 65)
    print(" >>> GESTURE MEME DETECTOR - HTTPS SERVER IS RUNNING <<<")
    print("=" * 65)
    print("\n[!] Mo trinh duyet Safari tren iPad va truy cap vao dia chi sau:\n")
    for ip in ips:
        print(f"    -->  https://{ip}:{port}/")
    print(f"    -->  https://localhost:{port}/  (Tren may tinh nay)")
    print("\n" + "-" * 65)
    print(" HUONG DAN KHI TRUY CAP TRÊN IPAD (SAFARI):")
    print(" 1. Safari se hien thi: 'Ket noi nay khong rieng tu' / 'This Connection Is Not Private'.")
    print(" 2. Bam vao 'Hien thi chi tiet' (Show Details) -> Chon 'Truy cap trang web nay' (visit this website).")
    print(" 3. Khi Safari hoi quyen truy cap Camera -> Chon 'Cho phep' (Allow).")
    print("=" * 65 + "\n")
    print("Nhan Ctrl + C de dung server.\n")

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[*] Dang tat server...")
        httpd.server_close()

if __name__ == "__main__":
    port = 8443
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            pass
    run_server(port)
