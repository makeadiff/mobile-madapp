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
  		if(!user) {
  			$location.path("/login");
  			growl.addErrorMessage("Please login to continue", {ttl: 3000});
  			return false;
  		}
    		$location.path("/connections");
  	} else {
  		$location.path('/login')
  	}
    
}]);
