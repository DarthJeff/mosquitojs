///*jslint browser:true */
//'use strict';

//var mosquito = function() {};
//
//mosquito.prototype = {
//    internal: {
//        modules: [],
//        mosquitoModule: function(dependentModules) {
//            this.internal.moduleSelf = this;
//            this.internal.dependentModules = dependentModules;
//        }
//    },
//    module: function(moduleName, dependentModules) {
//        if(dependentModules) {
//            if(this.internal.modules[moduleName] !== undefined) { throw "Module already defined: " + moduleName; }
//            return(this.internal.modules[moduleName] = new this.internal.mosquitoModule(dependentModules));
//        } else {
//            if(this.internal.modules[moduleName] === undefined) { throw "Module undefined: " + moduleName; }
//            return this.internal.modules[moduleName];
//        }
//    }
//};





//var mosquitoModule = mosquito.prototype.internal.mosquitoModule;
//mosquitoModule.prototype = {
//    internal: {
//        moduleServices: [],
//        moduleControllers: [],
//        preConstructServiceMethod: function(service) {},
//        constructNewServiceMethodInstance: function(service) {
//            return new this.constructServiceMethod(service, this);
//        },
//        constructServiceMethod: function(service, internal) {
//            var internal = internal || this;
//            internal.preConstructServiceMethod(service);
//            var injectionServices = constructInjectionServices(service.dependentServices);
//            return service.constructor.apply(this, injectionServices);
//
//            function constructInjectionServices(serviceNames) {
//                var injectionServices = [];
//                for (var index = 0; index < serviceNames.length; index++) {
//                    injectionServices.push(getService(serviceNames[index]));
//                }
//                return injectionServices;
//
//                function getService(serviceName) {
//                    setModuleDependents();
//                    for(var index = 0; index < internal.moduleDependents.length; index++) {
//                        var service = internal.moduleDependents[index].service(serviceName);
//                        if(service !== undefined) {
//                            if(service.instance === undefined) {
//                                if(service.isNewableServiceType) {
//                                    service.instance = internal.constructNewServiceMethodInstance(service);
//                                } else {
//                                    service.instance = internal.constructServiceMethod(service);
//                                }
//                            }
//                        }
//                        return service.instance;
//                    }
//
//                    function setModuleDependents() {
//                        if(internal.moduleDependents === undefined) {
//                            internal.moduleDependents = [internal.moduleSelf];
//                            for(var moduleIndex = 0; moduleIndex < internal.dependentModules.length; moduleIndex++) {
//                                internal.moduleDependents.push(modules[internal.dependentModules[moduleIndex]]);
//                            }
//                        }
//                    }
//                }
//                throw "Service undefined: " + serviceName;
//            }
//        },
//        asArray: function(object) {
//            if(object instanceof Array === false) {
//                object = [object];
//            }
//            return object;
//        }
//    }
//};




//var mosquitoModule = mosquito.prototype.internal.mosquitoModule;

//mosquitoModule.prototype.internal.extend = function(service) {};

//mosquitoModule.prototype.internal.extend = function(service) {
//    var internal = this;
//    service.fromObservableInterface = function(observableInterfaces) {
//        observableInterfaces = internal.asArray(observableInterfaces);
//        service.observableInterfaces = observableInterfaces;
//    };
//};

//mosquitoModule.prototype.internal.mosquitoService = function(isNewableServiceType, serviceName, dependentServices, constructor, overwrite) {
//    if(constructor) {
//        if(this.moduleServices[serviceName] !== undefined && !overwrite) { throw "Service already defined: " + serviceName; }
//        var serviceData = {
//            'isNewableServiceType': isNewableServiceType,
//            'dependentServices': dependentServices,
//            'constructor': constructor
//        };
//        this.extend(serviceData);
//        return this.moduleServices[serviceName] = serviceData;
//    } else {
//        return this.moduleServices[serviceName];
//    }
//};
//
//mosquitoModule.prototype.internal.getParametersFromConstructor = function(constructor) {
//    var parameters = {
//        'dependentServices': [],
//        'constructor': constructor
//    };
//    if(constructor instanceof Array) {
//        parameters.constructor = constructor.pop();
//        parameters.dependentServices = constructor;
//    }
//    return parameters;
//};
//
//mosquitoModule.prototype.internal.addService = function(serviceName, constructor, isNewableServiceType, overwrite) {
//    var parameters = this.getParametersFromConstructor(constructor);
//    return this.mosquitoService(
//        isNewableServiceType || false,
//        serviceName,
//        parameters.dependentServices,
//        parameters.constructor,
//        overwrite || false)
//};
//
//mosquitoModule.prototype.service = function(serviceName, constructor) {
//    return this.internal.addService(serviceName, constructor, true);
//};
//
//mosquitoModule.prototype.factory = function(factoryName, constructor) {
//    return this.internal.addService(factoryName, constructor);
//};
//
//mosquitoModule.prototype.provider = function(providerName, providerFunction) {
//    var provider = this.internal.mosquitoService(false, providerName, [], providerFunction);
//    var constructor = this.internal.constructNewServiceMethodInstance(provider);
//    return this.internal.addService(providerName, constructor.$get, false, true);
//};
//
//mosquitoModule.prototype.run = function(constructor) {
//    if(constructor === undefined) { throw "Run method undefined"; }
//    var parameters = this.internal.getParametersFromConstructor(constructor);
//    var runMethods = mosquito.runMethods;
//    if(!runMethods) {
//        mosquito.runMethods = runMethods = [];
//    }
//    runMethods.push(parameters);
//    if(runMethods.length === 1){
//        var internal = this.internal;
//        document.onreadystatechange = function() {
//            if(document.readyState === 'complete') {
//                for(var i = 0; i < runMethods.length; i++) {
//                    internal.constructServiceMethod(runMethods[i], internal);
//                }
//            }
//        };
//    }
//};
//
//mosquitoModule.prototype.controller = function(controllerName, constructor) {
//    if(constructor){
//        if(this.internal.moduleControllers[controllerName] !== undefined) { throw "Controller already defined: " + controllerName; }
//        this.internal.moduleControllers[controllerName] = this.internal.getParametersFromConstructor(constructor);
//        this.internal.extend(this.internal.moduleControllers[controllerName]);
//        return this.internal.moduleControllers[controllerName];
//    } else {
//        if(this.internal.moduleControllers[controllerName] === undefined) { throw "Controller undefined: " + controllerName; }
//        if(this.internal.moduleControllers[controllerName].instance === undefined){
//            this.internal.moduleControllers[controllerName].instance = this.internal.constructNewServiceMethodInstance(this.internal.moduleControllers[controllerName]);
//        }
//        return this.internal.moduleControllers[controllerName].instance;
//    }
//};







//mosquitoModule.prototype.internal.preConstructServiceMethod = function(service) {
//    if(service.observableInterfaces !== undefined){
//        for(var index = 0; index < service.observableInterfaces.length; index++) {
//            var observableInterface = service.observableInterfaces[index];
//            if(mosquito.internal.observableInterfaceMethods[observableInterface] === undefined) {
//                mosquito.internal.observableInterfaceMethods[observableInterface] = [];
//            }
//            mosquito.internal.observableInterfaceMethods[observableInterface].push(service);
//        }
//    }
//};

//mosquitoModule.prototype.observableInterface = function(interfaceName, interfaceMethods) {
//    var internal = this.internal;
//    return this.internal.mosquitoService(true, interfaceName, [], getObservableInterface(interfaceName, interfaceMethods));
//
//    function getObservableInterface(interfaceName, interfaceMethods) {
//        interfaceMethods = internal.asArray(interfaceMethods);
//
//        if(!mosquito.internal.observableInterfaceMethods) {
//            mosquito.internal.observableInterfaceMethods = [];
//        }
//
//        return function() {
//            this.next = function(interfaceMethod, params) {
//                if(interfaceMethods.indexOf(interfaceMethod) === -1) { throw "Observable method not declared: " + interfaceMethod; }
//                var observableInterfaceMethods = mosquito.internal.observableInterfaceMethods;
//                var observableInterfaceMethod = observableInterfaceMethods[interfaceName];
//                if(observableInterfaceMethod !== undefined) {
//                    for(var i = 0; i < observableInterfaceMethod.length; i++) {
//                        if(observableInterfaceMethod[i].instance !== undefined && observableInterfaceMethod[i].instance[interfaceMethod] !== undefined) {
//                            observableInterfaceMethod[i].instance[interfaceMethod](params);
//                        }
//                    }
//                }
//            };
//        };
//    }
//};








//window['mosquito'] = new mosquito();
//
//(function(){
//    console.log('==========================');
//})();

//
//window['mosquito'] = new (function() {
//    var runMethods = [];
//    var modules = [];
//    var observableInterfaceMethods = [];
//    var serviceType = {
//        'service': 1,
//        'factory': 2,
//        'provider': 3,
//        'observableInterface': 4
//    };
//
//    function module(dependentModules) {
//        var moduleSelf = this;
//        var moduleDependents;
//        var moduleControllers = [];
//        var moduleServices = [];
//
//        function getService(serviceName) {
//            if(moduleDependents === undefined) {
//                moduleDependents = [moduleSelf];
//                for(var moduleIndex = 0; moduleIndex < dependentModules.length; moduleIndex++) {
//                    moduleDependents.push(modules[dependentModules[moduleIndex]]);
//                }
//            }
//            for(var index = 0; index < moduleDependents.length; index++) {
//                var service = moduleDependents[index].service(serviceName);
//                if(service !== undefined) {
//                    if(service.instance === undefined) {
//                        switch(service.serviceType) {
//                            case serviceType.service:
//                            case serviceType.observableInterface:
//                                service.instance = constructNewServiceMethodInstance(service);
//                                break;
//                            default:
//                                service.instance = constructServiceMethod(service);
//                                break;
//                        }
//                    }
//                    return service.instance;
//                }
//            }
//            throw "Service undefined: " + serviceName;
//        }
//
//        function constructInjectionServices(serviceNames) {
//            var injectionServices = [];
//            for (var index = 0; index < serviceNames.length; index++) {
//                injectionServices.push(getService(serviceNames[index]));
//            }
//            return injectionServices;
//        }
//
//        function constructServiceMethod(service) {
//            if(service.observableInterfaces !== undefined){
//                for(var index = 0; index < service.observableInterfaces.length; index++) {
//                    var observableInterface = service.observableInterfaces[index];
//                    if(observableInterfaceMethods[observableInterface] === undefined) {
//                        observableInterfaceMethods[observableInterface] = [];
//                    }
//                    observableInterfaceMethods[observableInterface].push(service);
//                }
//            }
//            var injectionServices = constructInjectionServices(service.dependentServices);
//            return service.constructor.apply(this, injectionServices);
//        }
//
//        function constructNewServiceMethodInstance(service) {
//            return new constructServiceMethod(service);
//        }
//
//        function service(serviceType, serviceName, dependentServices, constructor, overwrite) {
//            if(constructor) {
//                if(moduleServices[serviceName] !== undefined && !overwrite) { throw "Service already defined: " + serviceName; }
//                var serviceData = {
//                    'serviceType': serviceType,
//                    'dependentServices': dependentServices,
//                    'constructor': constructor
//                };
//                defineFromObservableInterfaceMethod(serviceData);
//                return moduleServices[serviceName] = serviceData;
//            } else {
//                return moduleServices[serviceName];
//            }
//        }
//
//        function getParametersFromConstructor(constructor) {
//            var parameters = {
//                'dependentServices': [],
//                'constructor': constructor
//            };
//            if(constructor instanceof Array) {
//                parameters.constructor = constructor.pop();
//                parameters.dependentServices = constructor;
//            }
//            return parameters;
//        }
//
//        function getObservableInterface(interfaceName, interfaceMethods) {
//            interfaceMethods = asArray(interfaceMethods);
//            return function() {
//                this.next = function(interfaceMethod, params) {
//                    if(interfaceMethods.indexOf(interfaceMethod) === -1) { throw "Observable method not declared: " + interfaceMethod; }
//                    var observableInterfaceMethod = observableInterfaceMethods[interfaceName];
//                    if(observableInterfaceMethod !== undefined) {
//                        for(var i = 0; i < observableInterfaceMethod.length; i++) {
//                            if(observableInterfaceMethod[i].instance !== undefined && observableInterfaceMethod[i].instance[interfaceMethod] !== undefined) {
//                                observableInterfaceMethod[i].instance[interfaceMethod](params);
//                            }
//                        }
//                    }
//                };
//            };
//        }
//
//        function defineFromObservableInterfaceMethod(service) {
//            service.fromObservableInterface = function(observableInterfaces){
//                observableInterfaces = asArray(observableInterfaces);
//                service.observableInterfaces = observableInterfaces;
//            };
//        }
//
//        function asArray(object) {
//            if(object instanceof Array === false) {
//                object = [object];
//            }
//            return object;
//        }
//
//        this.controller = function(controllerName, constructor) {
//            if(constructor){
//                if(moduleControllers[controllerName] !== undefined) { throw "Controller already defined: " + controllerName; }
//                moduleControllers[controllerName] = getParametersFromConstructor(constructor);
//                defineFromObservableInterfaceMethod(moduleControllers[controllerName]);
//                return moduleControllers[controllerName];
//            } else {
//                if(moduleControllers[controllerName] === undefined) { throw "Controller undefined: " + controllerName; }
//                if(moduleControllers[controllerName].instance === undefined){
//                    moduleControllers[controllerName].instance = constructNewServiceMethodInstance(moduleControllers[controllerName]);
//                }
//                return moduleControllers[controllerName].instance;
//            }
//        };
//
//        this.service = function(serviceName, constructor) {
//            var parameters = getParametersFromConstructor(constructor);
//            return service(serviceType.service, serviceName, parameters.dependentServices, parameters.constructor);
//        };
//
//        this.factory = function(factoryName, constructor) {
//            var parameters = getParametersFromConstructor(constructor);
//            return service(serviceType.factory, factoryName, parameters.dependentServices, parameters.constructor);
//        };
//
//        this.provider = function(providerName, providerFunction) {
//            var provider = service(serviceType.provider, providerName, [], providerFunction);
//            var constructor = constructNewServiceMethodInstance(provider);
//            var parameters = getParametersFromConstructor(constructor.$get);
//            return service(serviceType.provider, providerName, parameters.dependentServices, parameters.constructor, true);
//        };
//
//        this.observableInterface = function(interfaceName, interfaceMethods) {
//            return service(serviceType.observableInterface, interfaceName, [], getObservableInterface(interfaceName, interfaceMethods));
//        };
//
//        this.run = function(constructor) {
//            if(constructor === undefined) { throw "Run method undefined"; }
//            var parameters = getParametersFromConstructor(constructor);
//            runMethods.push(parameters);
//            if(runMethods.length === 1){
//                document.onreadystatechange = function() {
//                    if(document.readyState === 'complete') {
//                        for(var i = 0; i < runMethods.length; i++) {
//                            constructServiceMethod(runMethods[i]);
//                        }
//                    }
//                };
//            }
//        };
//    }
//
//    this.module = function(moduleName, dependentModules) {
//        if(dependentModules) {
//            if(modules[moduleName] !== undefined) { throw "Module already defined: " + moduleName; }
//            return(modules[moduleName] = new module(dependentModules));
//        } else {
//            if(modules[moduleName] === undefined) { throw "Module undefined: " + moduleName; }
//            return modules[moduleName];
//        }
//    };
//
//})();
