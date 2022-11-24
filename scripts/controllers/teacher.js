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

		// TR Wingman special case. 348 is id of TR Wingman User group
		if(data.level == '7 D' && typeof user.groups[348] == "string") data.level = "TR Wingman";
		
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
			TeacherCtrl.teacher.students[i].present = (TeacherCtrl.teacher.students[i].participation != 0 ) ? true : false ;
			//	console.log("hellow"+ TeacherCtrl.teacher.students[i].present + TeacherCtrl.teacher.students[i].participation );
		}

		TeacherCtrl.current_teacher = current_teacher;
		TeacherCtrl.current_teacher_credit = current_teacher_credit;
		TeacherCtrl.other_teacher = other_teacher;

		// Wait a small time before applying the makeup.
		setTimeout(
			// Set text for toggle 
			function() {
			$('.toggle-switch').bootstrapToggle({
			  on: 'Present',
			  off: 'Absent'
			});
			
			$(".class_satisfaction").rating({starCaptions: {
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
			
			// Disable toggle switch if the class is cancelled
			if(cancelled){
				$('.toggle-switch').bootstrapToggle('disable')
			} else {
				$('.toggle-switch').bootstrapToggle('enable')
			}
			
			// Initialize correct value of the toggle when the page opens
			for(var i in TeacherCtrl.teacher.students) {
				// Workaround for this to function. Not working by default. I think library issue.
				if(TeacherCtrl.teacher.students[i].present){
					$("#present-" + TeacherCtrl.teacher.students[i].id).bootstrapToggle('on');
					$("#check_for_understanding-container-" + TeacherCtrl.teacher.students[i].id).show();
					$("#participation-container-" + TeacherCtrl.teacher.students[i].id).show();
				}
				else {
					$("#present-" + TeacherCtrl.teacher.students[i].id).bootstrapToggle('off');
					$("#check_for_understanding-container-" + TeacherCtrl.teacher.students[i].id).hide();
					$("#participation-container-" + TeacherCtrl.teacher.students[i].id).hide();
			 	}
			}
			
			// On change of student absent/present toggle 
			$('.toggle-switch').change(function() {
				var id = $(this).prop("id");
				var student_index = $("#" + id).attr('student-index');
				var student_id = $("#" + id).attr('student-id');
				TeacherCtrl.teacher.students[student_id].present = $(this).prop('checked');
				if(TeacherCtrl.teacher.students[student_id].present){
					// console.log("change true"+ student_id);
					$("#check_for_understanding-container-" + TeacherCtrl.teacher.students[student_id].id).show();
					$("#participation-container-" + TeacherCtrl.teacher.students[student_id].id).show();
					$("#check_for_understanding-" + TeacherCtrl.teacher.students[student_id].id).prop('required',true);
					$("#participation-" + TeacherCtrl.teacher.students[student_id].id).prop('required',true);
				}
				else
				{ //TODO: set both values as zero and check hide and show!
					// console.log("change false"+ student_id);
					TeacherCtrl.teacher.students[i].check_for_understanding = 0;
					TeacherCtrl.teacher.students[i].participation = 0;
					$("#check_for_understanding-" + TeacherCtrl.teacher.students[student_id].id).rating('update', 0);
					$("#participation-" + TeacherCtrl.teacher.students[student_id].id).rating('update', 0);

					$("#check_for_understanding-container-" + TeacherCtrl.teacher.students[student_id].id).hide();
					$("#participation-container-" + TeacherCtrl.teacher.students[student_id].id).hide();
					$("#check_for_understanding-" + TeacherCtrl.teacher.students[student_id].id).prop('required',false);
					$("#participation-" + TeacherCtrl.teacher.students[student_id].id).prop('required',false);
				}
			});
		}, 500);
	}

	// TODO: Right now whenever the user open the page the save function automatically gets called
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