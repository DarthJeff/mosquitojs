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
        var observableInterfaceMethods = [];

        function getService(serviceName){
            for(var index = 0; index < moduleDependents.length; index++){
                var service = moduleDependents[index].service(serviceName);
                if(service !== undefined) {
                    if(service.instance === undefined){
                        if(service.serviceType === serviceType.service) {
                            service.instance = constructNewServiceMethodInstance(service);
                        } else {
                            service.instance = constructServiceMethod(service);
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

        function constructServiceMethod(service) {
            if(service.observableInterfaces !== undefined){
                for(var i=0; i < service.observableInterfaces.length; i++){
                    var observableInterface = service.observableInterfaces[i];
                    if(observableInterfaceMethods[observableInterface] === undefined){
                        observableInterfaceMethods[observableInterface] = [];
                    }
                    observableInterfaceMethods[observableInterface].push(service);
                }
            }
            var injectionServices = constructInjectionServices(service.dependentServices);
            return service.constructor.apply(this, injectionServices);
        }

        function constructNewServiceMethodInstance(service) {
            return new constructServiceMethod(service);
        }

        function service(serviceType, serviceName, dependentServices, constructor, overwrite) {
            if(constructor){
                if(moduleServices[serviceName] !== undefined && !overwrite) { throw "Service already defined: " + serviceName; }
                var serviceData = {
                    'serviceType': serviceType,
                    'dependentServices': dependentServices,
                    'constructor': constructor
                };
                defineFromObservableInterfaceMethod(serviceData);
                return moduleServices[serviceName] = serviceData;
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

        function getObservableInterface(interfaceName, interfaceMethods){
            return function(){
                this.next = function(interfaceMethod, params){
                    if(interfaceMethods.indexOf(interfaceMethod) === -1) { throw "Observable method not declared: " + interfaceMethod; }
                    var observableInterfaceMethod = observableInterfaceMethods[interfaceName];
                    for(var i = 0; i < observableInterfaceMethod.length; i++){
                        if(observableInterfaceMethod[i].instance !== undefined){
                            observableInterfaceMethod[i].instance[interfaceMethod](params);
                        }
                    }
                };
            };
        }

        function defineFromObservableInterfaceMethod(service){
            service.fromObservableInterface = function(observableInterfaces){
                service.observableInterfaces = observableInterfaces;
            };
        }

        this.controller = function(controllerName, constructor){
            if(constructor){
                if(moduleControllers[controllerName] !== undefined) { throw "Controller already defined: " + controllerName; }
                moduleControllers[controllerName] = getParametersFromConstructor(constructor);
                defineFromObservableInterfaceMethod(moduleControllers[controllerName]);
                return moduleControllers[controllerName];
            } else {
                if(moduleControllers[controllerName] === undefined) { throw "Controller undefined: " + controllerName; }
                if(moduleControllers[controllerName].instance === undefined){
                    moduleControllers[controllerName].instance = constructNewServiceMethodInstance(moduleControllers[controllerName]);
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
            var constructor = constructNewServiceMethodInstance(provider);
            var parameters = getParametersFromConstructor(constructor.$get);
            return service(serviceType.provider, providerName, parameters.dependentServices, parameters.constructor, true);
        };

        this.observableInterface = function(interfaceName, interfaceMethods){
            return service(serviceType.service, interfaceName, [], getObservableInterface(interfaceName, interfaceMethods));
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
                return(modules[moduleName] = new module(getModules(dependentModules)));
            }
            catch(err) {
                throw "Error defining module: " + moduleName + ' - ' + err;
            }
        } else {
            return getModule(moduleName);
        }
    };

})();
