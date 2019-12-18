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

	<!-- Add to home screen for Safari on iOS -->
	<meta name="mobile-web-app-capable" content="yes">
	<meta name="apple-mobile-web-app-status-bar-style" content="black">
	<meta name="apple-mobile-web-app-title" content="MADApp">
	<link rel="apple-touch-icon" href="images/icons/icon-152x152.png">
	<!-- Add to home screen for Windows -->
	<meta name="msapplication-TileImage" content="images/icons/icon-144x144.png">
	<meta name="msapplication-TileColor" content="#2F3BA2">

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

	<!-- firebase messaging includes -->
	<script src="https://www.gstatic.com/firebasejs/6.6.2/firebase-app.js"></script>
	<script src="https://www.gstatic.com/firebasejs/6.6.2/firebase-messaging.js"></script>
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
// Initialize Firebase
var config = {
	apiKey: "AIzaSyBZ278HcsmVncMN7M4XThCnQfw-h72vqpA",
	authDomain: "upma-80899.firebaseapp.com",
	databaseURL: "https://upma-80899.firebaseio.com",
	projectId: "upma-80899",
	storageBucket: "upma-80899.appspot.com",
	messagingSenderId: "440196037821"
};
firebase.initializeApp(config);

var messaging = firebase.messaging();

if ('serviceWorker' in navigator) {
	window.addEventListener('load', function () {
		navigator.serviceWorker.register('./service-worker.js').then(function (registration) {
			// Registration was successful
			console.log('ServiceWorker registration successful with scope: ', registration.scope);
			messaging.useServiceWorker(registration);
			messaging.usePublicVapidKey("BOwB5gLBO4M7il8vdNf5Ftpej6-iMJ2iRv80NNx3QqWBEFOvZWSsCxIkaofYwm_KVKtxYCAlXNHVek4-cLA7Zo4");
		}, function (err) {
			// registration failed :(
			console.log('ServiceWorker registration failed: ', err);
		});

		// [START refresh_token]
		// Callback fired if Instance ID token is updated.
		messaging.onTokenRefresh(function () {
			if (JSON.parse(localStorage.getItem('ngStorage-user')).user_id != null) {
				messaging.getToken().then(function (refreshedToken) {
					console.log('Token refreshed.');
					// Indicate that the new Instance ID token has not yet been sent to the
					// app server.
					setTokenSentToServer(false);
					// Send Instance ID token to app server.
					sendTokenToServer(refreshedToken);
					// [END_EXCLUDE]
				}).catch(function (err) {
					console.log('Unable to retrieve refreshed token ', err);
					showToken('Unable to retrieve refreshed token ', err);
				});
			}
		});
		// [END refresh_token]

		//Foreground Notification behaviour
		messaging.onMessage(function (payload) {
			console.log('Message received. ', payload);
			// ...
		});


	});
}

// Detect Device - Android, Ios, Web
function detectmob() {
	if (navigator.userAgent.match(/Android/i)) {
		return "Android";
	}
	else if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i)) {
		return "Ios";
	}
	else {
		return "Web";
	}
}

// Send the Instance ID token your application server, so that it can:
// - send messages back to this app
// - subscribe/unsubscribe the token from topics
function sendTokenToServer(currentToken) {
	var user_id = JSON.parse(localStorage.getItem('ngStorage-user')).user_id;
	var fcm_regid = currentToken;
	var platform = detectmob();//"Web" "Android" "Ios"
	var app = "UPMA";//"Website" "UPMA" "Donut" ""
	var imei = "NULL-WEB-APP";

	var username = "sulu.simulation@makeadiff.in";
	var password = "pass";

	var base_url = window.location.protocol + '//'+window.location.hostname+'/api/v1/';

	if (!isTokenSentToServer()) {
		console.log('Sending token to server...');

		$.ajax({
			type: "post",
			url: base_url + "notifications", // http://localhost/MAD/api/v1/users", // "
			data: {
				"user_id": user_id,
				"fcm_regid": fcm_regid,
				"platform": platform, //"Web" "Android" "Ios"
				"app": app, //"Website" "UPMA" "Donut" ""
				"imei": imei
			},
			dataType: 'json',
			async: false,
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
			},
			success: function (result) {
				console.log("sent token to server success");
				setTokenSentToServer(true);
			},
			error: function (result, status, error) {
				var response = result.responseJSON;
				var error_message = [];
			}
		});

	} else {
		console.log('Token already sent to server so won\'t send it again  unless it changes');
	}
}

function isTokenSentToServer() {
	return window.localStorage.getItem('sentToServer') === '1';
}
function setTokenSentToServer(sent) {
	window.localStorage.setItem('sentToServer', sent ? '1' : '0');
}

</script>

<!-- <script src="https://cdn.lr-ingest.io/LogRocket.min.js" crossorigin="anonymous"></script>
<script>window.LogRocket && window.LogRocket.init('2obogn/upma');</script> -->
</body>
</html>