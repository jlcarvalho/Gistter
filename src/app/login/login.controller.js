/**
 * Created by JeanLucas on 11/03/2015.
 */
'use strict';
/*jshint esnext: true */

class LoginCtrl {
  constructor (Auth, $stateParams, $state) {

    Auth.getToken($stateParams.code).then(function(data){
      if(!data.hasOwnProperty('error')){
        $state.go('home');
      } else {
        console.dir('Oops!')
      }
    });

    //var github = new Github({
    //  token: "OAUTH_TOKEN",
    //  auth: "oauth"
    //});
    //
    //var user = github.getUser();
    //
    //user.gists(function(err, gists) {
    //  console.dir(gists);
    //});
  }
}

LoginCtrl.$inject = ['Auth', '$stateParams', '$state'];

export default LoginCtrl;
