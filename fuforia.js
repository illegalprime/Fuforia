var mongoose = require('mongoose');

userConfigToMongoLab = function(u) {
    return 'mongodb://' + u.user + ':' + u.pass
         + '@ds041561.mongolab.com:41561/' + u.db;
}


// Testing

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


