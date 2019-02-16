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

module.exports = {
	request
}