var CLIENT_ID = '728048305195-eb68s05cjabi4o0jlda7ve3jlnv3snqd.apps.googleusercontent.com';
var SCOPES = ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/tasks'];
var app = angular.module('yantema', []);

//jscs:disable requireCamelCaseOrUpperCaseIdentifiers
function checkAuth() {
	gapi.auth.authorize({
		client_id: CLIENT_ID,
		scope: SCOPES,
		immediate: true
	}, handleAuthResult);
}
//jscs:enable requireCamelCaseOrUpperCaseIdentifiers

function handleAuthResult(authResult) {
	if (authResult && !authResult.error) {
		loadCalendarApi();
	} else {
		window.location.href = '/login';
	}
}

function loadCalendarApi() {
	gapi.client.load('calendar', 'v3', bootstrapApp);
	//gapi.client.load('tasks', 'v3', loadTasks);
}

function bootstrapApp() {
	angular.bootstrap(document, ['yantema']);
}

app.controller('posts', ['$scope', '$timeout', function($scope, $timeout) {

	$scope.posts = [];
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

		var request = gapi.client.calendar.events.insert({
			calendarId: 'primary',
			resource: event
		});

		request.execute(function(event) {
			$scope.loadDay($scope.day);
			$scope.form = {};
			$scope.$apply();
		});
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

	$scope.loadDay(moment().set('hour', 0).set('minute', 0).set('second', 0));

}]);

app.filter('moment', function() {
	return function(input, format) {
		return input.format(format);
	};
});

app.filter('capitalizeFirstLetter', function() {
	return function(input) {
		return input.charAt(0).toUpperCase() + input.slice(1);
	};
});

$(function() {

	moment.locale('ru');

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
