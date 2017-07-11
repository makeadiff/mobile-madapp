'use strict';

/**
 * @ngdoc function
 * @name mobileApp.controller:ConnectionCtrl
 * @description
 * # ConnectionCtrl
 * Controller of the mobileApp
 */
angular.module('mobileApp')
  .controller('ConnectionCtrl', ['$scope', '$location', '$http', 'UserService', function ($scope, $location, $http, user_service) {
	var ConnectionCtrl = this;

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
  	user.classes_total = 0;
  	user.classes_took = 0;
  	user.classes_missed = 0;
  	ConnectionCtrl.user = user;
  	ConnectionCtrl.show_summary = 0;

	ConnectionCtrl.load = function() {
		if(user.connections.teacher_at.length) {
			loading();
			$http({
				method: 'GET',
				url: base_url + 'user_class_info',
				params: {user_id: ConnectionCtrl.user.user_id, key: key}
			}).success(ConnectionCtrl.userClassInfo).error(error);
		} else {
			loaded();
		}

		var connect = ConnectionCtrl._findConnection();
		if(!connect) return;
	}

	ConnectionCtrl.showSummary = function() {
		ConnectionCtrl.show_summary = ConnectionCtrl.show_summary ? 0 : 1;
	}

	ConnectionCtrl.userClassInfo = function(data) {
		loaded();

		ConnectionCtrl.user.classes_took = data.status_counts.attended;
		ConnectionCtrl.user.classes_missed = data.status_counts.absent;
		ConnectionCtrl.user.classes_total = data.status_counts.attended + data.status_counts.absent;
	}

	ConnectionCtrl.mentorClass = function(batch_id) {
		user_service.setUserData("active_batch", batch_id);
		$location.path("/mentor").search({"batch_id": batch_id});
	}

	ConnectionCtrl.teachClass = function(class_id) {
		user_service.setUserData("active_class", class_id);
		$location.path("/teacher").search({"class_id": class_id});
	}

	$scope.formatDate = function(date){
		var date = date.split("-").join("/");
		var dateOut = new Date(date);
		return dateOut;
	};

	ConnectionCtrl._findConnection = function() {
		var connect = {};
		if(!user || !user.connections) return false;

		if(user.connections.mentor_at.length)
			connect['mentor'] = user.connections.mentor_at[0];

		if(user.connections.teacher_at.length)
			connect['teacher'] = user.connections.teacher_at[0];

		return connect;
	}

	ConnectionCtrl.load();
}]);

