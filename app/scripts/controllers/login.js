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
            url: base_url + 'user_login',
            params: {email: user.username, password: user.password}
    	}).success(function(data) {
    		if(data.success) {
	    		LoginCtrl.user = data;
	    		user_service.setUser(LoginCtrl.user);

                if(LoginCtrl.user.mentor == "1") {
	    		    $location.path("/mentor");
                } else {
                    $location.path("/teacher");
                }
	    	} else {
	    		LoginCtrl.error = data.error;
	    	}

    	}).error(function(data) {
    		LoginCtrl.error = data.error;

    	});
	}

}]);
