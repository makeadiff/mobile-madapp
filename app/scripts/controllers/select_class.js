'use strict';
/**
 * @ngdoc function
 * @name mobileApp.controller:SelectClassCtrl
 * @description
 * # SelectClassCtrl
 * Controller of the mobileApp
 */
angular.module('mobileApp')
  .controller('SelectClassCtrl', ['$scope', '$location', '$http', 'UserService', function ($scope, $location, $http, user_service) {
	var SelectClassCtrl = this;
	var user = false;
	if(user_service.isLoggedIn()) {
  		user = user_service.getUser();
  		if(!user) {
  			$location.path("/login");
  			growl.addErrorMessage("Please login to continue", {ttl: 3000});
  			return false;
  		}
  		var params = $location.search();

  	} else {
  		$location.path('/login')
  	}
  	SelectClassCtrl.user = user;
  	SelectClassCtrl.selected_center = 0;
  	SelectClassCtrl.selected_batch = 0;
  	SelectClassCtrl.selected_level = 0;

	SelectClassCtrl.load = function() {
		//loaded();
		// var connect = SelectClassCtrl._findConnection();
		// if(!connect) return;
		SelectClassCtrl.loadCenters();
	}

	SelectClassCtrl.loadCenters = function() {
		loading();
		$http({
			method: 'GET',
			url: base_url + 'get_centers_in_city',
			params: {city_id: user.city_id, key: key}
		}).success(SelectClassCtrl.showCenters).error(error);
	}
	SelectClassCtrl.showCenters = function(data) {
		loaded();
		if(data.error) {
			$location.path("/message").search({"error": data.error});
			return;
		}
		SelectClassCtrl.centers = data.centers;
	}


	SelectClassCtrl.selectCenter = function(center_id) {
		loading();
		SelectClassCtrl.selected_center = center_id;
	  	SelectClassCtrl.selected_batch = 0;
	  	SelectClassCtrl.selected_level = 0;
		$http({
			method: 'GET',
			url: base_url + 'get_batches_and_levels_in_center',
			params: {center_id: center_id, key: key}
		}).success(SelectClassCtrl.showBatchsAndLevels).error(error);
	}
	SelectClassCtrl.showBatchsAndLevels = function(data) {
		loaded();
		if(data.error) {
			$location.path("/message").search({"error": data.error});
			return;
		}
		SelectClassCtrl.batches = data.batches;
		SelectClassCtrl.levels = data.levels;
		SelectClassCtrl.connection = data.connection;
	}

	SelectClassCtrl.selectBatch = function(batch_id) {
		SelectClassCtrl.selected_batch = batch_id;

		if(SelectClassCtrl.selected_level) {
			// Open batch
		}
	}

	SelectClassCtrl.selectLevel = function(level_id) {
		SelectClassCtrl.selected_level = level_id;

		if(SelectClassCtrl.selected_batch) {
			// Open batch
		}
	}

	SelectClassCtrl.isBatchActive = function(batch_id) {
		var level_id = SelectClassCtrl.selected_level;

		for(var i = 0; i<SelectClassCtrl.connection.length; i++) {
			if(	   SelectClassCtrl.connection[i].level_id == level_id
				&& SelectClassCtrl.connection[i].batch_id == batch_id) {
				return true;
			}
		}
		return false;
	}

	SelectClassCtrl.isLevelActive = function(level_id) {
		var batch_id = SelectClassCtrl.selected_batch;

		for(var i = 0; i<SelectClassCtrl.connection.length; i++) {
			if(	   SelectClassCtrl.connection[i].batch_id == batch_id
				&& SelectClassCtrl.connection[i].level_id == level_id) {
				return true;
			}
		}
		return false;
	}


	$scope.formatDate = function(date){
		var date = date.split("-").join("/");
		var dateOut = new Date(date);
		return dateOut;
	};

	SelectClassCtrl._findConnection = function() {
		var connect = {};
		if(!user || !user.connections) return false;

		if(user.connections.mentor_at.length)
			connect['mentor'] = user.connections.mentor_at[0];

		if(user.connections.teacher_at.length)
			connect['teacher'] = user.connections.teacher_at[0];

		return connect;
	}

	SelectClassCtrl.load();
}]);

