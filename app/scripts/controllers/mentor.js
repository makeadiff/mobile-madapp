'use strict';

/**
 * @ngdoc function
 * @name mobileApp.controller:MentorCtrl
 * @description
 * # MentorCtrl
 * Controller of the mobileApp
 */
angular.module('mobileApp')
  .controller('MentorCtrl', ['$scope', '$http', 'UserService', function ($scope, $http, user_service) {
  	var MentorCtrl = this;
  	var user = user_service.getUser();
  	var user_id = user.user_id;
  	var base_url = "http://localhost/Projects/Madapp/index.php/api/";
  	var key = "am3omo32hom4lnv32vO";

  	jQuery(".student-participation").rating();

  	MentorCtrl.load = function() {
	  	$http({
	        method: 'GET',
	        url: base_url + 'class_get_last_batch',
	        params: {user_id: user_id, key: key}
		}).success(function(data) {
			MentorCtrl.mentor = data;
			MentorCtrl.mentor.name = user.name;
		}).error(error);

		$http({
	        method: 'GET',
	        url: base_url + 'user_get_teachers',
	        params: {city_id: user.city_id, key: key}
		}).success(function(data) {
			MentorCtrl.all_teachers = data.teachers;

			// MentorCtrl.all_teachers = [{"id":"123456", "name": "One"}, 
			// 	{"id":"223456", "name": "Two"},
			// 	{"id":"323456", "name": "Three"},
			// 	{"id":"423456", "name": "Four"},
			// 	{"id":"523456", "name": "Five"},
			// 	{"id":"623456", "name": "Six"},
			// 	{"id":"0", "name": "None"}
			// 	];
		});
	}

	MentorCtrl.save = function(batch_id, class_on, classes) {
		console.log(classes, classes.length);
		
	}

	MentorCtrl.cancelClass = function(class_info) {
		var status = class_info.class_status;
		var button_text = "";

		if(status == 1) {
			class_info.class_status = 0;
			button_text = "Un-Cancel Class";

			for(var teacher_index in class_info.teachers) {
				var teacher_id = class_info.teachers[teacher_index].id;
				$("#zero-hour-" + teacher_id).prop("disabled", true);
				$("#attendance-" + teacher_id).prop("disabled", true);
				$("#sub-" + teacher_id).prop("disabled", true);
			}
		} else {
			class_info.class_status = 1;
			button_text = "Cancel Class";

			for(var teacher_index in class_info.teachers) {
				var teacher_id = class_info.teachers[teacher_index].id;
				$("#zero-hour-" + teacher_id).prop("disabled", false);
				$("#attendance-" + teacher_id).prop("disabled", false);
				$("#sub-" + teacher_id).prop("disabled", false);
			}
		}
		$("#cancel-button-"+class_info.id).text(button_text);

	}

	MentorCtrl.showSubstitute = function(user_id) {
		$("#substitute-"+user_id).toggle();
	}
    
}]);
