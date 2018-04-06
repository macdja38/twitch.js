let EventEmitter;
try {
  EventEmitter = require('eventemitter3');
} catch (e) {
  EventEmitter = require('events').EventEmitter;
}
module.exports = EventEmitter;