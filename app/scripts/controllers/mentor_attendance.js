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
		var options = $location.search();
		MentorAtndCtrl.class_id = options.class_id;
		MentorAtndCtrl.date = options.date;
		MentorAtndCtrl.center_name = options.center_name;

		$http({
			method: 'GET',
			url: api_base_url + 'classes/' + MentorAtndCtrl.class_id + '/data/mentor_attendance',
			headers: $rootScope.request_headers
		}).success(function(data) {
			MentorAtndCtrl.attendance = JSON.parse(data.data.data);
		});

		$http({
			method: 'GET',
			url: api_base_url + 'users',
			headers: $rootScope.request_headers,
			params: { group_in: "8,2,4,5,11,15,19,272,269,370,375,378", city_id: user.city_id } // Mentors + All fellows
		}).success(function(data) {
			MentorAtndCtrl.mentors = data.data.users;
		}).error(error);
	}

	MentorAtndCtrl.save = function() {
		var present_mentors = {};

		$(".mentor-attendance").each(function(i, ele) {
			var mentor_id = ele.getAttribute("data-mentor-id");
			present_mentors[mentor_id] = false;
			if(ele.checked) {
				present_mentors[mentor_id] = true;
			}
		}).promise().done(function() {
			$http({
				method: 'POST',
				url: api_base_url + 'classes/' + MentorAtndCtrl.class_id + '/data/mentor_attendance',
				headers: $rootScope.request_headers,
				params: { data: angular.toJson(present_mentors) }
			}).success(function(data) {
				growl.addSuccessMessage("Data saved. Thank you.", {ttl: 3000});
			}).error(error);
		});
	}

}]);

