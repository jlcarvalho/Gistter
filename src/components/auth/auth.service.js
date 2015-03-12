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
    if(angular.isDefined(sessionStorage['token'])){
      deferred.resolve(true);
    } else {
      this.http.get('http://localhost:9999/authenticate/'+code)
        .success(function (data) {
          if(!data.hasOwnProperty('error')){
            sessionStorage['token'] = data.token;
            deferred.resolve(true);
          } else {
            deferred.reject(true);
          }
        })
    }
    return deferred.promise;
  }
}

Auth.$inject = ['$http', '$q'];

export default Auth;
