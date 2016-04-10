/*jslint browser:true */
'use strict';

var mosquito = function() {};

mosquito.prototype = {
    internal: {
        modules: [],
        mosquitoModule: function(dependentModules) {
            this.internal.moduleSelf = this;
            this.internal.dependentModules = dependentModules;
        }
    },
    module: function(moduleName, dependentModules) {
        if(dependentModules) {
            if(this.internal.modules[moduleName] !== undefined) { throw "Module already defined: " + moduleName; }
            return(this.internal.modules[moduleName] = new this.internal.mosquitoModule(dependentModules));
        } else {
            if(this.internal.modules[moduleName] === undefined) { throw "Module undefined: " + moduleName; }
            return this.internal.modules[moduleName];
        }
    }
};
