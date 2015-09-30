'use strict';

/**
 * @ngdoc function
 * @name mobileApp.controller:TeacherCtrl
 * @description
 * # TeacherCtrl
 * Controller of the mobileApp
 */
angular.module('mobileApp')
  .controller('TeacherCtrl', ['$scope', '$location', '$http', 'growl', 'UserService', function ($scope, $location, $http, growl, user_service) {
  	var TeacherCtrl = this;
  	var user_id = user_service.getUserId();

  	jQuery(".student-participation").rating();
  	TeacherCtrl.user_id = user_id;

  	TeacherCtrl.load = function() {
	  	$http({
	        method: 'GET',
	        url: base_url + 'class_get_last',
	        params: {user_id: user_id, key: key}
		}).success(TeacherCtrl.openClass).error(error);
	}

	TeacherCtrl.openClass = function(data) {
		loaded();
		if(data.error) {
			if(data.error == "No classes found.") {
				$location.path("/message").search({"error": data.error});
				return;
			}

			growl.addErrorMessage("Class not found beyond this point.", {ttl: 3000});
			return;
		}
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
			}}).rating("refresh", {showClear: false});
		}, 100);
	}

	TeacherCtrl.save = function(class_id, students) {
		// Stupid hack to make sure that the absent students are marked as 0. Right now due to some conflict between angular and star-rateings, its not happening.
		for (var i in students) {
			var ele = $("#participation-" + i);
			students[i].participation = Number(ele.val());
		}

		loading();
		$http({
	        method: 'GET',
	        url: base_url + 'class_save_student_participation',
	        params: {"user_id": user_id, "key": key, "students": students, "class_id": class_id}
		}).success(function(data) {
			loaded();
			growl.addSuccessMessage("Information Updated.", {ttl: 3000});
		}).error(error);
	}
    
    TeacherCtrl.browseClass = function(uid, class_on_date, direction) {
		var class_on = new Date(class_on_date.split(" ")[0]);

		if(direction == "+") class_on.setDate(class_on.getDate() + 7);
		else class_on.setDate(class_on.getDate() - 7);
		var mysql_format = (class_on.getYear() + 1900) +  "-" + pad(class_on.getMonth() + 1, 2) + "-" + pad(class_on.getDate(), 2);

		loading();
		$http({
			method: 'GET',
			url: base_url + 'get_class_on',
			params: {"user_id": uid, "key": key, "class_on": mysql_format}
		}).success(TeacherCtrl.openClass).error(error);
	}

}]);