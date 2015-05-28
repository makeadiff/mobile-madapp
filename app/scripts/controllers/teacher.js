'use strict';

/**
 * @ngdoc function
 * @name mobileApp.controller:TeacherCtrl
 * @description
 * # TeacherCtrl
 * Controller of the mobileApp
 */
angular.module('mobileApp')
  .controller('TeacherCtrl', ['$scope', '$http', 'UserService', function ($scope, $http, user_service) {
  	var TeacherCtrl = this;
  	var user_id = user_service.getUserId();
  	var base_url = "http://localhost/Projects/Madapp/index.php/api/";
  	var key = "am3omo32hom4lnv32vO";

  	jQuery(".student-participation").rating();

  	TeacherCtrl.load = function() {
	  	$http({
	        method: 'GET',
	        url: base_url + 'class_get_last',
	        params: {user_id: user_id, key: key}
		}).success(function(data) {
			TeacherCtrl.teacher = data;
			var current_teacher;
			var other_teacher;
			for(var i = 0; i<data.teachers.length; i++) {
				if(data.teachers[i].current_user) {
					current_teacher = data.teachers[i].name;
				} else {
					if(other_teacher) other_teacher += "," + data.teachers[i].name;
					else other_teacher = data.teachers[i].name;
				}
			}
			for(var i in TeacherCtrl.teacher.students) {
				TeacherCtrl.teacher.students[i].participation = Number(TeacherCtrl.teacher.students[i].participation);
			}

			TeacherCtrl.current_teacher = current_teacher;
			TeacherCtrl.other_teacher = other_teacher;

			// Wait a small time before applying the makeup.
			setTimeout(function() {
				$(".rating").rating({starCaptions: {
					"0": "Absent",
					"1": "Disruptive",
					"2": "Distracted",
					"3": "Normal",
					"4": "Interested",
					"5": "Excited",
				}});
			}, 100);


		}).error(error);
	}

	TeacherCtrl.save = function(class_id, students) {
		// Stupid hack to make sure that the absent students are marked as 0. Right now due to some conflict between angular and star-rateings, its not happening.
		for (var i in students) {
			var ele = $("#participation-" + i);
			students[i].participation = Number(ele.val());
		}

		$http({
	        method: 'GET',
	        url: base_url + 'class_save_student_participation',
	        params: {"user_id": user_id, "key": key, "students": students, "class_id": class_id}
		}).success(function(data) {
			console.log(data)
		}).error(error);

	}
    
}]);