# mosquitojs

Mosquitojs is an extremely light dependency injection library for JavaScript. Inspired by AngularJS, mosquitojs enables the easy creation of modules, controllers and services; thus facilitating clean reusable code within your JavaScript projects.

mosquitojs will only work in single page applications

To use mosquitojs, just drop a single JavaScript file into your page:

```html
<script src="mosquito.min.js"></script>
```
### Bower
```bash
bower install mosquitojs
```

## Module

A module is a collection of controllers and services. Modules can be injected into other modules to create a component based architecture.

```bash
mosquito.module(name, [requires]);
```

It is imperative that modules are loaded in order.

### Define a Module
```javascript
mosquito.module('module2', []);
mosquito.module('module1', ['module2']);
```
### Access a Module
```javascript
var module = mosquito.module('module2');
```

## Controller

A controller is a static method for interfacing with none mosquitojs areas of code. For example a controller could be called upon page load.

```bash
module.controller(name, constructor);
```

Controllers do not have to be loaded in order.

### Define a Controller
```javascript
mosquito.module('module1').controller('pageController', function() { });
```
### Define a Controller with service injectors
```javascript
mosquito.module('module1').controller('pageController', ['service1', function(service1) { }]);
```
### Execute a Controller
```javascript
mosquito.module('module1').controller('pageController');
```

## Service

A service is a static instance of a method for utilising code reuse and seperation of concerns. Services can injected into other services and controllers. There a three types of service; factory, provider and service. This is the basic service implementation which returns a new instance of the contructor.

The constructor of a service is called upon first use.

```bash
module.service(name, constructor);
```

Services do not have to be loaded in order.

### Define a Service
```javascript
mosquito.module('module1').service('service1', function() {
  this.callMe = function() { };
});
```
### Define a Service with other service injectors
```javascript
mosquito.module('module1').service('servcie1', ['service2', function(service2) {
  this.callMe = service2.callMe;
}]);
```

## Factory

A factory is a service which returns an object. Unlike the basic service above, a new instance of this object is not automatically created, leaving this choice to the user.

The constructor of a service is called upon first use.

```bash
module.factory(name, constructor);
```

Factories do not have to be loaded in order.

### Define a Factory
```javascript
mosquito.module('module1').factory('factory1', function() {
  return {
    getValue: function(){ return 1; }
  };
});
```
### Define a Factory with other service injectors
```javascript
mosquito.module('module1').factory('factory1', ['service1', function(service1) {
  return {
    getValue: function(){ return 1; }
  };
}]);
```

## Provider

A provider is a special kind of factory. Unlike other service types, a providers constructor is executed immediately upon creation. A special method called $get is then used as a additional constructor, using the same rules as a factory, and executed upon first use.

```bash
module.provider(name, constructor);
```

Providers do not have to be loaded in order.

### Define a Provider
```javascript
mosquito.module('module1').provider('provider1', function() {
  this.$get = function() {
    return {
      getValue: function(){ return 1; }
    };
  };
});
```
### Define a Provider with other service injectors
```javascript
mosquito.module('module1').provider('provider1', function() {
  this.$get = ['service1', function(service1) {
    return {
      getValue: function(){ return 1; }
    };
  }];
});
```

## Run

A run is a special kind of service that is executed immediately upon the HTML page being loaded. These services should be used as the entry point into your JavaScript project.

```bash
module.run(constructor);
```

Multiple run services can be defined for each module and they will all be executed as soon as the HTML page has loaded. As they have no identifying names, they cannot be injected into other services.

### Define a Run
```javascript
mosquito.module('module1').run(function() {
  console.log('The page has loaded');
});
```

## Observable Interface

The observable interface simplifies the use of the observer pattern within mosquitojs services and controllers.

### Define an Observable Interface
```bash
module.observableInterface(name, methods);
```
An observable interface is first defined with an identifyable name and either a single or list of methods to be observed.
```javascript
mosquito.module('module1').observableInterface('oiGameLoop', ['update', 'render']);
```

### Implement an Observable Interface
```bash
service.fromObservableInterface(observableInterfaces);
```
Appropriate controllers and services are then instructed to implement the required observable interfaces. It is important that the respective methods are then defined upon the appropriate controllers and services.
```javascript
mosquito.module('module1').service('service1', function(){
  this.update = function(params){ };
  this.render = function(params){ };
  this.mouseLeftDown = function(){ };
}).fromObservableInterface(['oiGameLoop', 'oiMouse']);
```
