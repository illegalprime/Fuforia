var mongoose = require('mongoose');

var VuTargetSchema = mongoose.Schema({
    data:  String,
    meta:  String,
    loc:   {
        longitude: Number,
        latitude:  Number
    },
    extra: Object
})
exports.VuTarget = mongoose.model('vutarget', VuTargetSchema);

var QuadTreeSchema = mongoose.Schema();
QuadTreeSchema.add({
    items:    [ { type: mongoose.Schema.Types.ObjectId, ref: 'VuTargetSchema' } ],
    children: [ { type: mongoose.Schema.Types.ObjectId, ref: 'QuadTreeSchema' } ],
    bbox: {
        min: {
            longitude: Number,
            latitude:  Number
        },
        max: {
            longitude: Number,
            latitude:  Number
       }
    }
})

// points is an array of long/lat coords
// these coords are simply an array of length 2
// coords: [ long, lat ]
QuadTreeSchema.methods.canFit = function(points) {
    for (var i = 0; i < points.length; ++i) {
        if (points[i].longitude <= this.bbox.min.longitude
         || points[i].longitude >= this.bbox.max.longitude
         || points[i].latitude  <= this.bbox.min.latitude
         || points[i].latitude  >= this.bbox.max.latitude) {
            return false;
        }
    }
    return true;
}

exports.QuadTree = mongoose.model('QuadTree', QuadTreeSchema);
