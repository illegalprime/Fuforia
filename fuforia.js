var mongoose = require('mongoose');
var models   = require('./lib/models');

userConfigToMongoLab = function(u) {
    return 'mongodb://' + u.user + ':' + u.pass
         + '@ds041561.mongolab.com:41561/' + u.db;
}




// Testing
/*
function onGetUrl(url) {
    mongoose.connect(url);
    var db = mongoose.connection;

    db.on('error', console.error.bind(console, 'Mongo Connect Err: '));

    db.once('open', function() {
        console.log('Connected!!!');

        var kittySchema = mongoose.Schema({
            name: String
        });

        var Kitten = mongoose.model('Kitten', kittySchema);

        var fluffy = new Kitten({
            name: 'fluffy'
        });
        fluffy.save(function(err, fluffy) {
            if (err) console.error(err);
            console.log('Saved ' + fluffy.name);
        });
    });
}

var fs = require('fs');
fs.readFile('secrets/mongo.json', function(err, data) {
    if (err) throw err;
    onGetUrl(userConfigToMongoLab(JSON.parse(data)));
});
*/

var target = new models.VuTarget({
    data: 'test.dat',
    meta: 'test.xml',
    loc: {
        longitude: 1,
        latitude: -1
    },
    extra: 'This is an extra tag'
});

var root = new models.QuadTree({
    items:    [],
    children: [],
    bbox: {
        min: {
            longitude: -5,
            latitude:  -5
        },
        max: {
            longitude: 5,
            latitude:  5
        }
    }
});

var doesFit = root.canFit([target.loc]);
console.log(doesFit);
