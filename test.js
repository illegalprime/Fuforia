var fuforia = require('./fuforia');

db = new fuforia.FuServer('backup');

db.rebuildFromSaved(function(success) {
    if (!success) {
        db.addImage(33.777300, -84.398047, 'data.dat', 'meta.xml', 'Howey Physics');
        db.addImage(33.777917, -84.403810, 'data.dat', 'meta.xml', 'Montag Hall');
        db.addImage(33.777429, -84.389992, 'data.dat', 'meta.xml', 'AEL Lab');
    }
    console.log('Done Loading!\n');
    //                                       minimum r AEL to montag
    var neighbors = db.getVisibleImages(33.777429, -84.389992, 85597);
    console.log('You are nearest to:');
    for (i in neighbors) {
        console.log(' - ' + neighbors[i][3].extra);
    }
});
