/*jslint browser:true */
'use strict';

var mosquito = window['mosquito'];
var mosquitoModule = mosquito.prototype.internal.mosquitoModule;

mosquitoModule.prototype = {
    internal: {
        moduleServices: [],
        moduleControllers: [],
        extend: function() {},
        preConstructServiceMethod: function() {},
        constructNewServiceMethodInstance: function(service) {
            return new this.constructServiceMethod(service, this);
        },
        constructServiceMethod: function(service, mInternal) {
            var internal = mInternal || this;
            internal.preConstructServiceMethod(service);
            var injectionServices = constructInjectionServices(service.dependentServices);
            return service.constructor.apply(this, injectionServices);

            function constructInjectionServices(serviceNames) {
                var injectionServices = [];
                for (var index = 0; index < serviceNames.length; index++) {
                    injectionServices.push(getService(serviceNames[index]));
                }
                return injectionServices;

                function getService(serviceName) {
                    setModuleDependents();
                    for(var index = 0; index < internal.moduleDependents.length; index++) {
                        var service = internal.moduleDependents[index].service(serviceName);
                        if(service !== undefined) {
                            if(service.instance === undefined) {
                                if(service.isNewableServiceType) {
                                    service.instance = internal.constructNewServiceMethodInstance(service);
                                } else {
                                    service.instance = internal.constructServiceMethod(service);
                                }
                            }
                        }
                        return service.instance;
                    }

                    function setModuleDependents() {
                        if(internal.moduleDependents === undefined) {
                            internal.moduleDependents = [internal.moduleSelf];
                            for(var moduleIndex = 0; moduleIndex < internal.dependentModules.length; moduleIndex++) {
                                internal.moduleDependents.push(mosquito.internal.modules[internal.dependentModules[moduleIndex]]);
                            }
                        }
                    }
                    throw "Service undefined: " + serviceName;
                }
            }
        },
        asArray: function(object) {
            if(object instanceof Array === false) {
                object = [object];
            }
            return object;
        }
    }
};
