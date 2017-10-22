'use strict';

/**
 * @ngdoc function
 * @name mobileApp.controller:ImpactSurveyCtrl
 * @description
 * # ImpactSurveyCtrl
 * Controller of the mobileApp
 */
angular.module('mobileApp')
  .controller('ImpactSurveyCtrl', ['$scope', '$location', '$http', 'growl', 'UserService', function ($scope, $location, $http, growl, user_service) {
	var ctrl = this;
	ctrl.response = {};
	ctrl.is_event_id = 0;
	ctrl.error = false;
	var user = user_service.getUser();
	if(!user) {
		$location.path("/login");
		growl.addErrorMessage("Please login to continue", {ttl: 3000});
		return false;
	}
	var user_id = user_service.getUserId();
	var options = $location.search();
	ctrl.is_event_id = options.is_event_id;

	// jQuery(".response").rating();

	ctrl.load = function() {
		if(!user.connections.teacher_at.length) {
			ctrl.error = "You have to be a teacher to enter impact survey."
			return;	
		} 

		var level_id = user.connections.teacher_at[0].level_id;

		$http({
			method: 'GET',
			url: base_url + 'get_students',
			params: {user_id: user.user_id, level_id: level_id, key: key}
		}).success(function(data) {
			ctrl.students = data.students;

			$http({
				method: 'GET',
				url: base_url + 'is_existing_responses',
				params: {is_event_id: ctrl.is_event_id, 'student_ids[]': Object.keys(data.students), key: key}
			}).success(function(data) {
				ctrl.response = data.response;
				setTimeout(ctrl.makeup, 300);

			}).error(error);
		}).error(error);

		$http({
			method: 'GET',
			url: base_url + 'is_questions'
		}).success(function(data) {
			ctrl.questions = data.questions;

		}).error(error);
	}

	ctrl.save = function(event, response) {
		var ele = $(event.target);
		var student_id = ele.attr("data-student-id");
		var question_id = ele.attr("data-question-id");
		
		var data = {
			"is_event_id": ctrl.is_event_id,
			"teacher_id": user.user_id,
			"student_id": student_id,
			"question_id": question_id,
			"response": response
		};

		$http({
			method: 'POST',
			url: base_url + 'is_save',
			params: data
		}).success(function(data) {
			// console.log(data);
			// ctrl.questions = data.questions;

		}).error(error);
	}

	ctrl.makeup = function() {
		$(".response").rating("refresh", {showCaption: false, showClear: false});
		$(".response").on("rating.change", ctrl.save);
		// console.log("Applying Makeup");
	}

	// Bug fix. Sometimes it doesn't get called - so, try again.
	setTimeout(function() {
		if(!jQuery(jQuery(".response").get(0)).hasClass("hide")) {
			ctrl.makeup();
		}
	}, 1500);
}]);

