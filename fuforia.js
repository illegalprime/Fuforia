var kd = require('kdtree');
var fs = require('fs');

exports.FuServer = function(loadfile) {
    this.serializedFile = loadfile;

    var kdTree = new kd.KDTree(3);
    var delim  = '----POINT----';
    var radius = 637100000;

    var fileExists = function(filename) {
        fs.stat(filename, function(err, stats) {
            return !err && stats.isFile();
        });
    }

    var geoToCartesian = function(longitude, latitude) {
        longRad = longitude * Math.PI / 180;
        latRad  = latitude  * Math.PI / 180;
        return {
            x: radius * Math.sin(longRad) * Math.cos(latRad),
            y: radius * Math.sin(longRad) * Math.sin(latRad),
            z: radius * Math.cos(longRad)
        }
    }

    var addToBackup = function(point, file) {
        var dump = JSON.stringify(point);

        if (fileExists(file)) {
            dump = '\n' + delim + '\n' + dump;
        }
        fs.appendFile(file, dump, function(err) { if (err) throw err; });
    }

    this.rebuildTree = function() {
        if (!fileExists(this.serializedFile)) {
            console.log('Cannot find file \'' + this.serializedFile + '\'. Fuforia will create it!');
            return;
        }
        fs.readFile(this.serializedFile, function(err, data) {

            var points = data.split(delim);
            for (i in points) {
                var point = JSON.parse(points[i]);
                kdTree.insert(point.x, point.y, point.z, point.data);
            }
        });
    }

    this.addImage = function(longitude, latitude, dataFile, metaFile, tag) {
        var point = geoToCartesian(longitude, latitude);
        point.data = {
            raw:   dataFile,
            meta:  metaFile,
            extra: tag
        }
        kdTree.insert(point.x, point.y, point.x, point.data);
        addToBackup(point, this.serializedFile);
    }

    this.getVisibleImages = function(longitude, latitude, range) {
        var converted = geoToCartesian(longitude, latitude);
        return kdTree.nearestRange(converted.x, converted.y, converted.z, range);
    }

    this.rebuildTree();
}

