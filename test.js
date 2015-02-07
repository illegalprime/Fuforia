var fuforia = require('./fuforia');
var xml2js  = require('xml2js');

db = new fuforia.FuServer('backup');

db.rebuildFromSaved(function(success) {
    if (!success) {
        db.addImage(33.777300, -84.398047, 'OnlineCommunities', 'data/Communities.xml', 'Howey Physics');
        db.addImage(33.777429, -84.389992, 'LinuxPoster',       'data/LUG.xml',         'AEL Lab');
        db.addImage(33.777917, -84.403810, 'Futurama',          'data/Futurama.xml',    'Montag Hall');
    }
    console.log('Done Loading!');

    db.getVisibleImages(33.777429, -84.389992, 85597, function(results, data) {
        console.log('\nXML:');
        console.log(results);
        console.log('\nMetadata:');
        console.log(data);
    });
});
