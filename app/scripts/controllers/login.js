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

    var LoginCtrl = this;
    LoginCtrl.user = false;
    LoginCtrl.error = "";

    this.loginUser = function(user) {
    	$http({
            method: 'GET',
            url: 'http://localhost/Projects/Madapp/index.php/api/user_login',
            params: {email: user.username, password: user.password}
    	}).success(function(data) {
    		if(data.success) {
	    		LoginCtrl.user = data;
	    		user_service.setUser(LoginCtrl.user);

	    		$location.path("/");
	    	} else {
	    		LoginCtrl.error = data.error;
	    	}

    	}).error(function(data) {
    		LoginCtrl.error = data.error;

    	});
	}

}]);
