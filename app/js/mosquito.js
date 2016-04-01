/*jslint browser:true */
'use strict';

window['mosquito'] = new (function() {
    var runMethods = [];
    var modules = [];
    var observableInterfaceMethods = [];
    var serviceType = {
        'service': 1,
        'factory': 2,
        'provider': 3,
        'observableInterface': 4
    };

    function module(dependentModules) {
        var moduleSelf = this;
        var moduleDependents;
        var moduleControllers = [];
        var moduleServices = [];

        function getService(serviceName) {
            if(moduleDependents === undefined) {
                moduleDependents = [moduleSelf];
                for(var moduleIndex = 0; moduleIndex < dependentModules.length; moduleIndex++) {
                    moduleDependents.push(modules[dependentModules[moduleIndex]]);
                }
            }
            for(var index = 0; index < moduleDependents.length; index++) {
                var service = moduleDependents[index].service(serviceName);
                if(service !== undefined) {
                    if(service.instance === undefined) {
                        switch(service.serviceType) {
                            case serviceType.service:
                            case serviceType.observableInterface:
                                service.instance = constructNewServiceMethodInstance(service);
                                break;
                            default:
                                service.instance = constructServiceMethod(service);
                                break;
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
                for(var index = 0; index < service.observableInterfaces.length; index++) {
                    var observableInterface = service.observableInterfaces[index];
                    if(observableInterfaceMethods[observableInterface] === undefined) {
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
            if(constructor) {
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

        function getObservableInterface(interfaceName, interfaceMethods) {
            interfaceMethods = asArray(interfaceMethods);
            return function() {
                this.next = function(interfaceMethod, params) {
                    if(interfaceMethods.indexOf(interfaceMethod) === -1) { throw "Observable method not declared: " + interfaceMethod; }
                    var observableInterfaceMethod = observableInterfaceMethods[interfaceName];
                    if(observableInterfaceMethod !== undefined) {
                        for(var i = 0; i < observableInterfaceMethod.length; i++) {
                            if(observableInterfaceMethod[i].instance !== undefined) {
                                observableInterfaceMethod[i].instance[interfaceMethod](params);
                            }
                        }
                    }
                };
            };
        }

        function defineFromObservableInterfaceMethod(service) {
            service.fromObservableInterface = function(observableInterfaces){
                observableInterfaces = asArray(observableInterfaces);
                service.observableInterfaces = observableInterfaces;
            };
        }

        function asArray(object) {
            if(object instanceof Array === false) {
                object = [object];
            }
            return object;
        }

        this.controller = function(controllerName, constructor) {
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

        this.service = function(serviceName, constructor) {
            var parameters = getParametersFromConstructor(constructor);
            return service(serviceType.service, serviceName, parameters.dependentServices, parameters.constructor);
        };

        this.factory = function(factoryName, constructor) {
            var parameters = getParametersFromConstructor(constructor);
            return service(serviceType.factory, factoryName, parameters.dependentServices, parameters.constructor);
        };

        this.provider = function(providerName, providerFunction) {
            var provider = service(serviceType.provider, providerName, [], providerFunction);
            var constructor = constructNewServiceMethodInstance(provider);
            var parameters = getParametersFromConstructor(constructor.$get);
            return service(serviceType.provider, providerName, parameters.dependentServices, parameters.constructor, true);
        };

        this.observableInterface = function(interfaceName, interfaceMethods) {
            return service(serviceType.observableInterface, interfaceName, [], getObservableInterface(interfaceName, interfaceMethods));
        };

        this.run = function(constructor) {
            if(constructor === undefined) { throw "Run method undefined"; }
            var parameters = getParametersFromConstructor(constructor);
            runMethods.push(parameters);
            if(runMethods.length === 1){
                document.onreadystatechange = function() {
                    if(document.readyState === 'complete') {
                        for(var i = 0; i < runMethods.length; i++) {
                            constructServiceMethod(runMethods[i]);
                        }
                    }
                };
            }
        };
    }

    this.module = function(moduleName, dependentModules) {
        if(dependentModules) {
            if(modules[moduleName] !== undefined) { throw "Module already defined: " + moduleName; }
            return(modules[moduleName] = new module(dependentModules));
        } else {
            if(modules[moduleName] === undefined) { throw "Module undefined: " + moduleName; }
            return modules[moduleName];
        }
    };

})();
