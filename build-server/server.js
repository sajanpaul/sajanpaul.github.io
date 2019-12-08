/**
@author: Sajan Paul,
@since:  2019-12-08,
@description : Build server file
*/

const express = require('express');
const path = require('path');
var http = require('http');
var opn = require('opn');

const config = {
	domain: 'localhost',
	port: 8008,
}
const color = {
	"Reset": "\x1b[0m",
	"Bright": "\x1b[1m",
	"Dim": "\x1b[2m",
	"Underscore": "\x1b[4m",
	"Blink": "\x1b[5m",
	"Reverse": "\x1b[7m",
	"Hidden": "\x1b[8m",
	"FgBlack": "\x1b[30m",
	"FgRed": "\x1b[31m",
	"FgGreen": "\x1b[32m",
	"FgYellow": "\x1b[33m",
	"FgBlue": "\x1b[34m",
	"FgMagenta": "\x1b[35m",
	"FgCyan": "\x1b[36m",
	"FgWhite": "\x1b[37m",
	"BgBlack": "\x1b[40m",
	"BgRed": "\x1b[41m",
	"BgGreen": "\x1b[42m",
	"BgYellow": "\x1b[43m",
	"BgBlue": "\x1b[44m",
	"BgMagenta": "\x1b[45m",
	"BgCyan": "\x1b[46m",
	"BgWhite": "\x1b[47m",
};


const app = express();
const chromeName = process.platform === 'win32' ? 'chrome' : process.platform === 'darwin' ? 'google chrome' : 'google-chrome';
const htDocRoot = path.resolve(__dirname, './../run-build');



var requestLogger = function (req, res, next) {
	console.log(color.Reset, req.method, req.url)
	next();
}
app.use(requestLogger);
app.use(express.static(htDocRoot, { extensions: ['html', 'css', 'woff2'] }));
app.get('/', function (request, response) {
	response.sendFile(path.join(htDocRoot, 'index.html'));
});
app.get('*', function (request, response) {
	if (path.extname(request.path)) {
		response.sendStatus(404);
		console.log(color.FgRed, 'Failed to fetch', request.url);
	} else {
		console.log(color.FgYellow, 'APP URL', request.url);
		response.sendFile(path.join(htDocRoot, 'index.html'));
	}
});
var httpServer = http.createServer(app);
httpServer.listen(config.port, () => {
	console.log(color.Reset, 'server listening on');
	console.log(color.FgYellow, `\t http://${config.domain}:${config.port}`);
	console.log(color.Reset);
	opn(`http://localhost:${config.port}`, { app: chromeName });
});












