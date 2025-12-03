#!/usr/bin/env python3
"""
Simple HTTP server to serve the LMS application
"""
import http.server
import socketserver
import os
from pathlib import Path

# Change to the workspace directory
os.chdir('/workspace')

# Define the port
PORT = 8000

# Create a custom request handler that serves files from the dist directory
class LMSRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory='/workspace/dist', **kwargs)

# Start the server
Handler = LMSRequestHandler
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Interactive LMS Server running at http://localhost:{PORT}")
    print("Press Ctrl+C to stop the server")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")