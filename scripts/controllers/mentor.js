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

		var teacher_user_group_id = $scope.getTeacherGroupId(user.project_id);
		var search_groups = [teacher_user_group_id];

		// Ed support has a special case - ES trained - that should be shown in substitute list.
		if(user.project_id === 1) {
			let es_trained_group_id = 368; // ES Trained - User Group.
			search_groups.push(es_trained_group_id);
		} else if(user.project_id === 2) {
			let fp_trained_group_id = 387; // Foundation Trained - User Group.
			search_groups.push(fp_trained_group_id);
		}
		console.log(teacher_user_group_id, search_groups, user)

		$http({
			method: 'GET',
			url: api_base_url + 'users',
			params: {city_id: user.city_id, group_in: search_groups.join(",")},
			headers: $scope.request_headers
		}).success(function(data) {
			MentorCtrl.all_teachers = data.data.users;
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
				MentorCtrl.mentor.classes[index].teachers[inde].vol_type = "";
				
				if (teach.substitute_id ==0){
					MentorCtrl.mentor.classes[index].teachers[inde].vol_type = "Regular";
				}
				else{
					MentorCtrl.mentor.classes[index].teachers[inde].vol_type = "Substitute";
				}
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
		var validation_error = false;
		for(var i in classes) {
			var cls = classes[i];
			console.log(cls);
			if(cls.class_status == 0 && cls.cancel_option == "in-volunteer-unavailable") {
				validation_error = true;
			}
		}

		if(validation_error) {
			growl.addErrorMessage("Please enter a reason for class cancelation", {ttl: 3000});
			return;
		}

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
		// Reset all subs currently marked before cancelling the class
		for(var index in class_info.teachers) {
			var teachers = class_info.teachers[index];
			teachers.show_substitute = "0";
			teachers.vol_type = "Regular";
			teachers.substitute_id = "0";
		}

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

	MentorCtrl.changeVolunteerType = function (teacher) {
		if (teacher.vol_type == "Regular") {
			teacher.show_substitute = 0;
		}
		else if (teacher.vol_type == "Substitute") {
			teacher.show_substitute = 1;
		}
	}

	MentorCtrl.browseClass = function(batch_id, class_on, direction) {
		var class_on = new Date(class_on);

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
