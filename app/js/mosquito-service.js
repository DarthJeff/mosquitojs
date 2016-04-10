/*jslint browser:true */
'use strict';

var mosquito = window['mosquito'];
var mosquitoModule = mosquito.prototype.internal.mosquitoModule;

mosquitoModule.prototype.internal.mosquitoService = function(isNewableServiceType, serviceName, dependentServices, constructor, overwrite) {
    if(constructor) {
        if(this.moduleServices[serviceName] !== undefined && !overwrite) { throw "Service already defined: " + serviceName; }
        var serviceData = {
            'isNewableServiceType': isNewableServiceType,
            'dependentServices': dependentServices,
            'constructor': constructor
        };
        this.extend(serviceData);
        return this.moduleServices[serviceName] = serviceData;
    } else {
        return this.moduleServices[serviceName];
    }
};

mosquitoModule.prototype.internal.getParametersFromConstructor = function(constructor) {
    var parameters = {
        'dependentServices': [],
        'constructor': constructor
    };
    if(constructor instanceof Array) {
        parameters.constructor = constructor.pop();
        parameters.dependentServices = constructor;
    }
    return parameters;
};

mosquitoModule.prototype.internal.addService = function(serviceName, constructor, isNewableServiceType, overwrite) {
    var parameters = this.getParametersFromConstructor(constructor);
    return this.mosquitoService(
        isNewableServiceType || false,
        serviceName,
        parameters.dependentServices,
        parameters.constructor,
        overwrite || false);
};

mosquitoModule.prototype.service = function(serviceName, constructor) {
    return this.internal.addService(serviceName, constructor, true);
};

mosquitoModule.prototype.factory = function(factoryName, constructor) {
    return this.internal.addService(factoryName, constructor);
};

mosquitoModule.prototype.provider = function(providerName, providerFunction) {
    var provider = this.internal.mosquitoService(false, providerName, [], providerFunction);
    var constructor = this.internal.constructNewServiceMethodInstance(provider);
    return this.internal.addService(providerName, constructor.$get, false, true);
};

mosquitoModule.prototype.run = function(constructor) {
    if(constructor === undefined) { throw "Run method undefined"; }
    var parameters = this.internal.getParametersFromConstructor(constructor);
    var runMethods = mosquito.runMethods;
    if(!runMethods) {
        mosquito.runMethods = runMethods = [];
    }
    runMethods.push(parameters);
    if(runMethods.length === 1){
        var internal = this.internal;
        document.onreadystatechange = function() {
            if(document.readyState === 'complete') {
                for(var i = 0; i < runMethods.length; i++) {
                    internal.constructServiceMethod(runMethods[i], internal);
                }
            }
        };
    }
};

mosquitoModule.prototype.controller = function(controllerName, constructor) {
    if(constructor){
        if(this.internal.moduleControllers[controllerName] !== undefined) { throw "Controller already defined: " + controllerName; }
        this.internal.moduleControllers[controllerName] = this.internal.getParametersFromConstructor(constructor);
        this.internal.extend(this.internal.moduleControllers[controllerName]);
        return this.internal.moduleControllers[controllerName];
    } else {
        if(this.internal.moduleControllers[controllerName] === undefined) { throw "Controller undefined: " + controllerName; }
        if(this.internal.moduleControllers[controllerName].instance === undefined){
            this.internal.moduleControllers[controllerName].instance = this.internal.constructNewServiceMethodInstance(this.internal.moduleControllers[controllerName]);
        }
        return this.internal.moduleControllers[controllerName].instance;
    }
};
