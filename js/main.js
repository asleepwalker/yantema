$(function() {
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
});