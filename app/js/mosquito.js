'use strict';

window['mosquito'] = new (function() {
    var modules = [];
    var serviceType = {
        'service': 1,
        'factory': 2,
        'provider': 3
    };

    function module(dependentModules){
        dependentModules.push(this);
        var moduleDependents = dependentModules;
        var moduleControllers = [];
        var moduleServices = [];

        function getService(serviceName){
            for(var index = 0; index < moduleDependents.length; index++){
                var service = moduleDependents[index].service(serviceName);
                if(service !== undefined) {
                    if(service.instance === undefined){
                        if(service.serviceType === serviceType.service) {
                            service.instance = constructNewServiceMethodInstance(service.constructor, service.dependentServices);
                        } else {
                            service.instance = constructServiceMethod(service.constructor, service.dependentServices);
                        }
                    }
                    return service.instance;
                }
            }
            throw "Service undefined: " + serviceName;
        }

        function constructInjectionServices(serviceNames) {
            var injectionServices = [];
            for (var index = 0; index < serviceNames.length; index++) {
                injectionServices.push(getService(serviceNames[index]));
            }
            return injectionServices;
        }

        function constructServiceMethod(serviceConstructor, serviceNames) {
            var injectionServices = constructInjectionServices(serviceNames);
            return serviceConstructor.apply(this, injectionServices);
        }

        function constructNewServiceMethodInstance(serviceConstructor, serviceNames) {
            return new constructServiceMethod(serviceConstructor, serviceNames);
        }

        function service(serviceType, serviceName, dependentServices, constructor, overwrite) {
            if(constructor){
                if(moduleServices[serviceName] !== undefined && !overwrite) { throw "Service already defined: " + serviceName; }
                return moduleServices[serviceName] = {
                    'serviceType': serviceType,
                    'dependentServices': dependentServices,
                    'constructor' : constructor
                };
            } else {
                return moduleServices[serviceName];
            }
        }

        function getParametersFromConstructor(constructor) {
            var parameters = {
                'dependentServices': [],
                'constructor': constructor
            };
            if(constructor instanceof Array) {
                parameters.constructor = constructor.pop();
                parameters.dependentServices = constructor;
            }
            return parameters;
        }

        this.controller = function(controllerName, constructor){
            if(constructor){
                if(moduleControllers[controllerName] !== undefined) { throw "Controller already defined: " + controllerName; }
                moduleControllers[controllerName] = getParametersFromConstructor(constructor);
            } else {
                if(moduleControllers[controllerName] === undefined) { throw "Controller undefined: " + controllerName; }
                if(moduleControllers[controllerName].instance === undefined){
                    moduleControllers[controllerName].instance = constructNewServiceMethodInstance(moduleControllers[controllerName].constructor, moduleControllers[controllerName].dependentServices);
                }
                return moduleControllers[controllerName].instance;
            }
        };

        this.service = function(serviceName, constructor){
            var parameters = getParametersFromConstructor(constructor);
            return service(serviceType.service, serviceName, parameters.dependentServices, parameters.constructor);
        };

        this.factory = function(factoryName, constructor){
            var parameters = getParametersFromConstructor(constructor);
            return service(serviceType.factory, factoryName, parameters.dependentServices, parameters.constructor);
        };

        this.provider = function(providerName, providerFunction){
            var provider = service(serviceType.provider, providerName, [], providerFunction);
            var constructor = constructNewServiceMethodInstance(provider.constructor, provider.dependentServices);
            var parameters = getParametersFromConstructor(constructor.$get);
            return service(serviceType.provider, providerName, parameters.dependentServices, parameters.constructor, true);
        };
    }

    function getModule(moduleName) {
        if(modules[moduleName] === undefined) { throw "Module undefined: " + moduleName; }
        return modules[moduleName];
    }

    function getModules(moduleNames){
        var modules = [];
        for(var index = 0; index < moduleNames.length; index++){
            var moduleName = moduleNames[index];
            modules.push(getModule(moduleName));
        }
        return modules;
    }

    this.module = function(moduleName, dependentModules) {
        if(dependentModules) {
            if(modules[moduleName] !== undefined) { throw "Module already defined: " + moduleName; }
            try{
                modules[moduleName] = new module(getModules(dependentModules));
            }
            catch(err) {
                throw "Error defining module: " + moduleName + ' - ' + err;
            }
        } else {
            return getModule(moduleName);
        }
    };

})();
