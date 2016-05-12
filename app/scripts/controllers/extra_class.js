'use strict';

/**
 * @ngdoc function
 * @name mobileApp.controller:ExtraClassCtrl
 * @description
 * # ExtraClassCtrl
 * Controller of the mobileApp
 */
angular.module('mobileApp')
  .controller('ExtraClassCtrl', ['$scope', '$location', '$http', 'UserService', function ($scope, $location, $http, user_service) {
	var ExtraClassCtrl = this;
	var user = user_service.getUser();
	var user_id = user.user_id;


	ExtraClassCtrl.load = function() {
		loading();

		console.log(user);
		
		$http({
			method: 'GET',
			url: base_url + 'all_levels_in_batch',
			params: {batch_id: user.active_batch, key: key}
		}).success(ExtraClassCtrl.setLevels); //.error(error);

	}

	ExtraClassCtrl.setLevels = function(data) {
		loaded();

		if(data.error) {
			$location.path("/message").search({"error": data.error});
			return;
		}

		ExtraClassCtrl.levels = data.levels;

	}

    
  }]);
