'use strict';
const cheerio = require('cheerio');

module.exports = (xml, logger, invo) => {
    
    const $ = cheerio.load(xml);

    const estero = '<CodiceDestinatario>XXXXXXX</CodiceDestinatario>';
    
    if (invo.receiver.country != 'IT') {
        logger.info(`Country ${invo.receiver.country} Cap Originale ${invo.receiver.cap}`);
        const capEstero = '<CAP>00000</CAP>';
        $('DatiTrasmissione').find('CodiceDestinatario').replaceWith(estero);
        $('CessionarioCommittente').find('Sede').find('CAP').replaceWith(capEstero);
    };
   
    if (invo.type == 'TD04') {
        const amount = $('DatiRiepilogo').find('ImponibileImporto').text();
        const tax = $('DatiRiepilogo').find('Imposta').text();
        const newAmount = `<ImponibileImporto>${amount.replace(/-/, '')}</ImponibileImporto>`;
        const newTax = `<Imposta>${tax.replace(/-/, '')}</Imposta>`;
        
        $('DatiRiepilogo').find('ImponibileImporto').replaceWith(newAmount);
        $('DatiRiepilogo').find('Imposta').replaceWith(newTax);

        logger.info(`Imponibile ${amount} Imposta ${tax} NewImpo ${newAmount} NewTax ${newTax}`);
    }

    return $.xml();
}