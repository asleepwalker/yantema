$(function() {

	moment.locale('ru');

	var cal = new CalHeatMap();
	cal.init({
		itemSelector: '#matrix',
		domain: 'month',
		subDomain: 'day',
		data: 'matrix.php',
		start: new Date((new Date()).getFullYear(), 0, 1),
		cellSize: 10,
		domainGutter: 5,
		legend: [20, 40, 60, 80],
		subDomainDateFormat: function(date) {
			return moment(date).format('LL');
		},
		domainLabelFormat: function(date) {
			return moment(date).format('MMMM');
		},
		legendTitleFormat: {
			lower: 'КПД ниже {min} %',
			inner: 'КПД {down}-{up} %',
			upper: 'КПД выше {max} %'
		}
	});

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