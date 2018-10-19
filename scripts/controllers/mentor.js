'use strict';

/**
 * @ngdoc function
 * @name mobileApp.controller:MentorCtrl
 * @description
 * # MentorCtrl
 * Controller of the mobileApp
 */
angular.module('mobileApp')
  .controller('MentorCtrl', ['$scope', '$http', '$location', 'growl', 'UserService', function ($scope, $http, $location, growl, user_service) {
	var MentorCtrl = this;
	var user = user_service.getUser();
	if(!user) {
		// :TODO: Teachers shouldn't be able to access this by typing a mentor URL.
		$location.path("/login"); 
		growl.addErrorMessage("Please login to continue", {ttl: 3000});
		return false;
	}
	var user_id = user.user_id;

	MentorCtrl.load = function() {
		loading();

		var options = $location.search();

		if(options.batch_id && options.class_on) {
			$http({
				method: 'GET',
				url: base_url + 'class_get_batch',
				params: {batch_id: options.batch_id, project_id: user.project_id, 'class_on': options.class_on, key: key}
			}).success(MentorCtrl.openBatch).error(error);

		} else if(options.batch_id) {
			$http({
				method: 'GET',
				url: base_url + 'class_get_batch',
				params: {batch_id: options.batch_id, project_id: user.project_id, key: key}
			}).success(MentorCtrl.openBatch).error(error);

		} else if(user.active_batch) {
			$http({
				method: 'GET',
				url: base_url + 'class_get_batch',
				params: {batch_id: user.active_batch, project_id: user.project_id, key: key}
			}).success(MentorCtrl.openBatch).error(error);

		} else {
			$http({
				method: 'GET',
				url: base_url + 'class_get_last_batch',
				params: {user_id: user_id, project_id: user.project_id, key: key}
			}).success(MentorCtrl.openBatch).error(error);
		}

		$http({
			method: 'GET',
			url: base_url + 'user_get_teachers',
			params: {city_id: user.city_id, project_id: user.project_id, key: key}
		}).success(function(data) {
			data.teachers.push({id: "0", name: "None"});
			MentorCtrl.all_teachers = data.teachers;
		});
	}

	MentorCtrl.openBatch = function(data) {
		loaded();

		if(data.error) {
			$location.path("/message").search({"error": data.error});
			return;
		}

		// If there is no classes happening, exit without setting the other variables.
		if(data.classes.length == 0) {
			growl.addErrorMessage("Can't find batches beyond this point.", {ttl: 3000});
			return;
		}

		MentorCtrl.mentor = data;
		MentorCtrl.base_url = base_url;
		MentorCtrl.mentor.name = user.name;

		user_service.setUserData("active_batch", data.batch_id); // Need this for exta class creation.

		for(var index in data.classes) {
			var cls = data.classes[index];
			MentorCtrl.mentor.classes[index].index = index;

			// Disable cancelled classes
			if(cls.class_status == "0") {
				MentorCtrl.cancelClass(cls, true);
			}

			// Show the substitue dropdown if a substitue is selected.
			for(var inde in cls.teachers) {
				var teach = cls.teachers[inde];
				MentorCtrl.mentor.classes[index].teachers[inde].index = inde;
				MentorCtrl.mentor.classes[index].teachers[inde].show_substitute = teach.substitute_id; // By default don't show the subsitute area.
			}
		}

		// Work arounds for using this library.
		window.setTimeout(function() {
			$('.ts-attendance').bootstrapToggle({
			  on: 'Present',
			  off: 'Absent'
			});

			$('.ts-attendance').change(function() {
				var id = $(this).prop("id");
				var class_index = $("#" + id).attr('class-index');
				var teacher_index = $("#" + id).attr('teacher-index');

				var attended = $(this).prop('checked');
				MentorCtrl.mentor.classes[class_index].teachers[teacher_index].status = attended;
				if(attended) {
					$("#zero-hour-area-" + class_index + "-" + teacher_index).removeClass("ng-hide");
				} else {
					$("#zero-hour-area-" + class_index + "-" + teacher_index).addClass("ng-hide");
				}
			});

			$('.ts-zero-hour').bootstrapToggle({
			  on: 'Attended 0 Hour',
			  off: 'Missed 0 Hour'
			});

			$('.ts-zero-hour').change(function() {
				var id = $(this).prop("id");
				var class_index = $("#" + id).attr('class-index');
				var teacher_index = $("#" + id).attr('teacher-index');

				MentorCtrl.mentor.classes[class_index].teachers[teacher_index].zero_hour_attendance = $(this).prop('checked');
			});
		}, 500);
	}

	MentorCtrl.save = function(batch_id, class_on, classes) {
		loading();

		$http({
			method: 'POST',
			url: base_url + 'class_save',
			data: {"user_id": user_id, "key": key, "class_data": angular.toJson(classes)},
    		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).success(function(data) {
			loaded();
			if(data.success) {
				growl.addSuccessMessage("Information updated by " + user.name + ".", {ttl: 3000});
			} else {
				error(data.error);
			}
		}).error(error);
	}

	MentorCtrl.cancelClass = function(class_info, reverse) {
		var status = class_info.class_status;
		if(reverse) status = (status == "1") ? "0" : "1"; // This is needed when loading.
		var button_text = "";

		if(status == "1") {
			class_info.class_status = "0";
			button_text = "Un-Cancel Class";
		} else {
			class_info.class_status = "1";
			button_text = "<span class='glyphicon glyphicon-remove-sign'></span> Cancel Class"; // Cancel Class
		}
		$("#cancel-button-"+class_info.id).html(button_text);
	}

	MentorCtrl.showSubstitute = function(teacher) {
		if(teacher.show_substitute != '0') // It can be 1 or substitute id
			teacher.show_substitute = 0;
		else
			teacher.show_substitute = 1;
	}

	MentorCtrl.browseClass = function(batch_id, class_on, direction) {
		var class_on = new Date(class_on);

		// if(direction == "+") class_on.setDate(class_on.getDate() + 7);
		// else class_on.setDate(class_on.getDate() - 7);
		var mysql_format = (class_on.getYear() + 1900) +  "-" + pad(class_on.getMonth() + 1, 2) + "-" + pad(class_on.getDate(), 2);

		loading();
		$http({
			method: 'GET',
			url: base_url + 'open_batch',
			params: {"user_id": user_id, "key": key, "batch_id": batch_id, "class_from": mysql_format, "direction": direction}
		}).success(MentorCtrl.openBatch).error(error);
	}

	MentorCtrl.gotoClass = function(class_data) {
		user_service.setUserData("active_class", class_data.id);
		$location.path("/teacher");
	}
}]);

function pad(num, size) {
	var s = num+"";
	while (s.length < size) s = "0" + s;
	return s;
}
