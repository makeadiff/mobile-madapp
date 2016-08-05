'use strict';

/**
 * @ngdoc function
 * @name mobileApp.controller:MentorReportCtrl
 * @description
 * # MentorReportCtrl
 * Controller of the mobileApp
 */
angular.module('mobileApp')
  .controller('MentorReportCtrl', ['$scope', '$location', '$http', 'growl', 'UserService', function ($scope, $location, $http, growl, user_service) {
	var MentorReportCtrl = this;

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
  	MentorReportCtrl.user = user;
  	MentorReportCtrl.data_unit = 'teachers';

  	MentorReportCtrl.zeroHourAttendance = function() {
  		MentorReportCtrl.title = 'Zero Hour Attendance Report';

		var connect = MentorReportCtrl._findConnection();
		if(!connect) return;
		loading();

		$http({
			method: 'GET',
			url: base_url + 'mentor_report_zero_hour_attendance',
			params: {batch_id: connect.batch_id, key: key}
		}).success(MentorReportCtrl.showReport).error(error);
  	}


  	MentorReportCtrl.classSatisfaction = function() {
  		MentorReportCtrl.title = 'Class Satisfaction Report';

		var connect = MentorReportCtrl._findConnection();
		if(!connect) return;
		loading();

		$http({
			method: 'GET',
			url: base_url + 'mentor_class_satisfaction',
			params: {batch_id: connect.batch_id, key: key}
		}).success(MentorReportCtrl.showReport).error(error);
  	}

  	MentorReportCtrl.childParticipation = function() {
  		MentorReportCtrl.title = 'Child Participation Report';

		var connect = MentorReportCtrl._findConnection();
		if(!connect) return;
		loading();

		MentorReportCtrl.data_unit = 'students';

		$http({
			method: 'GET',
			url: base_url + 'mentor_child_participation',
			params: {batch_id: connect.batch_id, key: key}
		}).success(MentorReportCtrl.showReport).error(error);
  	}


  	MentorReportCtrl.checkForUnderstanding = function() {
  		MentorReportCtrl.title = 'Check for Understanding Report';

		var connect = MentorReportCtrl._findConnection();
		if(!connect) return;
		loading();

		MentorReportCtrl.data_unit = 'students';

		$http({
			method: 'GET',
			url: base_url + 'mentor_child_cfu',
			params: {batch_id: connect.batch_id, key: key}
		}).success(MentorReportCtrl.showReport).error(error);
  	}

	MentorReportCtrl.load = function() {
		loaded();

		if(params.name == "zero_hour_attendance") MentorReportCtrl.zeroHourAttendance();
		else if(params.name == "class_satisfaction") MentorReportCtrl.classSatisfaction();
		else if(params.name == "child_participation") MentorReportCtrl.childParticipation();
		else if(params.name == "check_for_understanding") MentorReportCtrl.checkForUnderstanding();
	}

	MentorReportCtrl.showReport = function(data) {
		loaded();
		MentorReportCtrl.report = data.report;

	}

	MentorReportCtrl._findConnection = function() {
		var connect = false;
		if(user.connections && user.connections.mentor_at.length) {
			connect = user.connections.mentor_at[0];
			if(connect) return connect;
			else {
				growl.addErrorMessage("Can't find any classes being taught by the current user.", {ttl: 3000});
			}
		}
		return false;
	}

	MentorReportCtrl.load();
}]);

