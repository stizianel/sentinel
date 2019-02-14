let klaw = require('klaw'),
path = require('path'),
moment = require('moment');

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
        const dtFile = new Date(item.stats.ctimeMs);
        const dataOra = moment(Date.now());
        const duration = moment.duration(dataOra.diff(dtFile));
        console.log(path.basename(item.path), item.stats.ctime, duration.asHours());
 
    }
 
})
 
// when the walk is over
.on('end', function () {
 
    console.log('');
    console.log('the walk is over');
 
});