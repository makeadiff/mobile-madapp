'use strict';

/**
 * @ngdoc function
 * @name mobileApp.controller:MessageCtrl
 * @description
 * # MessageCtrl
 * Controller of the mobileApp
 */
angular.module('mobileApp')
  .controller('MessageCtrl', ['$scope', '$location', function ($scope, $location) {
  	var MessageCtrl = this;
  	var options = $location.search();

  	MessageCtrl.load = function() {
  		if(options.error) MessageCtrl.error = options.error;
  		if(options.success) MessageCtrl.success = options.success;
  	}

  	MessageCtrl.load();
}]);
