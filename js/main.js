$(function() {

	moment.locale('ru');

	var cal = new CalHeatMap();
	cal.init({
		itemSelector: '#reports .matrix',
		domain: 'week',
		subDomain: 'day',
		//data: 'matrix.php',
		start: (new Date()).setFullYear((new Date()).getFullYear()-1),
		cellSize: 13,
		domainGutter: 0,
		highlight: 'now',
		range: 53,
		legend: [20, 40, 60, 80],
		subDomainDateFormat: function(date) {
			return moment(date).format('LL');
		},
		domainLabelFormat: function(date) {
			return '';
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