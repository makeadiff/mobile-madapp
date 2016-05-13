'use strict';

/**
 * @ngdoc function
 * @name mobileApp.controller:ExtraClassCtrl
 * @description
 * # ExtraClassCtrl
 * Controller of the mobileApp
 */
angular.module('mobileApp')
  .controller('ExtraClassCtrl', ['$scope', '$location', '$http', 'UserService', '$interval', function ($scope, $location, $http, user_service, $interval) {
	var ExtraClassCtrl = this;
	var user = user_service.getUser();
	var user_id = user.user_id;

	ExtraClassCtrl.load = function() {
		loading();
		
		$http({
			method: 'GET',
			url: base_url + 'all_levels_in_batch',
			params: {batch_id: user.active_batch, key: key}
		}).success(ExtraClassCtrl.setLevels).error(error);

	}

	ExtraClassCtrl.setLevels = function(data) {
		loaded();

		if(data.error) {
			$location.path("/message").search({"error": data.error});
			return;
		}

		ExtraClassCtrl.levels = data.levels;
	}

  ExtraClassCtrl.save = function() {
    var class_date = ExtraClassCtrl.class_date;
    var batch_id = user.active_batch;
    var levels = [];
    for(var i in ExtraClassCtrl.levels) {
      var l = ExtraClassCtrl.levels[i];
      if(l.selected) levels.push(l.id);
    }

    console.log(class_date, levels, batch_id);
  }

}]);
