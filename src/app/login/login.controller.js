/**
 * Created by JeanLucas on 11/03/2015.
 */
'use strict';
/*jshint esnext: true */

class LoginCtrl {
  constructor (Auth, $stateParams, $state) {
    if(!Auth.isLogged()) {
      Auth.getToken($stateParams.code)
        .then(function(){
          $state.go('home');
        }, function(error){
          if(error){
            console.dir('Oops!')
          }
        });
    }
  }
}

LoginCtrl.$inject = ['Auth', '$stateParams', '$state'];

export default LoginCtrl;
