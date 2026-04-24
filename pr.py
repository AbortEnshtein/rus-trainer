import socket
import threading
import sys

def handle(client_sock, target_host, target_port):
    try:
        server_sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server_sock.connect((target_host, target_port))
    except Exception as e:
        print(f"Connection error: {e}", flush=True)
        client_sock.close()
        return

    def forward(src, dst):
        try:
            while True:
                data = src.recv(4096)
                if not data:
                    break
                dst.sendall(data)
        except:
            pass
        finally:
            try:
                src.close()
                dst.close()
            except:
                pass

    t1 = threading.Thread(target=forward, args=(client_sock, server_sock))
    t2 = threading.Thread(target=forward, args=(server_sock, client_sock))
    t1.start()
    t2.start()

def main():
    if len(sys.argv) != 4:
        print("Usage: python3 proxy.py <listen_host> <listen_port> <target_host:target_port>", flush=True)
        sys.exit(1)

    listen_host = sys.argv[1]
    listen_port = int(sys.argv[2])
    target_host, target_port = sys.argv[3].split(":")
    target_port = int(target_port)

    print(f"Proxy listening on {listen_host}:{listen_port}, forwarding to {target_host}:{target_port}", flush=True)

    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server.bind((listen_host, listen_port))
    server.listen(100)

    while True:
        client, addr = server.accept()
        print(f"Connection from {addr}", flush=True)
        threading.Thread(target=handle, args=(client, target_host, target_port)).start()

if __name__ == "__main__":
    main()