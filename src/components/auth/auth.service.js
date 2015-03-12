/**
 * Created by JeanLucas on 11/03/2015.
 */
'use strict';
/*jshint esnext: true */

class Auth {
  constructor ($http, $q) {
    this.http = $http;
    this.promise = $q;
  }

  getToken (code) {
    var deferred = this.promise.defer();
    this.http.get('http://localhost:9999/authenticate/'+code).success(function (data) {
      deferred.resolve(data);
    });
    return deferred.promise;
  }
}

Auth.$inject = ['$http', '$q'];

export default Auth;
