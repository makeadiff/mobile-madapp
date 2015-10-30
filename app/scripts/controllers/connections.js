'use strict';

/**
 * @ngdoc function
 * @name mobileApp.controller:ConnectionCtrl
 * @description
 * # ConnectionCtrl
 * Controller of the mobileApp
 */
angular.module('mobileApp')
  .controller('ConnectionCtrl', ['$scope', '$location', 'UserService', function ($scope, $location, user_service) {
	var ConnectionCtrl = this;
	ConnectionCtrl.user = user_service.getUser();
	loaded();

	ConnectionCtrl.mentorClass = function(batch_id) {
		user_service.setUserData("active_batch", batch_id);
		$location.path("/mentor");
	}

	ConnectionCtrl.teachClass = function(class_id) {
		user_service.setUserData("active_class", class_id);
		$location.path("/teacher");
	}

	$scope.formatDate = function(date){
		var date = date.split("-").join("/");
		var dateOut = new Date(date);
		return dateOut;
	}; 
}]);

