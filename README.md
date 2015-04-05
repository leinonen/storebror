storebror aka "big brother"

server monitoring software.

# master
runs on raspberry pi
accepts data from clients, and keeps track of them
angularjs user interface for viewing the clients
use rpi GPIO ports to display status by flashing leds for requests.

# slave
client that sends system information to the master


still thinking about how the communication protocol should work


# API for master


POST /connect
connect to master. get client_id back

GET  /clients
get all the clients

POST /clients/:client_id/sysinfo
send system info to master for specific client

