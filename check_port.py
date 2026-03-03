import socket
import sys

def check_port(port):
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(('127.0.0.1', port))
    sock.close()
    if result == 0:
        print(f"Port {port} is OPEN")
        return True
    else:
        print(f"Port {port} is CLOSED")
        return False

if __name__ == "__main__":
    check_port(8000)
