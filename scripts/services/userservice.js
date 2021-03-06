'use strict';
// IMPORTANT Note. We are using PHP for session management. Login and auth is handled by PHP - apps/auth. It was handled by JS before, now that's depricated.

/**
 * @ngdoc service
 * @name mobileApp.UserService
 * @description
 * # UserService
 * Factory in the mobileApp.
 */
angular.module('mobileApp')
  .factory('UserService', ['$localStorage', '$cookies', '$http', '$location', function ($localStorage, $cookies, $http, $location) {
		var user = {};

		user.setUser = function(user) {
			$localStorage.user = user;
			$localStorage.logged_in = true;
		}

		user.setUserData = function(name, value) {
			$localStorage.user[name] = value;
		}

		user.isLoggedIn = function() {
			var logged_in = $localStorage.logged_in;
			if(logged_in) return logged_in;

			// var cookies = $cookies.getAll();
			// var email = cookies.email;
			// var auth_token = cookies.auth_token;

			// var that = this;
			// $http({
			// 	method: 'GET',
			// 	url: base_url + 'user_login',
			// 	params: {email: email, auth_token: auth_token, key: key}
			// }).success(function(data) {
			// 	if(data.success) {
			// 		that.setUser(data);
			// 		$location.path("/connections");
			// 	}
			// });

			// return false;
		}

		user.getUserId = function() {
			if(!$localStorage.user) return 0;
			if(!$localStorage.user.user_id == "undefined") return 0;

			return $localStorage.user.user_id;
		}

		user.getUser = function() {
			if(!$localStorage.user) {
				if(current_user) {
					user.updateUser(current_user);
					return current_user;
				} else {
					return false;
				}
			}
			
			return $localStorage.user;
		}

		user.updateUser = function(user_info, callback) {
			if(user_info) user.setUser(user_info);
			$http({
				method: 'GET',
				url: base_url + 'user_info/' + current_user.user_id
			}).success(function(data) {
				if(data) {
					user.setUser(data);
					if(callback) callback.call(data);
				}
			});
		}

		user.unsetUser = function() {
			$localStorage.user = {};
			$localStorage.logged_in = false;
			document.cookie = 'auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'; // Ideally should be $cookies.remove('auth_token'); - but doesn't work.
		}

		return user;
}]);
