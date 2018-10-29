'use strict';

const { transports, format, createLogger } = require('winston');

//const LogzioWinstonTransport = require('winston-logzio');

// const logzioWinstonTransport = new LogzioWinstonTransport({
//   level: 'info',
//   format: winston.format.json(),
//   name: 'winston_logzio',
//   token: 'lxYTdtqJhYyVzaWFhJIUXQqQRawMpHFg'
// });


// const logger = winston.createLogger({
//     transports: [logzioWinstonTransport]
// });

const chokidar = require('chokidar');
const parseXML = require('./lib/parse-xml.js');
const fs = require('fs');
const path = require('path');

const logDir = 'log';
let messageLog = {};

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const filename = path.join(logDir, 'results.log');

//logger.log('info', 'winston logger configured with logzio transport');

const logger = createLogger({
    level: 'info',
    // format: format.simple(),
    // format: format.combine(
    //     format.colorize(),
    //     format.timestamp(),
    //     format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`)
    // ),
    // You can also comment out the line above and uncomment the line below for JSON format
    format: format.json(),
    transports: [new transports.Console(), new transports.File({ filename })]
});

const watcher_1 = chokidar.watch('E:\\transfer', {
    ignored: /(^|[\/\\])\../,
    persistent: true,
    depth: 0
});

const watcher_2 = chokidar.watch('E:\\transfer2', {
    ignored: /(^|[\/\\])\../,
    persistent: true,
    depth: 0
});

watcher_1
    .on('add', path => {
        const xml = fs.readFileSync(path);
        const invo = parseXML(xml);
        //logger.info(JSON.stringify(invo, null, '  '));
        //logger.log('info', JSON.stringify(invo, null, '  '));
        messageLog.type = 'fattura depositata';
        messageLog.document = invo;
        logger.info(messageLog);
    })
    .on('change', path => logger.log('info', 'modificato'))
    .on('unlink', path => logger.log('info', 'rimosso'));

watcher_2
    .on('add', path => {
        const xml = fs.readFileSync(path);
        const invo = parseXML(xml);
        //logger.info(JSON.stringify(invo, null, '  '));
        //logger.log('info', JSON.stringify(invo, null, '  '));
        messageLog.type = 'fattura inviata a TC';
        messageLog.document = invo;
        logger.info(messageLog);
    })
    .on('change', path => logger.log('info', 'modificato'))
    .on('unlink', path => logger.log('info', 'rimosso'));