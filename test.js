var util = require('./util');
var diskinfo = require('./diskinfo-promise');
var _ = require('lodash');

/*diskinfo.get().then(function(drives) {

	console.log(drives);

}).fail(function(err){
	console.error(err);
});
*/
/*
var drives = [
{
	size: "3M",
	used: "1M",
	avail: "2M"
},
{
	size: "30G",
	used: "10G",
	avail: "20G"
}
];*/

var clients = [
{
lastUpdate: "2015-04-11T21:12:39.016Z",
sysinfo: {
local: "192.168.1.105",
hostname: "workstation.skynet",
type: "Darwin",
platform: "darwin",
arch: "x64",
release: "14.1.0",
uptime: 42368,
loadavg: [
1.0439453125,
1.248046875,
1.24072265625
],
totalmem: 34359738368,
freemem: 26567585792,
cpus: [
{
model: "Intel(R) Core(TM) i7-4790K CPU @ 4.00GHz",
speed: 4000,
times: {
user: 2245960,
nice: 0,
sys: 1379960,
idle: 38742750,
irq: 0
}
},
{
model: "Intel(R) Core(TM) i7-4790K CPU @ 4.00GHz",
speed: 4000,
times: {
user: 11590,
nice: 0,
sys: 7280,
idle: 42349360,
irq: 0
}
},
{
model: "Intel(R) Core(TM) i7-4790K CPU @ 4.00GHz",
speed: 4000,
times: {
user: 1460430,
nice: 0,
sys: 569480,
idle: 40338310,
irq: 0
}
},
{
model: "Intel(R) Core(TM) i7-4790K CPU @ 4.00GHz",
speed: 4000,
times: {
user: 13280,
nice: 0,
sys: 9920,
idle: 42345030,
irq: 0
}
},
{
model: "Intel(R) Core(TM) i7-4790K CPU @ 4.00GHz",
speed: 4000,
times: {
user: 1462210,
nice: 0,
sys: 571630,
idle: 40334380,
irq: 0
}
},
{
model: "Intel(R) Core(TM) i7-4790K CPU @ 4.00GHz",
speed: 4000,
times: {
user: 13630,
nice: 0,
sys: 10110,
idle: 42344480,
irq: 0
}
},
{
model: "Intel(R) Core(TM) i7-4790K CPU @ 4.00GHz",
speed: 4000,
times: {
user: 1436270,
nice: 0,
sys: 567980,
idle: 40363970,
irq: 0
}
},
{
model: "Intel(R) Core(TM) i7-4790K CPU @ 4.00GHz",
speed: 4000,
times: {
user: 13760,
nice: 0,
sys: 10470,
idle: 42343990,
irq: 0
}
}
]
},
diskinfo: {
drives: [
{
filesystem: "/dev/disk0s2",
size: "232Gi",
used: "58Gi",
avail: "174Gi",
mounted: "/"
}
],
totals: {
size: {
unit: "G",
value: 232
},
used: {
unit: "G",
value: 58
},
avail: {
unit: "G",
value: 174
}
}
},
config: {
reportInterval: 10000
},
client_id: "c3a7637c6d2c0f3374560ee00371547e"
},

{
lastUpdate: "2015-04-11T21:12:39.016Z",
sysinfo: {
local: "192.168.1.105",
hostname: "workstation.skynet",
type: "Darwin",
platform: "darwin",
arch: "x64",
release: "14.1.0",
uptime: 42368,
loadavg: [
1.0439453125,
1.248046875,
1.24072265625
],
totalmem: 34359738368,
freemem: 26567585792,
cpus: [
{
model: "Intel(R) Core(TM) i7-4790K CPU @ 4.00GHz",
speed: 4000,
times: {
user: 2245960,
nice: 0,
sys: 1379960,
idle: 38742750,
irq: 0
}
},
{
model: "Intel(R) Core(TM) i7-4790K CPU @ 4.00GHz",
speed: 4000,
times: {
user: 11590,
nice: 0,
sys: 7280,
idle: 42349360,
irq: 0
}
},
{
model: "Intel(R) Core(TM) i7-4790K CPU @ 4.00GHz",
speed: 4000,
times: {
user: 1460430,
nice: 0,
sys: 569480,
idle: 40338310,
irq: 0
}
},
{
model: "Intel(R) Core(TM) i7-4790K CPU @ 4.00GHz",
speed: 4000,
times: {
user: 13280,
nice: 0,
sys: 9920,
idle: 42345030,
irq: 0
}
},
{
model: "Intel(R) Core(TM) i7-4790K CPU @ 4.00GHz",
speed: 4000,
times: {
user: 1462210,
nice: 0,
sys: 571630,
idle: 40334380,
irq: 0
}
},
{
model: "Intel(R) Core(TM) i7-4790K CPU @ 4.00GHz",
speed: 4000,
times: {
user: 13630,
nice: 0,
sys: 10110,
idle: 42344480,
irq: 0
}
},
{
model: "Intel(R) Core(TM) i7-4790K CPU @ 4.00GHz",
speed: 4000,
times: {
user: 1436270,
nice: 0,
sys: 567980,
idle: 40363970,
irq: 0
}
},
{
model: "Intel(R) Core(TM) i7-4790K CPU @ 4.00GHz",
speed: 4000,
times: {
user: 13760,
nice: 0,
sys: 10470,
idle: 42343990,
irq: 0
}
}
]
},
diskinfo: {
drives: [
{
filesystem: "/dev/disk0s2",
size: "232Gi",
used: "58Gi",
avail: "174Gi",
mounted: "/"
}
],
totals: {
size: {
unit: "G",
value: 232
},
used: {
unit: "G",
value: 58
},
avail: {
unit: "G",
value: 174
}
}
},
config: {
reportInterval: 10000
},
client_id: "c3a7637c6d2c0f3374560ee00371547e"
}
];

//var sum = diskinfo.driveSummary(drives);
//console.log(sum);

var totals = _.pluck(_.pluck(clients, 'diskinfo'), 'totals')
		.reduceRight(diskinfo.sum);

console.log(totals);