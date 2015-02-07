// var fuforia = require('./fuforia');
var Promise = require('promise');

// db = new fuforia.FuServer('backup');
//
// db.rebuildFromSaved().then(function(res) {
//     console.log('Done Loading!');
// }, function(err) {});


// db.addImage(33.777300, -84.398047, 'data.dat', 'meta.xml', 'Howey Physics');
// db.addImage(33.777917, -84.403810, 'data.dat', 'meta.xml', 'Montag Hall');
// db.addImage(33.777429, -84.389992, 'data.dat', 'meta.xml', 'AEL Lab');

// console.log(db.getVisibleImages(33.777429, -84.389992, 1000));

var fileExists = function(filename) {
    return new Promise(function(resolve, reject) {
        (function() {
            resolve();
        })();
    });
};

fileExists('backup').then(function() {
    console.log('Done!');
});


setTimeout(function() { console.log('Exit.'); }, 3000);
