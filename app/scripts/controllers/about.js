'use strict';

/**
 * @ngdoc function
 * @name mobileApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the mobileApp
 */
angular.module('mobileApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
