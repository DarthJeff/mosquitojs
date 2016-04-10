'use strict';

var mosquitoModule = mosquito.prototype.internal.mosquitoModule;

mosquitoModule.prototype.internal.extend = function(service) {
    var internal = this;
    service.fromObservableInterface = function(observableInterfaces) {
        observableInterfaces = internal.asArray(observableInterfaces);
        service.observableInterfaces = observableInterfaces;
    };
};

mosquitoModule.prototype.internal.preConstructServiceMethod = function(service) {
    if(service.observableInterfaces !== undefined){
        for(var index = 0; index < service.observableInterfaces.length; index++) {
            var observableInterface = service.observableInterfaces[index];
            if(mosquito.internal.observableInterfaceMethods[observableInterface] === undefined) {
                mosquito.internal.observableInterfaceMethods[observableInterface] = [];
            }
            mosquito.internal.observableInterfaceMethods[observableInterface].push(service);
        }
    }
};

mosquitoModule.prototype.observableInterface = function(interfaceName, interfaceMethods) {
    var internal = this.internal;
    return this.internal.mosquitoService(true, interfaceName, [], getObservableInterface(interfaceName, interfaceMethods));

    function getObservableInterface(interfaceName, interfaceMethods) {
        interfaceMethods = internal.asArray(interfaceMethods);

        if(!mosquito.internal.observableInterfaceMethods) {
            mosquito.internal.observableInterfaceMethods = [];
        }

        return function() {
            this.next = function(interfaceMethod, params) {
                if(interfaceMethods.indexOf(interfaceMethod) === -1) { throw "Observable method not declared: " + interfaceMethod; }
                var observableInterfaceMethods = mosquito.internal.observableInterfaceMethods;
                var observableInterfaceMethod = observableInterfaceMethods[interfaceName];
                if(observableInterfaceMethod !== undefined) {
                    for(var i = 0; i < observableInterfaceMethod.length; i++) {
                        if(observableInterfaceMethod[i].instance !== undefined && observableInterfaceMethod[i].instance[interfaceMethod] !== undefined) {
                            observableInterfaceMethod[i].instance[interfaceMethod](params);
                        }
                    }
                }
            };
        };
    }
};
