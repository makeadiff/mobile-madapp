'use strict';

/**
 * @ngdoc function
 * @name mobileApp.controller:ConnectionCtrl
 * @description
 * # ConnectionCtrl
 * Controller of the mobileApp
 */
angular.module('mobileApp')
  .controller('ConnectionCtrl', ['$scope', '$location', '$http', 'UserService', function ($scope, $location, $http, user_service) {
	var ConnectionCtrl = this;

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
  	user.classes_total = 0;
  	user.classes_took = 0;
  	user.classes_missed = 0;
  	ConnectionCtrl.user = user;
  	ConnectionCtrl.show_summary = 0;
  	ConnectionCtrl.show_class_history = 0;
  	ConnectionCtrl.show_student_data_not_updated = 0;
  	ConnectionCtrl.show_class_student_data_not_updated = 0;
  	ConnectionCtrl.show_class_teacher_data_not_updated = 0;
  	ConnectionCtrl.show_class_volunteer_data_not_updated = 0;
  	ConnectionCtrl.show_teachers_with_negative_credits = 0;
  	ConnectionCtrl.show_substitution_info = 0;

	ConnectionCtrl.load = function() {
		if(user.connections.teacher_at.length) {
			loading();
			$http({
				method: 'GET',
				url: base_url + 'user_class_info',
				params: {user_id: ConnectionCtrl.user.user_id, key: key}
			}).success(ConnectionCtrl.userClassInfo).error(error);
		}
		if(user.connections.mentor_at.length) {
			loading();
			$http({
				method: 'GET',
				url: base_url + 'user_batch_info',
				params: {user_id: ConnectionCtrl.user.user_id, key: key}
			}).success(ConnectionCtrl.userBatchInfo).error(error);
		}
		
		var connect = ConnectionCtrl._findConnection();
		if(!connect) return;
	}

	ConnectionCtrl.userClassInfo = function(data) {
		loaded();

		ConnectionCtrl.user.classes_took	= data.status_counts.attended;
		ConnectionCtrl.user.classes_missed	= data.status_counts.absent;
		ConnectionCtrl.user.classes_total	= data.status_counts.attended + data.status_counts.absent;
		ConnectionCtrl.user.all_classes		= data.all_classes;
		ConnectionCtrl.user.student_data_not_updated= data.student_data_not_updated;
		ConnectionCtrl.user.student_data_not_updated_length = Object.keys(ConnectionCtrl.user.student_data_not_updated).length;
	}

	ConnectionCtrl.userBatchInfo = function(data) {
		loaded();

		ConnectionCtrl.user.batch_id	= data.batch_id;
		ConnectionCtrl.user.volunteer_data_not_updated	= data.volunteer_data_not_updated;
		// Do not show classes for future date.
		var filtered_volunteer_data_not_updated = ConnectionCtrl.user.volunteer_data_not_updated.filter(function (datevalue){
			var now = new moment();
			var datediff = now.diff(moment(datevalue), 'days');
			console.log(datevalue + " "+ datediff);
			return datediff > 0;
		});
		ConnectionCtrl.user.volunteer_data_not_updated = filtered_volunteer_data_not_updated;
		
		ConnectionCtrl.user.classes_where_student_data_not_updated	= data.student_data_not_updated;
		ConnectionCtrl.user.classes_where_student_data_not_updated_length = Object.keys(ConnectionCtrl.user.classes_where_student_data_not_updated).length;
		ConnectionCtrl.user.teachers_with_negative_credits	= data.teachers_with_negative_credits;
		ConnectionCtrl.user.substitution_info = data.substitution_info;
}

	ConnectionCtrl.mentorClass = function(batch_id) {
		user_service.setUserData("active_batch", batch_id);
		$location.path("/mentor").search({"batch_id": batch_id});
	}

	ConnectionCtrl.teachClass = function(class_id) {
		user_service.setUserData("active_class", class_id);
		$location.path("/teacher").search({"class_id": class_id});
	}

	$scope.formatDate = function(date){
		var date = date.split("-").join("/");
		var dateOut = new Date(date);
		return dateOut;
	};

	ConnectionCtrl._findConnection = function() {
		var connect = {};
		if(!user || !user.connections) return false;

		if(user.connections.mentor_at.length)
			connect['mentor'] = user.connections.mentor_at[0];

		if(user.connections.teacher_at.length)
			connect['teacher'] = user.connections.teacher_at[0];

		return connect;
	}

	ConnectionCtrl.load();
}]);

