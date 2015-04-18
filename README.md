# Storebror aka "big brother"

Server monitoring software. Let's say you have a bunch of computers in your network that you want to monitor. Run the client on each computer, and the master on your raspberry pi. The master has a graphical interface that let's you view info about all the connected clients. The clients will report data to the master periodically, or by request from the master.
The GPIO pins are used to flash LEDs to display status when data is recieved by the master (just to make use of the GPIO pins!).

## master.js
Runs on raspberry pi.
Accepts data from clients, and keeps track of them.
Angularjs user interface for viewing the clients.
Use rpi GPIO ports to display status by flashing leds for requests.

## slave.js
client that sends system information to the master.
Takes the master ip as an argument, defaults to http://127.0.0.1:8080


# Installation
Run npm install, and bower install if installing on master.

# Copyright
No, free to use by everybody! Have fun! :D

--------

TODO
----------
run hostname or hostname -A depending on platform
releasen. kärnan linux (skippa allt efter dash)
cpu utilization
free memory linux   free -m   .. parsa buffers/cache  för free
hddtemp


DONE
---------
spara i databas. mongoose
system load, två decimaler  done!!
uptime done!!!
lista services, typ tomcat etc..
visa TB i totals
