var CLIENT_ID = '728048305195-eb68s05cjabi4o0jlda7ve3jlnv3snqd.apps.googleusercontent.com';
var SCOPES = ['https://www.googleapis.com/auth/calendar'];
var calendarApiReady = false;

function checkAuth() {
	gapi.auth.authorize({
		'client_id': CLIENT_ID,
		'scope': SCOPES,
		'immediate': true
	}, handleAuthResult);
}

function handleAuthResult(authResult) {
	if (authResult && !authResult.error) {
		loadCalendarApi();
	} else {
		window.location.href = '/login';
	}
}

function loadCalendarApi() {
	gapi.client.load('calendar', 'v3', bootstrapApp);
}

// Should be overridden by app initialization method
function bootstrapApp() {
	calendarApiReady = true;
}

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

	function reportsAutosize(scrollBottom) {
		var windowHeight = $(window).height();
		$('.reports').removeClass('has-scroll').css('max-height', '');

		if (windowHeight > 600) {
			var reportsOffsetTop = $('.reports').offset().top;
			var reportsHeight = $('.reports').height();
			var formHeight = $('.add-report').outerHeight(true);
			var reportsMaxHeight = windowHeight - reportsOffsetTop + formHeight;
			$('.reports').css('max-height', reportsMaxHeight + 'px');

			if (reportsMaxHeight < reportsHeight) {
				$('.reports').addClass('has-scroll');

				if (scrollBottom === true) {
					$('.reports').animate({ scrollTop: (reportsHeight - reportsMaxHeight) }, 300);
				}
			}
		}
	}

	reportsAutosize(true);
	$(window).resize(reportsAutosize);

});
