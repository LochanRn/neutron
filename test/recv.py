import socket

UDP_IP = "192.168.1.77"
UDP_PORT = 5003

print "Receiving at IP:" , UDP_IP
print "Receiving at Port:", UDP_PORT
sock = socket.socket(socket.AF_INET, # Internet
socket.SOCK_DGRAM) # UDP
sock.bind((UDP_IP, UDP_PORT))

while True:
  data, addr = sock.recvfrom(1024) # buffer size is 1024 bytes
  print "received message:", data
