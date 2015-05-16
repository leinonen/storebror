# Storebror aka "big brother"

![](http://qvintus.pharatropic.se/imagehost/viewImage/150516_6441.jpg)

Server monitoring software. Let's say you have a bunch of computers in your network that you want to monitor.
Run the client on each computer, and the master on your raspberry pi. The master has a graphical interface that let's you view info about all the connected clients. The clients will report data to the master periodically, or by request from the master.
The GPIO pins are used to flash LEDs to display status when data is recieved by the server (just to make use of the GPIO pins!).

## Features
* Show disk totals of all connected systems
* Show system information
* Show mounted filesystems
* Show services (works on linux distros using initctl)
* Flash LEDS usin GPIO pins (if running master on a Raspberry Pi)

## Master (server/server.js)
Runs on Raspberry Pi (for GPIO).

* Accepts data from clients, and keeps track of them.
* Angularjs user interface for viewing the clients.
* Uses MongoDB for storage.
* Use RPI GPIO ports to display status by flashing leds for requests.

The master can be configured by editing `server/server.js`


## Slave (client/client.js)
Client that sends system information to the master on a regular basis.
The client can be configured by editing `client/config.js`.

# Installation & running
Run `npm install`, and `bower install` (from server dir) if installing server.
To run the master type `sudo node server/server.js`.
To run the client type `node client/client.js`.


# Copyright
No, free to use by everybody! Have fun! :D
