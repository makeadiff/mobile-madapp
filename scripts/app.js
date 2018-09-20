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
// if(location.href.toString().match(/localhost/) || location.href.toString().match(/192\.168\./)) {
// 	  base_url = "http://192.168.1.13/Projects/Madapp/index.php/api/";
// }

var key = "am3omo32hom4lnv32vO";

var mobileApp = angular.module('mobileApp', [
	'ngAnimate',
	'ngCookies',
	'ngResource',
	'ngRoute',
	'ngSanitize',
	'ngTouch',
	'ngStorage',
	'angular-growl',
	'jkuri.datepicker'
  ])
  .config(function ($routeProvider) {
	$routeProvider
	  .when('/', {
		templateUrl: 'views/main.html',
		restricted : true
	  })
	  .when('/teacher', {
		templateUrl: 'views/teacher.html',
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
		restricted : false
	  })
	  .when('/message', {
		templateUrl: 'views/message.html',
		restricted : false
	  })
	  .when('/connections', {
		templateUrl: 'views/connections.html',
		restricted : true,
		resolve: {
		  style : function() {
			if( !angular.element('link#connections-css').length) {
			  angular.element('head').append('<link id="connections-css" href="styles/connections.css" rel="stylesheet">');
			}
		  }
		}
	  })
	  .when('/extra_class', {
		templateUrl: 'views/extra_class.html',
		restricted : true
	  })
	  .when('/mentor_report', {
		templateUrl: 'views/mentor_report.html',
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
		restricted : true,
		resolve: {
		  style : function() {
			if( !angular.element('link#report-css').length) {
			  angular.element('head').append('<link id="report-css" href="styles/report.css" rel="stylesheet">');
			}
		  }
		}
	  })
	  .when('/select_class', {
		templateUrl: 'views/select_class.html',
		restricted : true,
	  })
	  .when('/impact_survey', {
		templateUrl: 'views/impact_survey.html',
		restricted : true,
		resolve: {
		  style : function() {
			if( !angular.element('link#report-css').length) {
			  angular.element('head').append('<link id="report-css" href="styles/report.css" rel="stylesheet">');
			}
		  }
		}
	  })
	  .when('/login', {
		templateUrl: 'views/login.html',
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


mobileApp.run(['$localStorage','$rootScope', '$http',function ($localStorage,$rootScope, $http) {
		$rootScope.loginStatus = function() {
			if(!$localStorage.user) return 0;
			if(typeof $localStorage.user.user_id == "undefined") return 0;
			return $localStorage.user.user_id;
		};

		$rootScope.$on("$stateChangeStart", function(event, curr, prev){
		  if ($loginStatus.user) {
		      window.Intercom("boot", {
		        app_id: "xnngu157",
		        email: $localStorage.user.email,
		        name: $localStorage.user.name,
		        user_id: $localStorage.user.user_id,
		        widget: {
		          activator: "#IntercomDefaultWidget"
		        }
		    });
		 }
		});

		$rootScope.reportStatus = function() {
			if(typeof $rootScope.reportIssueCount != "undefined") return false;
			$rootScope.reportIssueCount = 0;
			$rootScope.reportIssuePercentage = 0;
			var user_id = $rootScope.loginStatus();
			if(!user_id) return false;
			var user = $localStorage.user;

			if(!user.connections) return false;
			var connect = {};

			if(user.connections.mentor_at.length) connect['mentor'] = user.connections.mentor_at[0];
			if(user.connections.teacher_at.length) connect['teacher'] = user.connections.teacher_at[0];

			var issue_count = 0;
			var reports_count = 0;
			var reports_with_issues = 0;

			if(connect.teacher && connect.teacher.level_id) {
				$http({
					method: 'GET',
					url: base_url + 'teacher_report_aggregate',
					params: {level_id: connect.teacher.level_id, key: key}
				}).success(function(data) {
					issue_count = 0;
					for(var key in data.reports) {
						issue_count += data.reports[key];
						if(data.reports[key]) reports_with_issues++;
						reports_count++;
					}
					$rootScope.reportIssueCount += issue_count;
					$rootScope.reportIssuePercentage = Math.ceil(reports_with_issues / reports_count * 100);

				}).error(error);
			}

			// If user is a mentor, show mentor reports.
			if(connect.mentor && connect.mentor.batch_id) {
				$http({
					method: 'GET',
					url: base_url + 'mentor_report_aggregate',
					params: {batch_id: connect.mentor.batch_id, key: key}
				}).success(function(data) {
					issue_count = 0;

					for(var key in data.reports) {
						issue_count += data.reports[key];
						if(data.reports[key]) reports_with_issues++;
						reports_count++;
					}
					$rootScope.reportIssueCount += issue_count;
					$rootScope.reportIssuePercentage = Math.ceil(reports_with_issues / reports_count * 100);

				}).error(error);
			}
		}();
	}
]);

