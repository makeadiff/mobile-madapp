'use strict';

/**
 * @ngdoc function
 * @name mobileApp.controller:ExtraClassCtrl
 * @description
 * # ExtraClassCtrl
 * Controller of the mobileApp
 */
angular.module('mobileApp')
  .controller('ExtraClassCtrl', ['$scope', '$location', '$http', 'growl', 'UserService', '$interval', function ($scope, $location, $http, growl, user_service, $interval) {
	var ExtraClassCtrl = this;
	var user = user_service.getUser();
	var user_id = user.user_id;
	var batch_id = 0;
	var params = $location.search();
	if(user.active_batch) batch_id = user.active_batch;
	else if(params.batch_id) batch_id = params.batch_id;

	ExtraClassCtrl.load = function() {
		loading();
		
		$http({
			method: 'GET',
			url: base_url + 'all_levels_in_batch',
			params: {"batch_id": batch_id, key: key}
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
    var class_on = ExtraClassCtrl.class_on;
    var levels = [];
    for(var i in ExtraClassCtrl.levels) {
      var l = ExtraClassCtrl.levels[i];
      if(l.selected) levels.push(l.id);
    }

    loading();
		
	$http({
		method: 'POST',
		url: base_url + 'save_extra_class',
		params: {batch_id: batch_id, class_on: class_on, levels: angular.toJson(levels), key: key}
	}).success(function (data) {
		loaded();
		if(data.success) {
			$location.path("/mentor").search({batch_id: batch_id, class_on: class_on});

			if(data.classes.length == 0) {
				growl.addSuccessMessage("Classes already exist on that day", {ttl: 3000});
			} else {
				growl.addSuccessMessage("Added the Extra Class.", {ttl: 3000});
			}

		} else
			growl.addErrorMessage("Couldn't add the extra class.", {ttl: 3000});

	}).error(error);
  }

}]);
