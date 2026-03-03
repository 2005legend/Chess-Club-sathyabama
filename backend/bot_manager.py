import yaml
import subprocess
import os
import signal
import sys
from pathlib import Path

# Paths
current_dir = Path(__file__).parent
# Assuming folder structure: repo/backend and repo/lichess-bot-master/lichess-bot-master
BOT_DIR = current_dir.parent / "lichess-bot-master" / "lichess-bot-master"
CONFIG_FILE = BOT_DIR / "config.yml"
CONFIG_DEFAULT = BOT_DIR / "config.yml.default"

# Global Process Holder
bot_process = None

def get_config():
    """Reads the current configuration."""
    target_file = CONFIG_FILE if CONFIG_FILE.exists() else CONFIG_DEFAULT
    if not target_file.exists():
        return {"error": "Config file not found"}
    
    with open(target_file, 'r') as f:
        try:
            return yaml.safe_load(f) or {}
        except yaml.YAMLError:
            return {}

def update_config(token: str, engine_name: str):
    """Updates config.yml with new token and engine."""
    # Ensure config.yml exists
    if not CONFIG_FILE.exists():
        if CONFIG_DEFAULT.exists():
            import shutil
            shutil.copy(CONFIG_DEFAULT, CONFIG_FILE)
        else:
            return {"error": "Default config not found"}

    # Read current
    with open(CONFIG_FILE, 'r') as f:
        config = yaml.safe_load(f) or {}

    # Update values
    config['token'] = token
    
    # Security: Validate engine_name (alphanumeric, dots, dashes, underscores only)
    # prevent path traversal like ../../windows/system32/cmd.exe
    import re
    if not re.match(r'^[a-zA-Z0-9_.-]+$', engine_name):
        return {"error": "Invalid engine filename. Use alphanumeric, dot, dash, underscore only."}

    if 'engine' not in config:
        config['engine'] = {}
    config['engine']['name'] = engine_name
    # Ensure engine dir is set correctly relative to bot script if needed, 
    # but usually ./engines/ is fine if run from bot dir.
    
    # Write back
    with open(CONFIG_FILE, 'w') as f:
        yaml.dump(config, f, default_flow_style=False)
    
    return {"status": "Config updated"}

def start_bot():
    """Starts the lichess-bot process."""
    global bot_process
    
    if bot_process and bot_process.poll() is None:
        return {"status": "Already running"}
    
    if not (BOT_DIR / "lichess-bot.py").exists():
        return {"status": "Error", "message": "Bot script not found"}

    try:
        # Run python lichess-bot.py from the bot directory
        # Using sys.executable to use the same python interpreter (or assume venv is set up)
        # The user instructions said to use a venv. 
        # For simplicity, we try to use the system python or the one running this backend.
        # If dependencies are installed in the SAME env as backend, this works.
        
        # We need to make sure we are not blocking.
        bot_process = subprocess.Popen(
            [sys.executable, "lichess-bot.py"],
            cwd=str(BOT_DIR),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            # shell=True # Avoid shell=True for security, but might need for PATH?
        )
        return {"status": "Started", "pid": bot_process.pid}
    except Exception as e:
        return {"status": "Error", "message": str(e)}

def stop_bot():
    """Stops the lichess-bot process."""
    global bot_process
    if bot_process and bot_process.poll() is None:
        bot_process.terminate()
        try:
            bot_process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            bot_process.kill()
        bot_process = None
        return {"status": "Stopped"}
    else:
        return {"status": "Not running"}

def get_status():
    """Checks if bot is running."""
    global bot_process
    if bot_process and bot_process.poll() is None:
        return {"status": "Running", "pid": bot_process.pid}
    return {"status": "Stopped"}
