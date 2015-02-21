Object.values = function(obj) { return Object.keys(obj).map(function(key) { return obj[key]; }); };
Array.prototype.min = function() { return Math.min.apply(null, this); };
Array.prototype.diff = function(a) {
    return this.filter(function(i) {return i!=a;});
};

