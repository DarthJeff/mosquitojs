var testModule = window.mosquito.module('testModule', []);

module.exports = {
    'Test module created successfully' : function(test) {
        test.notEqual(testModule.controller, null);
        test.done();
    },
    'Test module returned successfully' : function(test) {
        var testModule2 = window.mosquito.module('testModule');
        test.notEqual(testModule2.controller, null);
        test.done();
    },
    'Test when module not defined errors' : function(test) {
        test.throws(function(){ window.mosquito.module('testModule2'); }, 'Module undefined: testModule2');
        test.done();
    },
    'Test when module already defined errors' : function(test) {
        test.throws(function(){ window.mosquito.module('testModule', []); }, 'Module already defined: testModule');
        test.done();
    },
    'Test module with dependent existing module created successfully' : function(test) {
        var testModule2 = window.mosquito.module('testModule2', ['testModule']);
        test.notEqual(testModule2.controller, null);
        test.done();
    },
    'Test module with dependent nonexisting module errors' : function(test) {
        test.throws(function(){ window.mosquito.module('testModule2', ['testModule3']); }, 'Error defining module: testModule2');
        test.done();
    }
};
