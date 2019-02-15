const klaw = require('klaw');
const path = require('path');
const parseXML = require('./lib/parse-xml.js');
const modifyXML = require('./lib/modify-xml.js');
const fs = require('fs');
const { transports, format, createLogger } = require('winston');

// Log management
const logDir = 'log';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const filename = path.join(logDir, 'results.log');

//logger.log('info', 'winston logger configured with logzio transport');

const logger = createLogger({
    level: 'info',
    format: format.simple(),
    // format: format.combine(
    //     format.colorize(),
    //     format.timestamp(),
    //     format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`)
    // ),
    // You can also comment out the line above and uncomment the line below for JSON format
    //format: format.json(),
    transports: [new transports.Console(), new transports.File({ filename })]
});


// the dir to walk
dir_walk = process.argv[2] || process.cwd();

// walking dir_walk with the following options
klaw(dir_walk, {
 
    // default to full recursion, if now depth is given
    depthLimit: process.argv[3] || -1
 
})
 
// for each item
.on('data', function (item) {
 
    if (!item.stats.isDirectory()) {
        const xml = fs.readFileSync(item.path);
        const invo = parseXML(xml);
        const nomeFile = path.basename(item.path);

        let messageLog = invo.type + ' ' + invo.number + ' ' + nomeFile;
        logger.info(messageLog);
      
        if (invo.receiver.country != 'IT' || invo.type == 'TD04') {
            const xmlAbroad = modifyXML(xml, logger, invo);
            
            fs.writeFileSync(`c:/temp/${nomeFile}`, xmlAbroad);
        } else {
            fs.writeFileSync(`c:/temp/${nomeFile}`, xml);
        };
    };
})
 
// when the walk is over
.on('end', function () {
 
    console.log('');
    console.log('the walk is over');
 
});