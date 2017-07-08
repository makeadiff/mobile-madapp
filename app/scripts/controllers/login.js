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

    // Logout the user 
	user_service.unsetUser();
 
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
				var now = new moment();

				if(connections.teacher_at.length && connections.mentor_at.length) { // User is a teacher AND mentor
					$location.path("/connections"); // Show Teacher/mentor choice page
					return;

				} else if(connections.teacher_at.length) {
					if(connections.teacher_at.length == 1) { // Just one class, go there.
						$location.path("/teacher").search({"class_id": connections.teacher_at[0].class_id});
						return;
					}

					// If there are more than one class the user is teaching - find if any class happens today - if so, redirect to that class.
					for(var i=0; i<connections.teacher_at.length; i++) {
						var difference_in_days = now.diff(moment(connections.teacher_at[i].class_on), 'days');

						if(!difference_in_days) { // Class is happening TODAY. Show the mentor page...
							$location.path("/teacher").search({"class_id": connections.teacher_at[i].class_id});
							return;
						}
					}

				} else if(connections.mentor_at.length) { // User is a mentor
					if(connections.mentor_at.length == 1) {
						$location.path("/mentor").search({"batch_id": connections.mentor_at[0].batch_id});
						return;
					}

					// If there are more than one class the user is mentoring - find if any class happens today - if so, redirect to that class.
					for(var i=0; i<connections.mentor_at.length; i++) {
						var difference_in_days = now.diff(moment(connections.mentor_at[i].class_on), 'days');

						if(!difference_in_days) { // Class is happening TODAY. Show the mentor page...
							$location.path("/mentor").search({"batch_id": connections.mentor_at[i].batch_id});
							return;
						}
					}
				} else {
					var access = 0;
					for(var pos in data.positions) { 
						if(data.positions[pos] != 'volunteer') access = 1; // Anything other than a volunteer gets a auto pass.
					}

					if(!access) {
						for(var i in data.groups) {
							if(data.groups[i] == "Mentors") access = 1; // If its a volunteer, then it must be a mentor to pass.
							else if(data.groups[i] == "ES Volunteer") access = 1; // or a teacher
						}
					}

					if(access) {
						$location.path("/connections");
						return;
					}
				}

				user_service.unsetUser();
				$location.path("/message").search({"error": "You don't have the neccessary permissions to access the app."});
				return;
			} else {
				LoginCtrl.error = data.error;
			}

		}).error(function(data) {
			LoginCtrl.error = data.error;

		});
	}
  
  
}]);
