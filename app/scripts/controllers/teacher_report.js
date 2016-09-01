'use strict';

/**
 * @ngdoc function
 * @name mobileApp.controller:TeacherReportCtrl
 * @description
 * # TeacherReportCtrl
 * Controller of the mobileApp
 */
angular.module('mobileApp')
  .controller('TeacherReportCtrl', ['$scope', '$location', '$http', 'growl', 'UserService', function ($scope, $location, $http, growl, user_service) {
	var TeacherReportCtrl = this;

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
  	TeacherReportCtrl.user = user;

  	TeacherReportCtrl.studentAttendance = function() {
  		TeacherReportCtrl.title = 'Absenteeism Report';

		var connect = TeacherReportCtrl._findConnection();
		if(!connect) return;
		loading();

		$http({
			method: 'GET',
			url: base_url + 'teacher_report_student_attendance',
			params: {level_id: connect.level_id, key: key}
		}).success(TeacherReportCtrl.showReport).error(error);
  	}


  	TeacherReportCtrl.checkForUnderstanding = function() {
  		TeacherReportCtrl.title = 'Check for Understanding Report';

		var connect = TeacherReportCtrl._findConnection();
		if(!connect) return;
		loading();

		$http({
			method: 'GET',
			url: base_url + 'teacher_report_check_for_understanding',
			params: {level_id: connect.level_id, key: key}
		}).success(TeacherReportCtrl.showReport).error(error);
  	}

  	TeacherReportCtrl.childParticipation = function() {
  		TeacherReportCtrl.title = 'Child Participation Report';

		var connect = TeacherReportCtrl._findConnection();
		if(!connect) return;
		loading();

		$http({
			method: 'GET',
			url: base_url + 'teacher_report_child_participation',
			params: {level_id: connect.level_id, key: key}
		}).success(TeacherReportCtrl.showReport).error(error);
  	}



	TeacherReportCtrl.load = function() {
		loaded();

		if(params.name == "student_attendance") TeacherReportCtrl.studentAttendance();
		else if(params.name == "check_for_understanding") TeacherReportCtrl.checkForUnderstanding();
		else if(params.name == "child_participation") TeacherReportCtrl.childParticipation();
	}

	TeacherReportCtrl.showReport = function(data) {
		loaded();
		TeacherReportCtrl.report = data.report;

	}

	TeacherReportCtrl._findConnection = function() {
		var connect = false;
		if(user.connections && user.connections.teacher_at.length) {
			connect = user.connections.teacher_at[0];
			if(connect) return connect;
			else {
				growl.addErrorMessage("Can't find any classes being taught by the current user.", {ttl: 3000});
			}
		}
		return false;
	}

	TeacherReportCtrl.load();
}]);

