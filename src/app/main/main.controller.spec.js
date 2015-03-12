'use strict';

describe('controllers', function(){
  var scope;

  beforeEach(module('coder'));

  beforeEach(inject(function($rootScope) {
    scope = $rootScope.$new();
  }));

});
