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

  	MentorCtrl.load = function() {
	  	$http({
	        method: 'GET',
	        url: base_url + 'class_get_last_batch',
	        params: {user_id: user_id, key: key}
		}).success(function(data) {
			MentorCtrl.mentor = data;
			MentorCtrl.mentor.name = user.name;
			console.log(data);

			setTimeout(function() {
				for(var index in data.classes) {
					var cls = data.classes[index];
					
					// Disable cancelled classes
					if(cls.class_status == "0") {
						MentorCtrl.cancelClass(cls, true);
					}

					// Show the substitue dropdown if a substitue is selected.
					for(var inde in cls.teachers) {
						var teach = cls.teachers[inde];
						if(teach.substitute_id != "0") {
							$("#substitute-" + teach.id).show();
						}
					}
				}
			}, 200);
		}).error(error);

		$http({
	        method: 'GET',
	        url: base_url + 'user_get_teachers',
	        params: {city_id: user.city_id, key: key}
		}).success(function(data) {
			MentorCtrl.all_teachers = data.teachers;
		});
	}

	MentorCtrl.save = function(batch_id, class_on, classes) {
		$http({
	        method: 'GET',
	        url: base_url + 'class_save',
	        params: {user_id: user_id, key: key, class_data: angular.toJson(classes)}
		}).success(function(data) {
			console.log(data);
		}).error(error);
	}

	MentorCtrl.cancelClass = function(class_info, reverse) {
		var status = class_info.class_status;
		if(reverse) status = (status == "1") ? "0" : "1"; // This is needed when lodaing.
		var button_text = "";

		if(status == "1") {
			class_info.class_status = "0";
			button_text = "Un-Cancel Class";

			for(var teacher_index in class_info.teachers) {
				var teacher_id = class_info.teachers[teacher_index].id;
				$("#zero-hour-" + teacher_id).prop("disabled", true);
				$("#attendance-" + teacher_id).prop("disabled", true);
				$("#sub-" + teacher_id).prop("disabled", true);
			}
		} else {
			class_info.class_status = "1";
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
