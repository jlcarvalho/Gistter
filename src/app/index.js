'use strict';
/*jshint esnext: true */

import Auth from '../components/auth/auth.service';
import LoginCtrl from './login/login.controller';
import MainCtrl from './main/main.controller';
import NavbarCtrl from '../components/navbar/navbar.controller';

angular.module('coder', ['restangular', 'ui.router', 'ngMaterial', 'ui.ace'])
  .controller('LoginCtrl', LoginCtrl)
  .controller('MainCtrl', MainCtrl)
  .controller('NavbarCtrl', NavbarCtrl)
  .service('Auth', Auth)

  .config(function ($locationProvider, $stateProvider, $urlRouterProvider) {
    $locationProvider.html5Mode(true);

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl as main'
      })
      .state('login', {
        url: '/login?code',
        templateUrl: 'app/login/login.html',
        controller: 'LoginCtrl as login'
      });

    $urlRouterProvider.otherwise('/');
  })
;
