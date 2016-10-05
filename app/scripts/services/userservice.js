'use strict';

/**
 * @ngdoc service
 * @name mobileApp.UserService
 * @description
 * # UserService
 * Factory in the mobileApp.
 */
angular.module('mobileApp')
  .factory('user_service', ['$localStorage',function ($localStorage) {
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
            if(!$localStorage.user) return 0;
            if(!$localStorage.user.user_id == "undefined") return 0;

            return $localStorage.user.user_id;
        }

        user.getUser = function() {
            if(!$localStorage.user) return false;
            
            return $localStorage.user;
        }

        user.unsetUser = function() {
            $localStorage.user = {};
            $localStorage.logged_in = false;
        }
        console.log($localStorage.user);
        return user;
}]);

// Creating a new service 
angular.module('mobileApp')
  .service('ReportService',['$localStorage','$location','user_service',function ($localStorage,user_service) {
        
    var user = {};
  
    if(user_service.isLoggedIn()) {
        var user = user_service.getUser();
        if(!user) {
            $location.path("/login");
            growl.addErrorMessage("Please login to continue", {ttl: 3000});
            return false;
        }
        var params = $location.search();

    } else {
        $location.path('/login')
    }

    user.getReport = function(reportUser){

         reportUser.reports = {
            "teacher": {
                    "student_attendance"        : {"name" : "Student Attendance", "issue_count" : 0},
                    "check_for_understanding"   : {"name" : "Check For Understanding", "issue_count" : 0},
                    "child_participation"       : {"name" : "Child Participation", "issue_count" : 0}
                },
            "mentor": {
                    // "student_attendance"     : {"name" : "Student Attendance", "issue_count" : 0},
                    "check_for_understanding"   : {"name" : "Check For Understanding", "issue_count" : 0},
                    "child_participation"       : {"name" : "Child Participation", "issue_count" : 0},
                    // "teacher_satisfaction"   : {"name" : "Teacher Satisfaction", "issue_count" : 0},
                    "zero_hour_attendance"      : {"name" : "Zero Hour Attendance", "issue_count" : 0},
                    "class_satisfaction"        : {"name" : "Class Satisfaction", "issue_count" : 0}
            }
        };
    }

    user.load = function(reportUser) {
        var connect = reportUser._findConnection();
        if(!connect) return;

        // If the user is a teacher, show the teacher reports.
        if(connect.teacher && connect.teacher.level_id) {
            loading();
            $http({
                method: 'GET',
                url: base_url + 'teacher_report_aggregate',
                params: {level_id: connect.teacher.level_id, key: key}
            }).success(reportUser.countProblems).error(error);
        }

        // If user is a mentor, show mentor reports.  
        if(connect.mentor && connect.mentor.batch_id) {
            loading();
            $http({
                method: 'GET',
                url: base_url + 'mentor_report_aggregate',
                params: {batch_id: connect.mentor.batch_id, key: key}
            }).success(reportUser.countProblems).error(error);
        }
    }

    user.countProblems = function(data) {
        loaded();
        if(data.report_name == 'teacher_report_aggregate') {
            for(var key in data.reports) {
                ReportCtrl.reports.teacher[key].issue_count = data.reports[key];
                
            }
        }
        if(data.report_name == 'mentor_report_aggregate') {
            for(var key in data.reports) {
                reportUser.reports.mentor[key].issue_count = data.reports[key];
            }
        }
    }

  user.iscountRed = function(data){
        loaded();
        var count = 0;
        var i = 0; // no. of metrics
        if(data.report_name == 'teacher_report_aggregate') {
            for(var key in data.reports) {
                if(reportUser.reports.teacher[key].issue_count > 0){
                    count+=1;
                }
            i = i+1;           
            }
        }
        if(data.report_name == 'mentor_report_aggregate') {
            for(var key in data.reports) {
                if(reportUser.reports.teacher[key].issue_count > 0){
                    count+=1;
                }   
            i=i+1;
            }

        }
        if((count/i) > 0.25 ){
            return true;
            console.log('More than 25%');
        }
        else{
            return false;
            console.log('Less than 25%');
        }
    };


    $scope.formatDate = function(date){
        var date = date.split("-").join("/");
        var dateOut = new Date(date);
        return dateOut;
    };

    user._findConnection = function() {
        var connect = {};
        if(!user.connections) return false;

        if(user.connections.mentor_at.length)
            connect['mentor'] = user.connections.mentor_at[0];

        if(user.connections.teacher_at.length)
            connect['teacher'] = user.connections.teacher_at[0];

        return connect;
    }

    reportUser.load();
    console.log(reportUser.reports);
    


  }]);
