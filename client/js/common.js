Object.values = function(obj) { return Object.keys(obj).map(function(key) { return obj[key]; }); };
Array.prototype.min = function() { return Math.min.apply(null, this); };
Array.prototype.diff = function(a) {
    return this.filter(function(i) {return i!=a;});
};
Array.prototype.unique = function () {
    var r = new Array();
    o:for(var i = 0, n = this.length; i < n; i++)
    {
    	for(var x = 0, y = r.length; x < y; x++)
    	{
    		if(r[x]==this[i])
    		{
//                alert('this is a DUPE!');
    			continue o;
    		}
    	}
    	r[r.length] = this[i];
    }
    return r;
};
