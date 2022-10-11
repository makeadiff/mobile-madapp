'use strict';

/**
 * @ngdoc overview
 * @name mobileApp
 * @description
 * # mobileApp
 *
 * Main module of the application.
 */

// Hack to make sure the app uses https at all time. For some reason the mobile/app/ folder don't redirect to https
if(window.location.protocol == 'http:' && window.location.hostname == 'makeadiff.in') {
	window.location.href = 'https://' + window.location.hostname + window.location.pathname + window.location.hash;
}

var base_url = window.location.protocol + "//" + window.location.hostname + "/madapp/index.php/api/";
var api_base_url = window.location.protocol + "//" + window.location.hostname + "/api/v1/";
var api_graphql_url = window.location.protocol + "//" + window.location.hostname + "/api/graphql"

if(location.href.toString().match(/localhost/) || location.href.toString().match(/192\.168\./)) {
	  base_url = "http://localhost/MAD/madapp/index.php/api/";
	  api_base_url = "http://localhost/MAD/api/public/index.php/v1/";
	  api_graphql_url = "http://localhost/MAD/api/public/index.php/graphql";
}

var key = "or4W3@KOERUme#3";

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
			templateUrl: 'views/connections.html',
			resolve: {
			  style : function() {
				if( !angular.element('link#connections-css').length) {
				  angular.element('head').append('<link id="connections-css" href="styles/connections.css" rel="stylesheet">');
				}
			  }
			}
		})
	  .when('/faq', {
			templateUrl: 'views/faq.html'
		})
	  .when('/notifications', {
			templateUrl: 'views/notifications.html',
		})
	  .when('/teacher', {
			templateUrl: 'views/teacher.html',
			resolve: {
			  style : function() {
				if( !angular.element('link#teacher-css').length) {
				  angular.element('head').append('<link id="teacher-css" href="styles/teacher.css" rel="stylesheet">');
				  angular.element('head').append('<link href="node_modules/bootstrap-star-rating/css/star-rating.css" rel="stylesheet">');
				}
			  }
			}
	  })
	  .when('/mentor', {
			templateUrl: 'views/mentor.html',
			resolve: {
			  style : function() {
				if( !angular.element('link#mentor-css').length) {
				  angular.element('head').append('<link id="mentor-css" href="styles/mentor.css" rel="stylesheet">');
				}
			  }
			}
	  })
	  .when('/mentor_attendance', {
			templateUrl: 'views/mentor_attendance.html',
			resolve: {
			  style : function() {
				if( !angular.element('link#mentor-attendance-css').length) {
				  angular.element('head').append('<link id="mentor-css" href="styles/teacher.css" rel="stylesheet">');
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
			resolve: {
			  style : function() {
				if( !angular.element('link#connections-css').length) {
				  angular.element('head').append('<link id="connections-css" href="styles/connections.css" rel="stylesheet">');
				}
			  }
			}
	  })
	  .when('/extra_class', {
			templateUrl: 'views/extra_class.html'
	  })
	  .when('/mentor_report', {
			templateUrl: 'views/mentor_report.html',
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
	  })
	  .when('/impact_survey', {
			templateUrl: 'views/impact_survey.html',
			resolve: {
			  style : function() {
				if( !angular.element('link#report-css').length) {
				  angular.element('head').append('<link id="report-css" href="styles/report.css" rel="stylesheet">');
				}
			  }
			}
	  })
	  .when('/login', {
	  	templateUrl: 'views/connections.html',
			resolve: {
			  style : function() {
				if( !angular.element('link#connections-css').length) {
				  angular.element('head').append('<link id="connections-css" href="styles/connections.css" rel="stylesheet">');
				}
		  }
		}
		// templateUrl: 'views/login.html',
		// restricted : false,
		// resolve: {
		//   style : function() {
		// 	if( !angular.element('link#login-css').length) {
		// 	  angular.element('head').append('<link id="login-css" href="styles/login.css" rel="stylesheet">');
		// 	}
		//   }
		// }
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


mobileApp.run(['$localStorage','$rootScope', '$http', 'UserService',function ($localStorage,$rootScope, $http, user_service) {
	$rootScope.loginStatus = function() {
		if(!$localStorage.user) return 0;
		if(typeof $localStorage.user.user_id == "undefined") return 0;
		return $localStorage.user.user_id;
	};

	$rootScope.transformRequest = function(obj) {
		var str = [];
		for(var p in obj) { str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p])); }
		return str.join('&');
	}

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

	$rootScope.getTeacherGroupId = function(project_id) {
		let project_teacher_group_mapping = {
			1: 9,
			2: 376,
			4: 349,
			5: 348,
			6: 377
		};

		return project_teacher_group_mapping[project_id];
	}

	$rootScope.getMentorGroupId = function(project_id) {
		let project_mentor_group_mapping = {
			1: 8,
			2: 386,
			4: 272,
			5: 348,
			6: 378
		};

		return project_mentor_group_mapping[project_id];
	}

	$rootScope.request_headers = {
		'Content-Type': 'application/x-www-form-urlencoded', 
		'Authorization': 'Basic ' + window.btoa('sulu.simulation@makeadiff.in:pass')
	};

}]);

