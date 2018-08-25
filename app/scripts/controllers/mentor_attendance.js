'use strict';

/**
 * @ngdoc function
 * @name mobileApp.controller:MentorAtndCtrl
 * @description
 * # MentorAtndCtrl
 * Controller of the mobileApp
 */
angular.module('mobileApp')
  .controller('MentorAtndCtrl', ['$scope', '$http', '$location', '$rootScope', 'growl', 'UserService', function ($scope, $http, $location, $rootScope, growl, user_service) {
	var MentorAtndCtrl = this;
	var user = user_service.getUser();
	if(!user) {
		// :TODO: Mentors shouldn't be able to access this by typing a URL.
		$location.path("/login"); 
		growl.addErrorMessage("Please login to continue", {ttl: 3000});
		return false;
	}
	var user_id = user.user_id;

	MentorAtndCtrl.load = function() {
		// loading();

		var options = $location.search();
		var center_id = options.center_id;
		MentorAtndCtrl.date = options.date;

		$http({
			method: 'GET',
			url: api_base_url + 'users',
			headers: $rootScope.request_headers,
			params: {group_in: "8,2,4,5,11,15,19,272,269,370,375,378", // Mentors + All fellows
					 project_id: user.project_id, center_id: center_id }
		}).success(function(data) {
			MentorAtndCtrl.mentors = data.data.users;
			console.log(MentorAtndCtrl.mentors);
		}).error(error);


	}

	// MentorAtndCtrl.save = function(batch_id, class_on, classes) {
	// 	loading();

	// 	$http({
	// 		method: 'POST',
	// 		url: base_url + 'class_save',
	// 		data: {"user_id": user_id, "key": key, "class_data": angular.toJson(classes)},
 //    		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	// 	}).success(function(data) {
	// 		loaded();
	// 		if(data.success) {
	// 			growl.addSuccessMessage("Information updated by " + user.name + ".", {ttl: 3000});
	// 		} else {
	// 			error(data.error);
	// 		}
	// 	}).error(error);
	// }

}]);

