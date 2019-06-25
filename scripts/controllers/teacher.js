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
	TeacherCtrl.is_event = false;
	var user = user_service.getUser();
	if(!user) {
		$location.path("/login");
		growl.addErrorMessage("Please login to continue", {ttl: 3000});
		return false;
	}
	var user_id = user_service.getUserId();
	var options = $location.search();
	TeacherCtrl.class_id = options.class_id;

	jQuery(".student-participation").rating();
	TeacherCtrl.user_id = user_id;

	TeacherCtrl.load = function() {
		// Open teacher view directly from select class page based on a batch_id and level_id
		if(options.batch_id && options.level_id) {
			$http({
				method: 'GET',
				url: base_url + 'browse_class',
				params: {batch_id: options.batch_id, level_id: options.level_id, key: key, direction: 'l'}
			}).success(TeacherCtrl.openClass).error(error);

		} else if(user.active_class) {
			$http({
				method: 'GET',
				url: base_url + 'open_class',
				params: {class_id: user.active_class, key: key}
			}).success(TeacherCtrl.openClass).error(error);

		// Open a specific class. Need incase the mentor is browsing thru the classes. 
		} else if(options.class_id) {
			$http({
				method: 'GET',
				url: base_url + 'open_class',
				params: {class_id: options.class_id, key: key}
			}).success(TeacherCtrl.openClass).error(error);

		} else {
			$http({
				method: 'GET',
				url: base_url + 'class_get_last',
				params: {user_id: user_id, key: key}
			}).success(TeacherCtrl.openClass).error(error);
		}
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

		// See if there is an Impact Survey event open.
		$http({
			method: 'GET',
			url: base_url + 'active_is_event',
			params: {level_id: data.level_id, teacher_id: user_id, key: key}
		}).success(function(data) {
			TeacherCtrl.is_event = data.is_event;
		}).error(error);
		
		TeacherCtrl.class_id = data.id;
		TeacherCtrl.teacher = data;
		TeacherCtrl.teacher.class_satisfaction = Number(TeacherCtrl.teacher.class_satisfaction);

		var cancelled = false;
		if(TeacherCtrl.teacher.status == 'cancelled') cancelled = true;

		var current_teacher;
		var current_teacher_credit;
		var other_teacher;

		for(var i = 0; i < data.teachers.length; i++) {
			if(data.teachers[i].current_user) {
				current_teacher = data.teachers[i].name;
				current_teacher_credit = data.teachers[i].credit;
			} else {
				if(other_teacher) other_teacher += ", " + data.teachers[i].name;
				else other_teacher = data.teachers[i].name;
			}
		}
		for(var i in TeacherCtrl.teacher.students) {
			TeacherCtrl.teacher.students[i].participation = Number(TeacherCtrl.teacher.students[i].participation);
			TeacherCtrl.teacher.students[i].check_for_understanding = Number(TeacherCtrl.teacher.students[i].check_for_understanding);
			
			// // Workaround for this to function. Not working by default. I think library issue.
			// if(TeacherCtrl.teacher.students[i].check_for_understanding)
			// 	$("#check_for_understanding-" + TeacherCtrl.teacher.students[i].id).bootstrapToggle('on');
			// else 
			// 	$("#check_for_understanding-" + TeacherCtrl.teacher.students[i].id).bootstrapToggle('off');
		}

		TeacherCtrl.current_teacher = current_teacher;
		TeacherCtrl.current_teacher_credit = current_teacher_credit;
		TeacherCtrl.other_teacher = other_teacher;

		// Wait a small time before applying the makeup.
		setTimeout(function() {
			$('.toggle-switch').bootstrapToggle({
			  on: 'Yes',
			  off: 'No'
			});

			// $('.toggle-switch').change(function() {
			// 	var id = $(this).prop("id");
			// 	var student_index = $("#" + id).attr('student-index');

			// 	TeacherCtrl.teacher.students[student_index].check_for_understanding = $(this).prop('checked');
			// });

			$(".class_satisfaction").rating({starCaptions: {
				"0": "No Data",
				"1": "Dissatisfied",
				"2": "Less Satisfied",
				"3": "Satisfied",
				"4": "Very Satisfied",
				"5": "Completely Satisfied",
			}}).rating("refresh", {showCaption: true, disabled: cancelled, showClear: false});

			$(".check_for_understanding").rating({starCaptions: {
				"0": "Absent",
				"1": "Doesn't understand the lesson at all",
				"2": "Understands basic flow",
				"3": "Understands part of the lesson",
				"4": "Understands the lesson but doesn't clarify doubts",
				"5": "Understands and clarifies doubts and/or is able to help others",
			}}).rating("refresh", {showCaption: true, disabled: cancelled, showClear: false}); // Make sure this option is passed with the refresh command. Else, its not updating on new data.;
	
			$(".participation").rating({starCaptions: {
				"0": "Absent",
				"1": "Disruptive",
				"2": "Distracted",
				"3": "Attentive",
				"4": "Involved",
				"5": "Participative",
			}}).rating("refresh", {showCaption: true, disabled: cancelled, showClear: false}); // Make sure this option is passed with the refresh command. Else, its not updating on new data.;
		}, 300);

	}

	TeacherCtrl.save = function(class_id, students, class_satisfaction) {
		
		// Stupid hack to make sure that the absent students are marked as 0. Right now due to some conflict between angular and star-ratings, its not happening.
		for (var i in students) {
			students[i].participation = Number($("#participation-" + i).val());
			students[i].check_for_understanding = Number($("#check_for_understanding-" + i).val());
		}

		loading();
		$http({
			method: 'GET',
			url: base_url + 'class_save_student_participation',
			params: {"user_id": user_id, "key": key, "students": students, "class_satisfaction": class_satisfaction, "class_id": class_id}
		}).success(function(data) {
			loaded();
			growl.addSuccessMessage("Information updated by " + user.name + ".", {ttl: 3000});
		}).error(error);
	}
	
	TeacherCtrl.browseClass = function(uid, class_on_date, direction) {
		var class_on = new Date(class_on_date.split(" ")[0]);

		var mysql_format = (class_on.getYear() + 1900) +  "-" + pad(class_on.getMonth() + 1, 2) + "-" + pad(class_on.getDate(), 2);

		loading();
		$http({
			method: 'GET',
			url: base_url + 'browse_class',
			params: {"key": key, "class_from": mysql_format, "level_id": TeacherCtrl.teacher.level_id, "batch_id": TeacherCtrl.teacher.batch_id, "direction": direction}
		}).success(TeacherCtrl.openClass).error(error);
	}

}]);