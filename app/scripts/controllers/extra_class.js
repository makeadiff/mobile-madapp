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


	// Use x-www-form-urlencoded Content-Type
	$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

	/**
	* The workhorse; converts an object to x-www-form-urlencoded serialization.
	* @param {Object} obj
	* @return {String}
	*/ 
	var param = function(obj) {
		var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
		  
		for(name in obj) {
		  value = obj[name];
			
		  if(value instanceof Array) {
			for(i=0; i<value.length; ++i) {
			  subValue = value[i];
			  fullSubName = name + '[' + i + ']';
			  innerObj = {};
			  innerObj[fullSubName] = subValue;
			  query += param(innerObj) + '&';
			}
		  }
		  else if(value instanceof Object) {
			for(subName in value) {
			  subValue = value[subName];
			  fullSubName = name + '[' + subName + ']';
			  innerObj = {};
			  innerObj[fullSubName] = subValue;
			  query += param(innerObj) + '&';
			}
		  }
		  else if(value !== undefined && value !== null)
			query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
		}
		  
		return query.length ? query.substr(0, query.length - 1) : query;
	};

	// Override $http service's default transformRequest
	$http.defaults.transformRequest = [function(data) {
		return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
	}];

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
    var class_on = ExtraClassCtrl.class_on;
    var batch_id = user.active_batch;
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

			growl.addSuccessMessage("Added the Extra Class.", {ttl: 3000});
		} else
			growl.addErrorMessage("Couldn't add the extra class.", {ttl: 3000});

	}).error(error);
  }

}]);
