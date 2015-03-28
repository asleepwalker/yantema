$(function() {

	moment.locale('ru');

	$('.time-select .time').timepicker({
	    'showDuration': true,
	    'timeFormat': 'H:i',
	    'lang': {
			'mins': 'м',
			'hr': 'ч',
			'hrs': 'ч'
		}
	});
	$('.time-select').datepair();

	function reportsAutosize(scrollBottom) {
		var windowHeight = $(window).height(),
			reportsOffsetTop, reportsHeight, formHeight, reportsMaxHeight;

		$('.reports').removeClass('has-scroll').css('max-height', '');
		if (windowHeight > 600) {
			reportsOffsetTop = $('.reports').offset().top,
			reportsHeight = $('.reports').height(),
			formHeight = $('.add-report').outerHeight(true),
			reportsMaxHeight = windowHeight - (reportsOffsetTop + formHeight)
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