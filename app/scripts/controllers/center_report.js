'use strict';

/**
 * @ngdoc function
 * @name mobileApp.controller:CenterReportCtrl
 * @description
 * # CenterReportCtrl
 * Controller of the mobileApp
 */
angular.module('mobileApp')
  .controller('CenterReportCtrl', ['$scope', '$location', '$http', 'growl', 'UserService', function ($scope, $location, $http, growl, user_service) {
	var CenterReportCtrl = this;

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
  	CenterReportCtrl.user = user;
  	CenterReportCtrl.data_unit = 'teachers';


  	CenterReportCtrl.childParticipation = function() {
  		CenterReportCtrl.title = 'Child Participation Report';

		var connect = CenterReportCtrl._findConnection();
		if(!connect) return;
		loading();

		CenterReportCtrl.data_unit = 'students';

		$http({
			method: 'GET',
			url: base_url + 'center_child_participation',
			params: {center_id: connect.center_id, key: key}
		}).success(CenterReportCtrl.showReport).error(error);
  	}


  	CenterReportCtrl.checkForUnderstanding = function() {
  		CenterReportCtrl.title = 'Check for Understanding Report';

		var connect = CenterReportCtrl._findConnection();
		if(!connect) return;
		loading();

		CenterReportCtrl.data_unit = 'students';

		$http({
			method: 'GET',
			url: base_url + 'center_child_cfu',
			params: {center_id: connect.center_id, key: key}
		}).success(CenterReportCtrl.showReport).error(error);
  	}

  	CenterReportCtrl.volunteerSubsitutions = function() {
  		CenterReportCtrl.title = 'Volunteer Substitutions Report';

		var connect = CenterReportCtrl._findConnection();
		if(!connect) return;
		loading();

		CenterReportCtrl.data_unit = 'teachers';

		$http({
			method: 'GET',
			url: base_url + 'center_volunteer_subsitutions',
			params: {center_id: connect.center_id, key: key}
		}).success(CenterReportCtrl.showReport).error(error);
  	}


	CenterReportCtrl.load = function() {
		loaded();

		if(params.name == "child_participation") CenterReportCtrl.childParticipation();
		else if(params.name == "check_for_understanding") CenterReportCtrl.checkForUnderstanding();
		else if(params.name == "volunteer_substitutions") CenterReportCtrl.volunteerSubsitutions();
	}

	CenterReportCtrl.showReport = function(data) {
		loaded();
		CenterReportCtrl.report = data.report;
	}

	CenterReportCtrl._findConnection = function() {
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

	CenterReportCtrl.load();
}]);

