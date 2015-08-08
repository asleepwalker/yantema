var CLIENT_ID = '728048305195-eb68s05cjabi4o0jlda7ve3jlnv3snqd.apps.googleusercontent.com';
var SCOPES = ['https://www.googleapis.com/auth/calendar'];

//jscs:disable requireCamelCaseOrUpperCaseIdentifiers
function handleAuthClick(event) {
	gapi.auth.authorize({
		client_id: CLIENT_ID,
		scope: SCOPES,
		immediate: false
	}, handleAuthResult);
	return false;
}
//jscs:enable requireCamelCaseOrUpperCaseIdentifiers

function handleAuthResult(authResult) {
	if (authResult && !authResult.error) {
		window.location.href = '/';
	} else {
		$('.login-fail').show();
	}
}
