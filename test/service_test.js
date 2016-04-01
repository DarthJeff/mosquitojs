var testModule = window.mosquito.module('testServiceModule', []);
var testService = testModule.service('testService', function() {});

module.exports = {
    'Test service created successfully' : function(test) {
        test.notEqual(testService.constructor);
        test.done();
    },
    'Test service already defined errors' : function(test) {
        test.throws(function(){ testModule.service('testService', function() {}); }, 'Service already defined: testService');
        test.done();
    }
};
