var kd  = require('kdtree');
var fs  = require('fs');
var xml = require('xml2js');

exports.FuServer = function(loadfile) {
    this.serializedFile = loadfile;

    var kdTree  = new kd.KDTree(3);
    var parser  = new xml.Parser();
    var builder = new xml.Builder();
    var delim   = '----POINT----';
    var radius  = 637100000;
    var loaded  = false;

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
                return;
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

    this.addImage = function(longitude, latitude, id, metaFile, tag) {
        var point = geoToCartesian(longitude, latitude);
        point.data = {
            id:    id,
            meta:  metaFile,
            extra: tag
        };
        kdTree.insert(point.x, point.y, point.x, point.data);
        addToBackup(point, this.serializedFile);
    };

    this.getVisibleImages = function(longitude, latitude, range, callback) {
        var point     = geoToCartesian(longitude, latitude);
        var neighbors = kdTree.nearestRange(point.x, point.y, point.z, range);
        var currXML   = JSON.parse(VuforiaXML);
        var meta      = {};
        var count     = 0;

        for (i in neighbors) {
            neighbor = neighbors[i][3];
            meta[neighbor.id] = neighbor.extra;

            fs.readFile(neighbor.meta, 'utf8', function(err, data) {
                if (err) {
                    if (++count == neighbors.length) {
                        callback("", {});
                    }
                    return;
                }
                parser.parseString(data, function(err, results) {
                    if (err) {
                        if (++count == neighbors.length) {
                            callback("", {});
                        }
                        return;
                    }
                    var trackers = results.QCARConfig.Tracking;

                    for (j in trackers) {
                        currXML.QCARConfig.Tracking[0].ImageTarget =
                            currXML.QCARConfig.Tracking[0].ImageTarget
                                .concat(trackers[j].ImageTarget);
                    }

                    if (++count == neighbors.length) {
                        callback(builder.buildObject(currXML), meta);
                    }
                });
            });
        }
    };

    this.isLoaded = function() {
        return loaded;
    };

    var VuforiaXML = '{                                                   \
        "QCARConfig": {                                                   \
            "$": {                                                        \
                "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance", \
                "xsi:noNamespaceSchemaLocation": "qcar_config.xsd"        \
            },                                                            \
            "Tracking": [ { "ImageTarget": [ ] } ]                        \
        }                                                                 \
    }';
}
