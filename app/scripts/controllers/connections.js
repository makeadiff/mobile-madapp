'use strict';

/**
 * @ngdoc function
 * @name mobileApp.controller:ConnectionCtrl
 * @description
 * # ConnectionCtrl
 * Controller of the mobileApp
 */
angular.module('mobileApp')
  .controller('ConnectionCtrl', ['$scope', '$location', '$http', 'UserService', function ($scope, $location, $http, user_service) {
	var ConnectionCtrl = this;
	
	if(user_service.isLoggedIn()) {
  		var user = user_service.getUser();
  		if(!user) {
  			$location.path("/login");
  			growl.addErrorMessage("Please login to continue", {ttl: 3000});
  			return false;
  		}
  		var params = $location.search();

  	} else {
  		$location.path('/login')
  	}
  	ConnectionCtrl.user = user;
	
	ConnectionCtrl.reports = {
		"teacher": {
				"student_attendance"		: {"name" : "Student Attendance", "issue_count" : 0},
				"check_for_understanding"	: {"name" : "Check For Understanding", "issue_count" : 0},
				"child_participation"		: {"name" : "Child Participation", "issue_count" : 0}
			},
		"mentor": {
				// "student_attendance"		: {"name" : "Student Attendance", "issue_count" : 0},
				"check_for_understanding"	: {"name" : "Check For Understanding", "issue_count" : 0},
				"child_participation"		: {"name" : "Child Participation", "issue_count" : 0},
				// "teacher_satisfaction"	: {"name" : "Teacher Satisfaction", "issue_count" : 0},
				"zero_hour_attendance"		: {"name" : "Zero Hour Attendance", "issue_count" : 0},
				"class_satisfaction"		: {"name" : "Class Satisfaction", "issue_count" : 0}
		}
	};

	ConnectionCtrl.load = function() {
		var connect = ConnectionCtrl._findConnection();
		if(!connect) return;

		if(connect.teacher.level_id) {
			loading();
			$http({
				method: 'GET',
				url: base_url + 'teacher_report_aggregate',
				params: {level_id: connect.teacher.level_id, key: key}
			}).success(ConnectionCtrl.countProblems).error(error);
		}
	}

	ConnectionCtrl.countProblems = function(data) {
		loaded();
		if(data.report_name == 'teacher_report_aggregate') {
			for(var key in data.reports) {
				ConnectionCtrl.reports.teacher[key].issue_count = data.reports[key];
			}
		}
	}

	ConnectionCtrl.mentorClass = function(batch_id) {
		user_service.setUserData("active_batch", batch_id);
		$location.path("/mentor");
	}

	ConnectionCtrl.teachClass = function(class_id) {
		user_service.setUserData("active_class", class_id);
		$location.path("/teacher");
	}

	$scope.formatDate = function(date){
		var date = date.split("-").join("/");
		var dateOut = new Date(date);
		return dateOut;
	};

	ConnectionCtrl._findConnection = function() {
		var connect = {};
		if(!user.connections) return false;

		if(user.connections.mentor_at.length)
			connect['mentor'] = user.connections.mentor_at[0];

		if(user.connections.teacher_at.length)
			connect['teacher'] = user.connections.teacher_at[0];

		return connect;
	}

	ConnectionCtrl.load();
}]);

