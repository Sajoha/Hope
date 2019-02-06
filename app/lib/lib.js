function request({ url, body, headers = {}, method = 'GET' }) {
	return new Promise((resolve, reject) => {
		var client = Ti.Network.createHTTPClient({
			// function called when the response data is available
			onload: function() {
				return resolve(this.responseText);
			},
			// function called when an error occurs, including a timeout
			onerror: function() {
				return reject(this.responseText);
			},
			timeout: 5000 // in milliseconds
		});
		// Prepare the connection.
		client.open(method, url);
		for(const [headerName, value] of Object.entries(headers)) {
			// console.log(headerName);
			client.setRequestHeader(headerName, value);
		}
		// Send the request.
		if(body) {
			client.send(body);
		} else {
			client.send();
		}
	});
};

function getPreacher(preacherId) {
	switch (preacherId) {
		case 23:
			return 'Bro. Andrew';

		case 26:
			return 'Pastor Dan';

		case 44:
			return 'Missionary Pastor Sammy Perez';

		case 49:
			return 'Evangelist Bob Jones';

		case 55:
			return 'Pastor Crichton';

		default:
			return null;
	}
}

module.exports = {
	request,
	getPreacher
}