'use strict';

/**
 * @ngdoc function
 * @name mobileApp.controller:ReportCtrl
 * @description
 * # ReportCtrl
 * Controller of the mobileApp
 */
angular.module('mobileApp')
  .controller('ReportCtrl', ['$scope', '$location', '$http', 'growl', 'UserService', function ($scope, $location, $http, growl, user_service) {
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

  	ReportCtrl.studentAbsenteeism = function() {
  		ReportCtrl.title = 'Absenteeism Report';

		var connect = ReportCtrl._findConnection();
		if(!connect) return;
		loading();

		$http({
			method: 'GET',
			url: base_url + 'report_student_absenteeism',
			params: {level_id: connect.level_id, key: key}
		}).success(ReportCtrl.showReport).error(error);
  	}


  	ReportCtrl.checkForUnderstanding = function() {
  		ReportCtrl.title = 'Check for Understanding Report';

		var connect = ReportCtrl._findConnection();
		if(!connect) return;
		loading();

		$http({
			method: 'GET',
			url: base_url + 'report_check_for_understanding',
			params: {level_id: connect.level_id, key: key}
		}).success(ReportCtrl.showReport).error(error);
  	}


	ReportCtrl.load = function() {
		loaded();

		if(params.name == "student_absenteeism") ReportCtrl.studentAbsenteeism();
		else if(params.name == "check_for_understanding") ReportCtrl.checkForUnderstanding();
	}

	ReportCtrl.showReport = function(data) {
		loaded();
		ReportCtrl.report = data.report;

	}

	ReportCtrl._findConnection = function() {
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

	ReportCtrl.load();
}]);

