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

function parsePassage(verses) {
	let
		passage = '',
		chapter = -1;

	for(const verse of verses) {
		if(verse.chapter !== chapter) {
			chapter = verse.chapter;
			passage = passage + `${convertNum(verse.chapter)}\u207B`;
		}

		passage = passage + `${convertNum(verse.verse)} `;

		passage = passage + (verse.text).replace(/\n/g, ' ')
	}

	return passage;
}

function convertNum(num) {
	let
		supNum = '',
		numStr = num.toString();

	for(let i = 0; i < numStr.length; i++) {
		supNum = supNum + getChar(numStr.charAt(i));
	}

	return supNum;
}

function getChar(digit) {
	switch (digit) {
		case '0':
			return '\u2070';
		case '1':
			return '\u00B9';
		case '2':
			return '\u00B2';
		case '3':
			return '\u00B3';
		case '4':
			return '\u2074';
		case '5':
			return '\u2075';
		case '6':
			return '\u2076';
		case '7':
			return '\u2077';
		case '8':
			return '\u2078';
		case '9':
			return '\u2079';
		default:
			return '';
	}
}

module.exports = {
	request,
	parsePassage
}