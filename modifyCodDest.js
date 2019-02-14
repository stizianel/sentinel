let klaw = require('klaw'),
path = require('path'),
moment = require('moment');
const parseXML = require('./lib/parse-xml.js');
const fs = require('fs');
const cheerio = require('cheerio');

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
        console.log(invo.receiver.country, ' ', invo.destinationCode, ' ', invo.receiver.name);
        if (invo.receiver.country != 'IT') {
            const $ = cheerio.load(xml);
            const nomeFile = path.basename(item.path);
            const estero = '<CodiceDestinatario>XXXXXXX</CodiceDestinatario>';
            $('DatiTrasmissione').find('CodiceDestinatario').replaceWith(estero);
            fs.writeFileSync(`c:/temp/${nomeFile}`, $.xml());
        };
    };
})
 
// when the walk is over
.on('end', function () {
 
    console.log('');
    console.log('the walk is over');
 
});