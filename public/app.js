var app = angular.module('yantema', ['ngRoute']);

app.config(function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'templates/workspace.html',
			controller: 'posts'
		})
		.when('/login', {
			templateUrl: 'templates/login.html',
			controller: 'login'
		})
		.otherwise({
			redirectTo: '/'
		});

	$locationProvider.html5Mode(true);
});

var CLIENT_ID = '728048305195-eb68s05cjabi4o0jlda7ve3jlnv3snqd.apps.googleusercontent.com';
var SCOPES = ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/tasks'];

function onApiClientReady() {
	app.value('apiLoaded', true);
}

app.controller('posts', ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout) {

	$scope.posts = [];
	$scope.tasks = [];
	$scope.form = {};
	$scope.dayFullness = 0;

	$scope.loadDay = function(day) {
		$scope.day = day;
		var tomorrow = moment(day).add(1, 'days');

		var request = gapi.client.calendar.events.list({
			calendarId: 'primary',
			timeMin: day.format(),
			timeMax: tomorrow.format(),
			showDeleted: false,
			singleEvents: true,
			orderBy: 'startTime'
		});

		request.execute(function(response) {
			$scope.posts = response.items;
			$scope.dayFullness = getDayFullness();
			$scope.$apply();

			$timeout(function() {
				reportsAutosize(true);
			});
		});
	};

	$scope.loadTasks = function() {
		var request = gapi.client.tasks.tasks.list({
			tasklist: '@default'
		});

		request.execute(function(response) {
			angular.forEach(response.items, function(value, key) {
				value.hierarchy = (typeof value.parent == 'undefined') ? 'top' : 'subtask';
				response.items[key] = value;
			});
			$scope.tasks = response.items;
			$scope.$apply();
		});
	};

	$scope.checkTask = function(task) {
		var request = gapi.client.tasks.tasks.update({
			task: task.id,
			tasklist: '@default',
			id: task.id,
			status: task.status == 'completed' ? 'needsAction' : 'completed'
		});

		request.execute(function(response) {
			task = response;
			$scope.$apply();
		});
	};

	$scope.isBigTask = function(task) {
		var bigTask = false;
		angular.forEach($scope.tasks, function(item) {
			if (task.id == item.parent) {
				bigTask = true;
				return false;
			}
		});
		return bigTask;
	};

	$scope.addPost = function() {
		var day = moment($scope.day);
		var start = $scope.form.since.split(':');
		var end = $scope.form.till.split(':');

		var event = {
			summary: $scope.form.summary,
			start: {
				dateTime: day.set('hour', start[0]).set('minute', start[1]).format(),
				timeZone: 'Europe/Kiev'
			},
			end: {
				dateTime: day.set('hour', end[0]).set('minute', end[1]).format(),
				timeZone: 'Europe/Kiev'
			}
		};
		if ($scope.form.task) {
			event.description = 'task:' + $scope.form.task.id;
		}

		var request = gapi.client.calendar.events.insert({
			calendarId: 'primary',
			resource: event
		});

		request.execute(function(event) {
			$scope.form = {};
			$scope.loadDay($scope.day);
		});
	};

	$scope.removePost = function(post) {
		var request = gapi.client.calendar.events.delete({
			calendarId: 'primary',
			eventId: post.id
		});

		request.execute(function(event) {
			$scope.loadDay($scope.day);
		});
	};

	$scope.printPostClasses = function(post) {
		return /task:/.test(post.description) ? ['useful'] : null;
	};

	$scope.displayDuration = function(since, till) {
		var duration = calculateDuration(since, till);
		return duration.humanize().replace(/ ([a-zа-я])[a-zа-я]+$/i, ' $1');
	};

	function getDayFullness() {
		var totalDuration = moment.duration(0);
		angular.forEach($scope.posts, function(post) {
			var postDuration = calculateDuration(post.start.dateTime, post.end.dateTime);
			totalDuration.add(postDuration);
		});
		return (totalDuration.asMinutes() / 1440) * 100;
	}

	function calculateDuration(since, till) {
		var start = moment(since);
		var end = moment(till);
		return moment.duration(end.diff(start));
	}

	if (!$rootScope.apiLoaded) {
		$scope.$watch($rootScope.apiLoaded, function() {
			$timeout(authorize);
		});
	} else {
		authorize();
	}

	function authorize() {
		gapi.auth.authorize({
			//jscs:disable requireCamelCaseOrUpperCaseIdentifiers
			client_id: CLIENT_ID,
			scope: SCOPES,
			immediate: true
			//jscs:enable requireCamelCaseOrUpperCaseIdentifiers
		}, function handleAuthResult(authResult) {
			if (authResult && !authResult.error) {
				gapi.client.load('calendar', 'v3', function() {
					var today = moment().set('hour', 0).set('minute', 0).set('second', 0);
					$scope.loadDay(today);
				});
				gapi.client.load('tasks', 'v1', function() {
					$scope.loadTasks();
				});
			} else {
				window.location.href = '/login';
			}
		});
	}

	$('.time-select .time').timepicker({
		showDuration: true,
		timeFormat: 'H:i',
		lang: {
			mins: 'м',
			hr: 'ч',
			hrs: 'ч'
		}
	});
	$('.time-select').datepair();

}]);

app.filter('moment', function() {
	return function(input, format) {
		return input ? input.format(format) : format;
	};
});

app.filter('capitalizeFirstLetter', function() {
	return function(input) {
		return input ? input.charAt(0).toUpperCase() + input.slice(1) : '';
	};
});

app.controller('login', ['$scope', '$rootScope', function($scope, $rootScope) {

	$scope.apiClientReady = false;
	$scope.authFailed = false;

	if (!$rootScope.apiLoaded) {
		$scope.$watch($rootScope.apiLoaded, function() {
			$scope.apiClientReady = true;
		});
	} else {
		$scope.apiClientReady = true;
	}

	$scope.handleAuthClick = function(event) {
		gapi.auth.authorize({
			//jscs:disable requireCamelCaseOrUpperCaseIdentifiers
			client_id: CLIENT_ID,
			scope: SCOPES,
			immediate: false
			//jscs:enable requireCamelCaseOrUpperCaseIdentifiers
		}, function(authResult) {
			if (authResult && !authResult.error) {
				window.location.href = '/';
			} else {
				$('.login-fail').show();
			}
		});
		return false;
	};

}]);

$(function() {

	moment.locale('ru');

	window.reportsAutosize = function(scrollBottom) {
		var windowHeight = $(window).height();
		$('.reports').removeClass('has-scroll').css('max-height', '');

		if (windowHeight > 600) {
			var reportsOffsetTop = $('.reports').offset().top;
			var reportsHeight = $('.reports').height();
			var reportsMaxHeight = windowHeight - reportsOffsetTop - 20;
			$('.reports').css('max-height', reportsMaxHeight + 'px');

			if (reportsMaxHeight < reportsHeight) {
				$('.reports').addClass('has-scroll');

				if (scrollBottom === true) {
					$('.reports').animate({ scrollTop: (reportsHeight - reportsMaxHeight) }, 300);
				}
			}
		}
	};

	$(window).resize(reportsAutosize);

});
