'use strict';

/**
 * @ngdoc function
 * @name mobileApp.controller:ReportCtrl
 * @description
 * # ReportCtrl
 * Controller of the mobileApp
 */
angular.module('mobileApp')
  .controller('ReportCtrl', ['$scope', '$location', '$http', 'UserService', function ($scope, $location, $http, user_service) {
	var ReportCtrl = this;

	
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

  	ReportCtrl.user = user;
	
	ReportCtrl.reports = {
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

	ReportCtrl.load = function() {
		var connect = ReportCtrl._findConnection();
		if(!connect) return;

		// If the user is a teacher, show the teacher reports.
		if(connect.teacher && connect.teacher.level_id) {
			loading();
			$http({
				method: 'GET',
				url: base_url + 'teacher_report_aggregate',
				params: {level_id: connect.teacher.level_id, key: key}
			}).success(ReportCtrl.countProblems).error(error);
		}

		// If user is a mentor, show mentor reports.  
		if(connect.mentor && connect.mentor.batch_id) {
			loading();
			$http({
				method: 'GET',
				url: base_url + 'mentor_report_aggregate',
				params: {batch_id: connect.mentor.batch_id, key: key}
			}).success(ReportCtrl.countProblems).error(error);
		}
	}

	ReportCtrl.countProblems = function(data) {
		loaded();
		if(data.report_name == 'teacher_report_aggregate') {
			for(var key in data.reports) {
				ReportCtrl.reports.teacher[key].issue_count = data.reports[key];
			}
		}
		if(data.report_name == 'mentor_report_aggregate') {
			for(var key in data.reports) {
				ReportCtrl.reports.mentor[key].issue_count = data.reports[key];
			}
		}
	}

	$scope.formatDate = function(date){
		var date = date.split("-").join("/");
		var dateOut = new Date(date);
		return dateOut;
	};

	ReportCtrl._findConnection = function() {
		var connect = {};
		if(!user.connections) return false;

		if(user.connections.mentor_at.length)
			connect['mentor'] = user.connections.mentor_at[0];

		if(user.connections.teacher_at.length)
			connect['teacher'] = user.connections.teacher_at[0];

		return connect;
	}

	ReportCtrl.load();
}]);

