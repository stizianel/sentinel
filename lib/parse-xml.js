'use strict';
const cheerio = require('cheerio');

module.exports = xml => {
    const $ = cheerio.load(xml);

    const invoice = {};

    invoice.number = $('Numero').text();
    invoice.date = $('Data').text();
    invoice.timestamp = new Date();
    invoice.sender = {};
    invoice.sender.id = $('CedentePrestatore').find('IdPaese').text() + $('CedentePrestatore').find('IdCodice').text() ;
    invoice.sender.name = $('CedentePrestatore').find('Denominazione').text();
    
    return invoice
}