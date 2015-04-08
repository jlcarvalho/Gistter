/**
 * Created by JeanLucas on 11/03/2015.
 */
'use strict';
/*jshint esnext: true */

class Auth {
  constructor ($http, $q, $timeout, GH) {
    this.http = $http;
    this.promise = $q;
    this.$timeout = $timeout;
    this.user;
    this.GH = GH;
  }

  getToken (code) {
    var deferred = this.promise.defer();
    this.http.get('https://jlcarv-coder.herokuapp.com/authenticate/'+code)
      .success((data) => {
        if(!data.hasOwnProperty('error')){
          deferred.resolve(data.token);
        } else {
          deferred.reject(data.error);
        }
      })
    return deferred.promise;
  }

  getUser () {
    var deferred = this.promise.defer();

    if(this.isLogged()){
      if(!angular.isDefined(this.user)){
        this.GH.getInstance(sessionStorage['token']).getUser().show(false, (err, user) => {
          this.user = user;
          deferred.resolve(this.user);
        });        
      } else {
        deferred.resolve(this.user);
      }
    } else {
      deferred.reject(true);
    }

    return deferred.promise;
  }

  isLogged () {
    if(angular.isDefined(sessionStorage['token'])){
      return true;
    }
  }
}

Auth.$inject = ['$http', '$q', '$timeout', 'GH'];

export default Auth;
