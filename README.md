# Storebror aka "big brother"

Server monitoring software. Let's say you have a bunch of computers in your network that you want to monitor. Run the client on each computer, and the master on your raspberry pi. The master has a graphical interface that let's you view info about all the connected clients. The clients will report data to the master periodically, or by request from the master.
The GPIO pins are used to flash LEDs to display status when data is recieved by the master (just to make use of the GPIO pins!).

## master/master.js
Runs on Raspberry Pi.
Accepts data from clients, and keeps track of them.
Angularjs user interface for viewing the clients.
Uses mongodb for storage.
Use RPI GPIO ports to display status by flashing leds for requests.

## slave/slave.js
Client that sends system information to the master on a regular basis.


# Installation & running
Run npm install, and bower install if installing on master.
To run the master type sudo node master/master.js

npm start for the client.


# Copyright
No, free to use by everybody! Have fun! :D
