'use strict';

/**
 * @ngdoc directive
 * @name mobileApp.directive:checkUser
 * @description
 * # checkUser
 */
angular.module('mobileApp')
  .directive('checkUser', ['$rootScope','$location','UserService',function($root,$location,user_service){
        return {
            link : function(scope,elem,attrs,ctrl) {
                $root.$on('$routeChangeStart', function(event, next, current){
                    if (next.restricted) {
                        if(!user_service.isLoggedIn()) {
                            $location.path('/login');
                        }
                    }
                });
            }
        };
}]);
