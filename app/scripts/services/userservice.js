'use strict';

/**
 * @ngdoc service
 * @name mobileApp.UserService
 * @description
 * # UserService
 * Factory in the mobileApp.
 */
angular.module('mobileApp')
  .factory('UserService', ['$localStorage',function ($localStorage) {
        var user = {};

        user.setUser = function(user) {
            $localStorage.user = user;
            $localStorage.logged_in = true;
        }

        user.setUserData = function(name, value) {
            $localStorage.user[name] = value;
        }

        user.isLoggedIn = function() {
            return $localStorage.logged_in;
        }

        user.getUserId = function() {
            return $localStorage.user.user_id;
        }

        user.getUser = function() {
            return $localStorage.user;
        }

        user.unsetUser = function() {
            $localStorage.user = {};
            $localStorage.logged_in = false;
        }

        return user;
}]);
