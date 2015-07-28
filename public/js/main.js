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
