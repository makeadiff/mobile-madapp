'use strict';

/**
 * @ngdoc function
 * @name mobileApp.controller:LogoutCtrl
 * @description
 * # LogoutCtrl
 * Controller of the mobileApp
 */
angular.module('mobileApp')
  .controller('LogoutCtrl', ['$scope', '$location', 'UserService', function ($scope, $location, user_service) {
	loaded();

    // Logout the user 
    user_service.unsetUser();

    // $location.path("/login");
}]);
