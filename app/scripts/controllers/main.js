'use strict';

/**
 * @ngdoc function
 * @name mobileApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the mobileApp
 */
angular.module('mobileApp')
  .controller('MainCtrl', ['$scope', '$location', 'UserService', function ($scope, $location, user_service) {
  	if(user_service.isLoggedIn()) {
  		var user = user_service.getUser();
  		// console.log(user);
  		// $location.path('/about');
  	} else {
  		$location.path('/login')
  	}
    
  }]);
