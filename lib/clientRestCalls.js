/**
 * @fileOverview
 * A re-usable API for clients to employ when making calls to the server REST
 * API.
 */
'use strict';
var request = require('request');

var Config = require('config-js').Config;
var path = require('path');
var logPath = path.join(__dirname, '..', 'conf', 'config.js');
var config = new Config(logPath);

var PORT = config.get('port', 4201);
var HOST = config.get('host', 'localhost');
var URL = 'http://'+HOST+':'+PORT;

/**
 * logs a player into the game
 * @param {Object} body The body of the HTTP message
 * @param {Function} cb error callback of form fn(err, json), where json is the
 *      json response body from the server.
 */
function login(body, cb) {
    var qs = null;
    cmd('login', 'POST', body, qs, cb);
}

/**
 * logs a player out of the game, if in a room, they are removed. If they
 * have a bet on a hand, they lose the bet.
 * @param {Object} body The body of the HTTP message
 * @param {Function} cb error callback of form fn(err, json), where json is the
 *      json response body from the server.
 */
function logout(body, cb) {
    var qs = null;
    cmd('logout', 'POST', body, qs, cb);
}

/**
 * get all the tables in the game with the players at them
 * @param {Function} cb error callback of form fn(err, json), where json is the
 *      json response body from the server.
 */
function viewTables(cb) {
    var qs = null;
    var body = true;
    cmd('viewTables', 'GET', body, qs, cb);
}

/**
 * join a table to start playing a game
 * @param {Object} body The body of the HTTP message
 * @param {Function} cb error callback of form fn(err, json), where json is the
 *      json response body from the server.
 */
function joinTable(body, cb) {
    var qs = null;
    cmd('joinTable', 'POST', body, qs, cb);
}

/**
 * leave a table and return to the lobby
 * @param {Object} body The body of the HTTP message
 * @param {Function} cb error callback of form fn(err, json), where json is the
 *      json response body from the server.
 */
function leaveTable(body, cb) {
    var qs = null;
    cmd('leaveTable', 'POST', body, qs, cb);
}

/**
 * set the bet for the next hand
 * @param {Object} body The body of the HTTP message
 * @param {Function} cb error callback of form fn(err, json), where json is the
 *      json response body from the server.
 */
function bet(body, cb) {
    var qs = null;
    cmd('bet', 'POST', body, qs, cb);
}

/**
 * player is requesting another card
 * @param {Object} body The body of the HTTP message
 * @param {Function} cb error callback of form fn(err, json), where json is the
 *      json response body from the server.
 */
function hit(body, cb) {
    var qs = null;
    cmd('hit', 'POST', body, qs, cb);
}

/**
 * player wants to stand on current hand
 * @param {Object} body The body of the HTTP message
 * @param {Function} cb error callback of form fn(err, json), where json is the
 *      json response body from the server.
 */
function stand(body, cb) {
    var qs = null;
    cmd('stand', 'POST', body, qs, cb);
}

/**
 * set the amount of credits a player has
 * @param {Object} body The body of the HTTP message
 * @param {Function} cb error callback of form fn(err, json), where json is the
 *      json response body from the server.
 */
function debugCredits(body, cb) {
    var qs = null;
    cmd('debugCredits', 'POST', body, qs, cb);
}

/**
 * get player information
 * @param {Object} body The body of the HTTP message
 * @param {Function} cb error callback of form fn(err, json), where json is the
 *      json response body from the server.
 */
function debugGetPlayer(qs, cb) {
    var body = true;
    cmd('debugGetPlayer', 'GET', body, qs, cb);
}

/**
 * get all game state information
 * @param {Object} qs A series of key value pairs to sent as a query-string.
 * @param {Function} cb error callback of form fn(err, json), where json is the
 *      json response body from the server.
 */
function debugGameState(qs, cb) {
    var body = true;
    cmd('debugGameState', 'GET', body, qs, cb);
}

/**
 * makes HTTP request using the request module.
 * @param {String} apiCmd The name of the api command we are acting for
 * @param {String} method The HTTP method we are using.
 * @param {Object} body The body of the HTTP message
 * @param {Function} cb error callback of form fn(err, json), where json is the
 *      json response body from the server.
 */
function cmd(apiCmd, method, body, qs, cb) {
    var opts = {
        method: method,
        json: body,
        uri: URL+'/'+apiCmd,
        pool: false
    };

    if (qs)
        opts.qs = qs;

    request(opts,
        function(err, res, json) {
            if (err) {
                logger.error('%s: %j', apiCmd, json);
                return cb(err);
            } else if (json.success === false) {
                logger.error('%s: %j', apiCmd, json);
                return cb(new Error(json.error), json);
            } else {
                logger.debug('%s: %j', apiCmd, json);
            }
            cb(null, json);
        }
    );
}

// exports for use by other files
module.exports = {
    login: login,
    logout: logout,
    viewTables: viewTables,
    joinTable: joinTable,
    leaveTable: leaveTable,
    bet: bet,
    hit: hit,
    stand: stand,
    debugCredits: debugCredits,
    debugGetPlayer: debugGetPlayer,
    debugGameState: debugGameState
};
