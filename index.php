<?php
include 'common.php';

$_SESSION['theme'] = 'darkly'; // This will make sure that the color of Auth will be close to what UPMA is

// IMPORTANT Note. We are using PHP for session management. Login and auth is handled by PHP - apps/auth. It was handled by JS before, now that's depricated.
$current_user = accessControl([]);
$current_user['user_id'] = $current_user['id'];
?><!doctype html>
<html class="no-js">
<head>
	<meta charset="utf-8">
	<title>UPMA</title>
	<meta name="description" content="">
	<meta name="viewport" content="width=device-width,  initial-scale=1.0">
	<link rel="manifest" href="./manifest.json">

	<!-- Place favicon.ico and apple-touch-icon.png in the root directory -->
	<!-- build:css(.) styles/vendor.css -->
	<!-- bower:css -->
	
	<link rel="stylesheet" type="text/css" href="styles/themes/darkly.css" />
	<link rel="stylesheet" type="text/css" href="deprecated_modules/_angular-growl/build/angular-growl.min.css" />
	<link rel="stylesheet" type="text/css" href="node_modules/font-awesome/css/font-awesome.min.css" />
	<link rel="stylesheet" type="text/css" href="deprecated_modules/_ngDatepicker/src/css/ngDatepicker.css" />
	<link rel="stylesheet" type="text/css" href="node_modules/bootstrap-toggle/css/bootstrap-toggle.min.css" />
	<link rel="stylesheet" href="node_modules/bootstrap-star-rating/css/star-rating.css" />
	<!-- endbower -->
	<!-- endbuild -->

	<!-- build:css(.tmp) styles/main.css -->
	<link rel="stylesheet" href="styles/main.css">
	<!-- endbuild -->
</head>

<body ng-app="mobileApp">
	<div id="loading">loading...</div>

	<!--[if lt IE 7]>
	  <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
	<![endif]-->

	<!-- Add your site or application content here -->
	<div class="header">
		<div class="navbar navbar-default" role="navigation">
			<div class="container">
				<div class="navbar-header">
					<a class="navbar-brand" href="#/connections"><span class="glyphicon glyphicon-home"></span> Home</a>
					<a class="navbar-brand" href="https://makeadiff.in/apps/auth/logout.php"><span class="glyphicon glyphicon-log-out"></span> Logout</a>
				</div>

			</div>
		</div>
	</div>
	<div growl></div>

	<div id="content" class="container">
		<div ng-view=""></div>
	</div>

	<div class="kc_fab_wrapper"></div>

	<!-- build:js(.) scripts/vendor.js -->
	<!-- bower:js -->
	<script src="node_modules/jquery/dist/jquery.js"></script>
	<script src="node_modules/angular/angular.js"></script>
	<script src="node_modules/bootstrap/dist/js/bootstrap.js"></script>
	<script src="node_modules/angular-animate/angular-animate.js"></script>
	<script src="node_modules/angular-cookies/angular-cookies.js"></script>
	<script src="node_modules/angular-resource/angular-resource.js"></script>
	<script src="node_modules/angular-route/angular-route.js"></script>
	<script src="node_modules/angular-sanitize/angular-sanitize.js"></script>
	<script src="node_modules/angular-touch/angular-touch.js"></script>
	<script src="node_modules/ngstorage/ngStorage.js"></script>
	<script src="node_modules/bootstrap-star-rating/js/star-rating.min.js"></script>
	<script src="deprecated_modules/_angular-growl/build/angular-growl.js"></script>
	<script src="node_modules/moment/moment.js"></script>
	<script src="deprecated_modules/_ngDatepicker/src/js/ngDatepicker.js"></script>
	<script src="node_modules/bootstrap-toggle/js/bootstrap-toggle.min.js"></script>
	<!-- endbower -->
	<!-- endbuild -->

	<!-- build:js({.tmp,app}) scripts/scripts.js -->
	<script src="scripts/app.js"></script>
	<script src="scripts/controllers/main.js"></script>
	<script src="scripts/controllers/about.js"></script>
	<script src="scripts/controllers/login.js"></script>
	<script src="scripts/controllers/teacher.js"></script>
	<script src="scripts/controllers/mentor.js"></script>
	<script src="scripts/controllers/message.js"></script>
	<script src="scripts/controllers/connections.js"></script>
	<script src="scripts/controllers/extra_class.js"></script>
	<script src="scripts/controllers/teacher_report.js"></script>
	<script src="scripts/controllers/mentor_report.js"></script>
	<script src="scripts/controllers/center_report.js"></script>
	<script src="scripts/controllers/reports.js"></script>
	<script src="scripts/controllers/select_class.js"></script>
	<script src="scripts/controllers/impact_survey.js"></script>
	<script src="scripts/controllers/mentor_attendance.js"></script>
	<script src="scripts/controllers/faq.js"></script>
	<script src="scripts/controllers/notifications.js"></script>

	<script src="scripts/services/userservice.js"></script>
	<script src="scripts/directives/checkuser.js"></script>
	<!-- endbuild -->

<script>
var current_user = <?php echo json_encode($current_user); ?>;
</script>

<!-- <script src="https://cdn.lr-ingest.io/LogRocket.min.js" crossorigin="anonymous"></script>
<script>window.LogRocket && window.LogRocket.init('2obogn/upma');</script> -->
</body>
</html>