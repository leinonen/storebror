var _ = require('lodash');

var config = require('./config');
var Client = require('./models/client');
var calculator = require('../utils/unitcalculator');

var leds = {};

if (config.gpioEnabled) {
  var GPIO = require('onoff').Gpio;
  leds.status = new GPIO(config.leds.status, 'out');
  leds.error = new GPIO(config.leds.error, 'out');
  leds.test = new GPIO(config.leds.test, 'out');
}


exports.checkMessage = function (req, res, next) {
  var report = req.body;
  if (report.cid === undefined ||
    report.type === undefined ||
    report.data === undefined) {
    console.log('Invalid message recieved from ' + req.ip);
    res.sendStatus(400);
  } else {
    next();
  }
};

exports.connect = function (req, res) {
  var cid = req.body.cid;

  Client
    .findOne({cid: cid})
    .exec(function (err, client) {
      if (err) {
        console.error(err.message);
        res.sendStatus(400);
      } else {
        if (client === null) {
          console.log('client not found - create it');
          var newClient = new Client({cid: cid});
          newClient.save();
          res.json({id: newClient._id});
        } else {
          res.json({id: client._id});
        }
      }
    });
};

/**
 * Process incomming reports from client.
 * @param ws
 * @param req
 */
exports.report = function (req, res) {

  var report = req.body;

  Client
    .findOne({_id: report.clientID})
    .exec(function (err, client) {
      if (err) {
        console.error(err.message);
        res.sendStatus(400);
      } else {
        if (client === null) {
          console.log('client not found - must connect first!');
          res.sendStatus(400);
        } else {
          handleReport(client, report);
          res.sendStatus(200);
        }
      }
    });

  flash();
};


function parseVersion(input) {
  var v = input.split('.');
  return {major: v[0], minor: v[1], patch: v[1]}
}

/**
 * Handle the report for a client.
 * Assume client is not null.
 * @param client
 * @param report
 */
function handleReport(client, report) {

  console.log('updating %s with %s', report.cid, report.type);

  if (report.type === 'drives') {
    client.drives = report.data;
  } else if (report.type === 'services') {
    client.services = report.data;
  } else if (report.type === 'hostname') {
    client.hostname = report.data;
  } else if (report.type === 'hddtemp') {
    client.hddtemp = report.data;
  } else if (report.type === 'system') {
    client.system = report.data;
  } else if (report.type === 'config') {
    client.config = report.data;
  } else {
    console.log('wrong type! %s', report.type);
    return;
  }

  client.lastUpdate = new Date();

  client.save();
}


function isOld(lastUpdate) {
  var now = new Date();
  var reportDate = new Date(lastUpdate);
  var hours = Math.abs(now - reportDate) / (60 * 60 * 1000);
  return hours > 1.0;
}

exports.clients = function (req, res) {
  Client
    .find()
    .select('_id')
    .select('cid')
    .select('hostname')
    .select('lastUpdate')
    .select('system')
    .exec(function (err, list) {
      res.json(list.map(function (item) {
        return {
          _id: item._id,
          cid: item.cid,
          hostname: item.hostname || item.system.hostname || item.system.local,
          stale: isOld(item.lastUpdate)
        };
      }));
    });
};

exports.client = function (req, res) {
  Client
    .findOne({_id: req.params.id})
    .exec(function (err, c) {
      res.json(c);
    });
};

exports.updateClient = function (req, res) {
  Client
    .findOne({_id: req.params.id})
    .exec(function (err, c) {
      c.metadata = req.body.metadata;
      c.save();
      console.log('updated metadata');
      res.json(c);
    });
};


exports.stats = function (req, res) {
  Client
    .find()
    .exec(function (err, clients) {
      res.json(calculateTotals(clients));
    });
};


function flattenArrays(arr) {
  return arr.reduce(function (a, b) {
    return a.concat(b);
  });
}


exports.cpuinfo = function (req, res) {
  Client
    .find()
    .exec(function (err, clients) {
/*      var actualCpus = clients.map(function (client) {
        return client.system.cpus;
      });
      var cpus = actualCpus.reduce(function (a, b) {
        return a.concat(b);
      });

      var totalSpeedMhz = cpus.map(function (core) {
        return core.speed;
      }).reduce(function (a, b) {
        return a + b;
      });
*/
      res.json({
        computers: clients.length,
        totalCores: 0,
        totalGHz: 0
      });
    });
};


exports.config = function (req, res) {
  res.json(config);
};


exports.logRequest = function (req, res, next) {
  /*if (!isStatic(req.originalUrl)) {
   console.log('REQ -> %s by %s', req.originalUrl, req.ip);
   }*/
  next();
};


// Helper functions 


function isLessThanTwoHoursOld(client) {
  if (client.lastUpdate === undefined) {
    return true;
  }
  var now = new Date();
  var reportDate = new Date(client.lastUpdate);
  var hours = Math.abs(now - reportDate) / (60 * 60 * 1000);
  return hours < 2.0;
}

function calculateTotals(clients) {
  var totals = _.pluck(_.pluck(clients.filter(isLessThanTwoHoursOld), 'drives'), 'totals');
  return {
    size: calculator.sum(_.pluck(totals, 'size')),
    used: calculator.sum(_.pluck(totals, 'used')),
    avail: calculator.sum(_.pluck(totals, 'avail'))
  }
}


function isStatic(url) {
  return _.contains(url, ['components', '.js']);
}

function flash() {
  flashStatus();
  flashError();
  flashTest();
}

function flashStatus() {
  if (config.gpioEnabled) {
    leds.status.writeSync(1);
    setTimeout(function () {
      leds.status.writeSync(0);
    }, 100);
  }
}

function flashError() {
  if (config.gpioEnabled) {
    leds.error.writeSync(1);
    setTimeout(function () {
      leds.error.writeSync(0);
    }, 200);
  }
}

function flashTest() {
  if (config.gpioEnabled) {
    leds.test.writeSync(1);
    setTimeout(function () {
      leds.test.writeSync(0);
    }, 300);
  }
}
