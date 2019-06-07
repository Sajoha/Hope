const
	lib = require('/lib'),
	moment = require('/alloy/moment');

function refreshData() { getEvents(); }

function getEvents() {
	return new Promise((resolve, reject) => {
		lib.request({ url: Alloy.Globals.calConvert })
			.then(data => (JSON.parse(data)).vcalendar[0].vevent)
			.then(events => lib.parseEvents(events))
			.then(parsed => setUI(parsed))
			.catch(err => reject(err));
	});
}

function setUI(events) {
	$.refresh.endRefreshing();

	const eventData = [];

	for(const event of events) {
		const
			day = moment.unix(event.start).format('ddd'),
			date = moment.unix(event.start).format('Do MMM YYYY'),
			time = moment.unix(event.start).format('HH:mm');

		eventData.push({
			name: { text: event.title },
			day: { text: day },
			date: { text: date },
			time: { text: time },
			properties: {
				itemId: event.start,
				selectionStyle: (OS_IOS) ? Ti.UI.iOS.ListViewCellSelectionStyle.NONE : null
			}
		});
	}

	$.loading.hide();
	$.section.items = eventData;
	$.listview.sections = [$.section];
	$.content.show();
}

function handleListItemClick(e) {}
