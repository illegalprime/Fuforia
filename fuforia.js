var kd = require('kdtree');
var fs = require('fs');
var Promise = require('promise');

exports.FuServer = function(loadfile) {
    this.serializedFile = loadfile;

    var kdTree = new kd.KDTree(3);
    var delim  = '----POINT----';
    var radius = 637100000;
    var loaded = false;

    var fileExists = function(filename, callback) {
        fs.stat(filename, function(err, stats) {
            callback(!err && stats.isFile(), filename);
        });
    };

    var geoToCartesian = function(longitude, latitude) {
        longRad = longitude * Math.PI / 180;
        latRad  = latitude  * Math.PI / 180;
        return {
            x: radius * Math.sin(longRad) * Math.cos(latRad),
            y: radius * Math.sin(longRad) * Math.sin(latRad),
            z: radius * Math.cos(longRad)
        };
    };

    var addToBackup = function(point, file) {
        var dump = JSON.stringify(point);

        fileExists(file, function(isFile) {
            dump = '\n' + delim + '\n' + dump;
            fs.appendFile(file, dump, function(err) {
                if (err) throw err;
            });
        });
    };

    this.rebuildFromSaved = function(callback) {
        var finish = function(status) {
            loaded = true;
            if (callback) {
                callback(status);
            }
        }

        fileExists(this.serializedFile, function(isFile, file) {
            if (!isFile) {
                console.log('Cannot find file \'' + file
                          + '\'. Fuforia will create it!');
                finish(false);
            }
            fs.readFile(file, 'utf8', function(err, data) {
                var points = data.split(delim);
                for (var i = 1; i < points.length; ++i) {
                    var point = JSON.parse(points[i]);
                    kdTree.insert(point.x, point.y, point.z, point.data);
                }
                finish(true);
            });
        });
    };

    this.addImage = function(longitude, latitude, dataFile, metaFile, tag) {
        var point = geoToCartesian(longitude, latitude);
        point.data = {
            raw:   dataFile,
            meta:  metaFile,
            extra: tag
        };
        kdTree.insert(point.x, point.y, point.x, point.data);
        addToBackup(point, this.serializedFile);
    };

    this.getVisibleImages = function(longitude, latitude, range) {
        var point = geoToCartesian(longitude, latitude);
        return kdTree.nearestRange(point.x, point.y, point.z, range);
    };

    this.isLoaded = function() {
        return loaded;
    };
}
