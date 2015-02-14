Object.values = obj => Object.keys(obj).map(key => obj[key]);
Array.prototype.min = function() { return Math.min.apply(null, this); };
Array.prototype.diff = function(a) {
    return this.filter(function(i) {return i!=a;});
};

