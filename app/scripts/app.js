'use strict';

/**
 * @ngdoc overview
 * @name mobileApp
 * @description
 * # mobileApp
 *
 * Main module of the application.
 */


var base_url = "http://makeadiff.in/madapp/index.php/api/";
if(location.href.toString().match(/localhost/) || location.href.toString().match(/192\.168\./)) {
	  base_url = "http://localhost/madapp/index.php/api/";
}

var key = "am3omo32hom4lnv32vO";

var mobileApp = angular
  .module('mobileApp', [
	'ngAnimate',
	'ngCookies',
	'ngResource',
	'ngRoute',
	'ngSanitize',
	'ngTouch',
	'ngStorage',
	'angular-growl',
	'jkuri.datepicker',
	'toggle-switch'
  ])
  .config(function ($routeProvider) {
	$routeProvider
	  .when('/', {
		templateUrl: 'views/main.html',
		controller: 'MainCtrl',
		restricted : true
	  })
	  .when('/teacher', {
		templateUrl: 'views/teacher.html',
		controller: 'TeacherCtrl',
		restricted : true,
		resolve: {
		  style : function() {
			if( !angular.element('link#teacher-css').length) {
			  angular.element('head').append('<link id="teacher-css" href="styles/teacher.css" rel="stylesheet">');
			  angular.element('head').append('<link href="../bower_components/bootstrap-star-rating/css/star-rating.css" rel="stylesheet">');
			}
		  }
		}
	  })
	  .when('/mentor', {
		templateUrl: 'views/mentor.html',
		controller: 'MentorCtrl',
		restricted : true,
		resolve: {
		  style : function() {
			if( !angular.element('link#mentor-css').length) {
			  angular.element('head').append('<link id="mentor-css" href="styles/mentor.css" rel="stylesheet">');
			}
		  }
		}
	  })
	  .when('/about', {
		templateUrl: 'views/about.html',
		controller: 'AboutCtrl',
		restricted : false
	  })
	  .when('/message', {
		templateUrl: 'views/message.html',
		controller: 'MessageCtrl',
		restricted : false
	  })
	  .when('/connections', {
		templateUrl: 'views/connections.html',
		controller: 'ConnectionCtrl',
		restricted : true
	  })
	  .when('/extra_class', {
		templateUrl: 'views/extra_class.html',
		controller: 'ExtraClassCtrl',
		restricted : true
	  })
	  .when('/mentor_report', {
		templateUrl: 'views/mentor_report.html',
		controller: 'MentorReportCtrl',
		restricted : true,
		resolve: {
		  style : function() {
			if( !angular.element('link#report-css').length) {
			  angular.element('head').append('<link id="report-css" href="styles/report.css" rel="stylesheet">');
			}
		  }
		}
	  })
	  .when('/center_report', {
		templateUrl: 'views/center_report.html',
		controller: 'CenterReportCtrl',
		restricted : true,
		resolve: {
		  style : function() {
			if( !angular.element('link#report-css').length) {
			  angular.element('head').append('<link id="report-css" href="styles/report.css" rel="stylesheet">');
			}
		  }
		}
	  })
	  .when('/teacher_report', {
		templateUrl: 'views/teacher_report.html',
		controller: 'TeacherReportCtrl',
		restricted : true,
		resolve: {
		  style : function() {
			if( !angular.element('link#report-css').length) {
			  angular.element('head').append('<link id="report-css" href="styles/report.css" rel="stylesheet">');
			}
		  }
		}
	  })
	  .when('/reports', {
		templateUrl: 'views/reports.html',
		controller: 'ReportCtrl',
		restricted : true,
	  })
	  .when('/login', {
		templateUrl: 'views/login.html',
		controller: 'LoginCtrl',
		restricted : false,
		resolve: {
		  style : function() {
			if( !angular.element('link#login-css').length) {
			  angular.element('head').append('<link id="login-css" href="styles/login.css" rel="stylesheet">');
			}
		  }
		}
	  })
	  .otherwise({
		redirectTo: '/login'
	  });
  });

function error(message) {
  loaded();
  if(!message) message = "Please try again after a while";
  alert("Error: " + message);
}
function loading() {
  angular.element("#loading").show();
}
function loaded() {
  angular.element("#loading").hide();
}
loading();

mobileApp.run(['$localStorage','$rootScope',function ($localStorage,$rootScope) {
        $rootScope.loginStatus = function() {
        	if(!$localStorage.user) return 0;
            if(!$localStorage.user.user_id == "undefined") return 0;
            return $localStorage.user.user_id;
            
        };

    }
]);

