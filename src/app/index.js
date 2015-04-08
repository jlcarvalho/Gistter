'use strict';
/*jshint esnext: true */

import Auth from '../components/auth/auth.service';
import GH from '../components/github/github.service';
import LoginCtrl from './login/login.controller';
import MainCtrl from './main/main.controller';
import ProfileCtrl from './profile/profile.controller';
import NavbarDirective from '../components/navbar/navbar.directive';
import HandleDirective from '../components/handle/handle.directive';
import PreviewDirective from '../components/preview/preview.directive';

angular.module('coder', ['restangular', 'ui.router', 'ngMaterial', 'ui.ace', 'angularMoment'])
  .controller('LoginCtrl', LoginCtrl)
  .controller('MainCtrl', MainCtrl)
  .controller('ProfileCtrl', ProfileCtrl)
  .directive('navbar', NavbarDirective.directiveFactory)
  .directive('handle', HandleDirective.directiveFactory)
  .directive('preview', PreviewDirective.directiveFactory)
  .service('Auth', Auth)
  .service('GH', GH.ghFactory)

  .config(function ($locationProvider, $stateProvider, $urlRouterProvider) {
    $locationProvider.html5Mode(true);

    $stateProvider
      .state('home', {
        url: '/editor/:gistId?',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl as main'
      })
      .state('login', {
        url: '/login?code',
        templateUrl: 'app/login/login.html',
        controller: 'LoginCtrl as login'
      })
      .state('profile', {
        url: '/{user:[^\/w[w-]+[\/]$}',
        templateUrl: 'app/profile/profile.html',
        controller: 'ProfileCtrl as profile'
      });

    $urlRouterProvider.otherwise('/editor/');
  })
;
