var fuforia = require('./fuforia');

db = new fuforia.FuServer('test.backup');

db.addImage(33.777300, -84.398047, 'data.dat', 'meta.xml', 'Howey Physics');
db.addImage(33.777917, -84.403810, 'data.dat', 'meta.xml', 'Montag Residence Hall');
db.addImage(33.777429, -84.389992, 'data.dat', 'meta.xml', 'AEL Lab');

console.log(db.getVisibleImages(33.777429, -84.389992, 1000));

