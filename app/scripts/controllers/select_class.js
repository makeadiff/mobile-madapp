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
	}

	SelectClassCtrl.selectBatch = function(batch_id) {
		// Open batch
		$location.path("/mentor").search({"batch_id": batch_id});
		return;
	}

	SelectClassCtrl.load();
}]);

