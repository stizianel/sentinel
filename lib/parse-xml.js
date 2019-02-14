'use strict';
const cheerio = require('cheerio');

module.exports = xml => {
    const $ = cheerio.load(xml);

    const invoice = {};

    invoice.number = $('Numero').text();
    invoice.date = $('Data').text();
    invoice.timestamp = new Date();
    invoice.sender = {};
    invoice.sender.country = $('CedentePrestatore').find('IdPaese').text();
    invoice.sender.id = $('CedentePrestatore').find('IdPaese').text() + $('CedentePrestatore').find('IdCodice').text() ;
    invoice.sender.name = $('CedentePrestatore').find('Denominazione').text();
    invoice.destinationCode = $('DatiTrasmissione').find('CodiceDestinatario').text();
    invoice.receiver = {};
    invoice.receiver.country = $('CessionarioCommittente').find('IdPaese').text();
    invoice.receiver.id = $('CessionarioCommittente').find('IdPaese').text() + $('CessionarioCommittente').find('IdCodice').text() ;
    invoice.receiver.name = $('CessionarioCommittente').find('Denominazione').text();
    return invoice
}