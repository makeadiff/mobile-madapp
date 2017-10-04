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

		if(params.center_id) SelectClassCtrl.selectCenter(params.center_id);
	}


	SelectClassCtrl.selectCenter = function(center_id) {
		loading();
		SelectClassCtrl.selected_center = center_id;
	  	SelectClassCtrl.selected_batch = 0;
		$http({
			method: 'GET',
			url: base_url + 'get_batches_and_levels_in_center',
			params: {center_id: center_id, key: key}
		}).success(SelectClassCtrl.showBatchs).error(error);
	}
	SelectClassCtrl.showBatchs = function(data) {
		loaded();
		if(data.error) {
			$location.path("/message").search({"error": data.error});
			return;
		}
		SelectClassCtrl.batches = data.batches;
		SelectClassCtrl.all_levels = data.levels;
		SelectClassCtrl.connection = data.connection;
	}

	SelectClassCtrl.selectBatch = function(batch_id) {
		SelectClassCtrl.selected_batch = batch_id;
		var access = false;

		if(!access) {
			for(var pos in SelectClassCtrl.user.positions) {
				if(SelectClassCtrl.user.positions[pos] != 'volunteer') access = true; // Anything other than a volunteer gets a auto pass.
			}
		}
		if(!access) {
			for(var i in SelectClassCtrl.user.groups) {
				if(SelectClassCtrl.user.groups[i] == "Mentors") access = true; // If its a volunteer, then it must be a mentor to pass.
			}
		}

		if(params.action == "extra_class") {
			$location.path("/extra_class").search({"batch_id": batch_id});
			return;
		}

		// If the current user is any thing other than just a teacher, Open batch
		if(access) {
			$location.path("/mentor").search({"batch_id": batch_id});
			return;
		}

		var levels = [];
		// Go thru each element in the connection to find all the levels in the current batch.
		for(var i = 0; i<SelectClassCtrl.connection.length; i++) {
			if(SelectClassCtrl.connection[i].batch_id == batch_id) {
				var level_id = SelectClassCtrl.connection[i].level_id;
				for(var j = 0; j < SelectClassCtrl.all_levels.length; j++) {
					if(SelectClassCtrl.all_levels[j].id == level_id) {
						levels.push(SelectClassCtrl.all_levels[j]); // Put all the found levels into an array.
					}
				}
			}
		}
		SelectClassCtrl.levels = levels;
	}

	SelectClassCtrl.selectLevel = function(level_id) {
		$location.path("/teacher").search({"batch_id": SelectClassCtrl.selected_batch, "level_id": level_id});
	}

	SelectClassCtrl.load();
}]);

