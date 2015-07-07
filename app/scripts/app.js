'use strict';

/**
 * @ngdoc overview
 * @name mobileApp
 * @description
 * # mobileApp
 *
 * Main module of the application.
 */
angular
  .module('mobileApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngStorage',
    'angular-growl'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        restricted : true
      })
      .when('/teacher', {
        templateUrl: 'views/teacher.html',
        controller: 'TeacherCtrl',
        restricted : true,
        resolve: {
          style : function() {
            if( !angular.element('link#teacher-css').length) {
              angular.element('head').append('<link id="teacher-css" href="styles/teacher.css" rel="stylesheet">');
              angular.element('head').append('<link href="../bower_components/bootstrap-star-rating/css/star-rating.css" rel="stylesheet">');
            }
          }
        }
      })
      .when('/mentor', {
        templateUrl: 'views/mentor.html',
        controller: 'MentorCtrl',
        restricted : true,
        resolve: {
          style : function() {
            if( !angular.element('link#mentor-css').length) {
              angular.element('head').append('<link id="mentor-css" href="styles/mentor.css" rel="stylesheet">');
            }
          }
        }
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        restricted : false
      })
      .when('/message', {
        templateUrl: 'views/message.html',
        controller: 'MessageCtrl',
        restricted : false
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        restricted : false,
        resolve: {
          style : function() {
            if( !angular.element('link#login-css').length) {
              angular.element('head').append('<link id="login-css" href="styles/login.css" rel="stylesheet">');
            }
          }
        }
      })
      .otherwise({
        redirectTo: '/'
      });
  });

function error() {
  alert("Error!");
}