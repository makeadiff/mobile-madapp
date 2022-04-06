'use strict';
/**
 * @ngdoc function
 * @name mobileApp.controller:SelectClassCtrl
 * @description
 * # SelectClassCtrl
 * Controller of the mobileApp
 */
angular.module('mobileApp')
  .controller('SelectClassCtrl', ['$scope', '$location', '$http', 'UserService', function ($scope, $location, $http, user_service) {
	var SelectClassCtrl = this;
	var user = false;
	if(user_service.isLoggedIn()) {
		user = user_service.getUser();
		if(!user) {
			$location.path("/login");
			growl.addErrorMessage("Please login to continue", {ttl: 3000});
			return false;
		}
		var params = $location.search();

	} else {
		$location.path('/login')
	}
	SelectClassCtrl.user = user;
	SelectClassCtrl.selected_center = 0;
	SelectClassCtrl.selected_batch = 0;
	SelectClassCtrl.selected_level = 0;

	SelectClassCtrl.load = function() {
		SelectClassCtrl.loadCenters();
	}

	SelectClassCtrl.graphql = function(query, onSuccess) {
		loading();
		$http({
			method: 'POST',
			url: api_graphql_url,
			params: { query: query },
		}).success(function(data) {
			loaded();
			onSuccess(data)
		}).error(error);
	}

	SelectClassCtrl.loadCenters = function() {
		SelectClassCtrl.graphql(`{
			  centers(city_id: ${user.city_id}) {
			    id name
			    projects {
			      id name
			    }
			  }
			}`, SelectClassCtrl.showCenters);

	}
	SelectClassCtrl.showCenters = function(data) {
		if(data.error) {
			$location.path("/message").search({"error": data.error});
			return;
		}

		SelectClassCtrl.centers = data.data.centers;

		if(params.center_id) SelectClassCtrl.selectCenter(params.center_id);
	}

	SelectClassCtrl.selectCenter = function(center_id) {
		SelectClassCtrl.selected_center = center_id;
	  SelectClassCtrl.selected_batch = 0;

	  delete(SelectClassCtrl.projects)
	  delete(SelectClassCtrl.batches)
	  delete(SelectClassCtrl.levels)

	  SelectClassCtrl.graphql(`{
			  center(id: ${center_id}) {
			    projects {
			      id name
			    }
			  }
			}`, SelectClassCtrl.showProjects);
	}

	SelectClassCtrl.showProjects = function(data) {
		if(data.error) {
			$location.path("/message").search({"error": data.error});
			return;
		}

		SelectClassCtrl.projects = data.data.center.projects;

		if(params.project_id) SelectClassCtrl.selectProject(params.project_id);
		if(user.project_id) SelectClassCtrl.selectProject(user.project_id);
	}
	SelectClassCtrl.selectProject = function(project_id) {
	  SelectClassCtrl.selected_project = project_id;
		SelectClassCtrl.selected_batch = 0;

	  SelectClassCtrl.graphql(`{
			  batchSearch(center_id: ${SelectClassCtrl.selected_center}, project_id: ${project_id}) {
			  	id
			  	batch_name
			  	classes { id }
			  	levels { id level_name }
			  }
			}`, SelectClassCtrl.showBatchs);
	}

	SelectClassCtrl.showBatchs = function(data) {
		if(data.error) {
			$location.path("/message").search({"error": data.error});
			return;
		}
		SelectClassCtrl.batches = data.data.batchSearch.filter(batch => batch.classes.length > 0 && batch.levels.length > 0); // Remove all batches without any classess in it.
	}

	SelectClassCtrl.selectBatch = function(batch_id) {
		SelectClassCtrl.selected_batch = batch_id;
		var access = false;

		if(!access) {
			for(var pos in SelectClassCtrl.user.positions) {
				if(SelectClassCtrl.user.positions[pos] != 'volunteer') access = true; // Anything other than a volunteer gets a auto pass.
			}
		}
		if(!access) {
			for(var i in SelectClassCtrl.user.groups) {
				if(SelectClassCtrl.user.groups[i] == "Mentors") access = true; // If its a volunteer, then it must be a mentor to pass.
			}
		}

		if(params.action == "extra_class") {
			$location.path("/extra_class").search({"batch_id": batch_id});
			return;
		}

		access = false;

		// If the current user is any thing other than just a teacher, Open batch
		if(access) {
			$location.path("/mentor").search({"batch_id": batch_id});
			return;
		}

		// Go thru each element in the connection to find all the levels in the current batch.
		for(var i = 0; i<SelectClassCtrl.batches.length; i++) {
			if(SelectClassCtrl.batches[i].id == batch_id) {
				SelectClassCtrl.levels = SelectClassCtrl.batches[i].levels
				break
			}
		}
	}

	SelectClassCtrl.selectLevel = function(level_id) {
		$location.path("/teacher").search({"batch_id": SelectClassCtrl.selected_batch, "level_id": level_id});
	}

	SelectClassCtrl.load();
}]);

