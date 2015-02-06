var kd = require('kdtree');
var fs = require('fs');

exports.FuServer = function(loadfile) {
    this.serializedFile = loadfile;
    
    var kdTree = new kd.KDTree(3);
    var delim  = '----POINT----';
    var radius = 637100000;

    this.rebuildTree = function() {
        if (!checkFile(serializedFile)) return;

        fs.readFile(serializedFile, function(err, data) {

            var points = data.split(delim);
            for (i in points) {
                var point = JSON.parse(points[i]);
                kdTree.insert(point.x, point.y, point.z, point.data);
            }
        });
    }

    this.checkFile = function(filename) {
        fs.stat(filename, function(err, stats) {
            return !err && stats.isFile();
        });
    }

    this.addPoint = function(longitude, latitude, dataFile, metaFile, tag) {
        point = {
            x: radius * Math.sin(longitude) * Math.cos(latitude),
            y: radius * Math.sin(longitude) * Math.sin(latitude),
            z: radius * Math.cos(longitude),
            data: {
                raw:   dataFile,
                meta:  metaFile,
                extra: tag 
            }
        }


    }

    addLocation = function() {
    }

    rebuildTree();
}

