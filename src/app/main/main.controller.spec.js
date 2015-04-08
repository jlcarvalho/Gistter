'use strict';

describe('controllers', function(){
  var scope;

  beforeEach(module('gistter'));

  beforeEach(inject(function($rootScope) {
    scope = $rootScope.$new();
  }));

});
