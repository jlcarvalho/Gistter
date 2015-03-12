'use strict';
/*jshint esnext: true */

import Auth from '../components/auth/auth.service';
import GH from '../components/github/github.service';
import LoginCtrl from './login/login.controller';
import MainCtrl from './main/main.controller';
import NavbarDirective from '../components/navbar/navbar.directive';

angular.module('coder', ['restangular', 'ui.router', 'ngMaterial', 'ui.ace'])
  .controller('LoginCtrl', LoginCtrl)
  .controller('MainCtrl', MainCtrl)
  .directive('navbar', NavbarDirective.directiveFactory)
  .service('Auth', Auth)
  .service('GH', GH)

  .config(function ($locationProvider, $stateProvider, $urlRouterProvider) {
    $locationProvider.html5Mode(true);

    $stateProvider
      .state('home', {
        url: '/editor:gistId?',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl as main'
      })
      .state('login', {
        url: '/login?code',
        templateUrl: 'app/login/login.html',
        controller: 'LoginCtrl as login'
      });

    $urlRouterProvider.otherwise('/editor');
  })
;
