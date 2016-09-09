'use strict';

/**
 * @ngdoc function
 * @name mobileApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the mobileApp
 */
angular.module('mobileApp')
  .controller('LoginCtrl', ['$scope', '$http', '$location', 'UserService', function ($scope, $http, $location, user_service) {
	loaded();
	var LoginCtrl = this;
	LoginCtrl.user = false;
	LoginCtrl.error = "";

	this.loginUser = function(user) {
		$http({
			method: 'GET',
			url: base_url + 'user_login',
			params: {email: user.username, password: user.password, key: key}
		}).success(function(data) {
			if(data.success) {
				LoginCtrl.user = data;
				user_service.setUser(LoginCtrl.user);
				var connections = data.connections;

				// Decide where to redirect the user to...
				var now = moment();

				if(connections.teacher_at.length) { // User is a teacher
					for(var i=0; i<connections.teacher_at.length; i++) {
						var difference_in_days = now.diff(moment(connections.teacher_at[i].class_on), 'days');

						if(!difference_in_days) { // Class is happening TODAY. Show the teacher page...
							$location.path("/teacher").search({"class_id": connections.teacher_at[i].class_id});
							return;
						}
					}

					// No classes happening today - go to the reports page.
					$location.path("/connections");
					return;
				}

				if(connections.teacher_at.length) { // User is a mentor
					for(var i=0; i<connections.mentor_at.length; i++) {
						var difference_in_days = now.diff(moment(connections.mentor_at[i].class_on), 'days');

						if(!difference_in_days) { // Class is happening TODAY. Show the mentor page...
							$location.path("/mentor").search({"batch_id": connections.mentor_at[i].batch_id});
							return;
						}
					}

					// No classes happening today - go to the reports page.
					$location.path("/connections");
					return;
				}
				
				// No positive matches - re-direct to common page.
				$location.path("/connections");
			} else {
				LoginCtrl.error = data.error;
			}

		}).error(function(data) {
			LoginCtrl.error = data.error;

		});
	}

}]);
