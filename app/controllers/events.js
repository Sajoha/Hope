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
			data: event,
			properties: {
				selectionStyle: (OS_IOS) ? Ti.UI.iOS.ListViewCellSelectionStyle.NONE : null
			}
		});
	}

	$.loading.hide();
	$.section.items = eventData;
	$.listview.sections = [$.section];
	$.content.show();
}

function handleListItemClick(e) {
	const
		data = e.section.getItemAt(e.itemIndex).data,
		start = moment.unix(data.start).format('HH:mm - DD/MM/YY'),
		end = moment.unix(data.end).format('HH:mm - DD/MM/YY');

	$.detTitle.text = data.title;
	$.detStart.text = `Start: ${start}`;
	$.detEnd.text = `Finish: ${end}`;

	if(data.desc) {
		$.detText.text = data.desc;
	} else {
		$.detText.top = 0;
		$.detText.height = 0;
	}

	if(data.loc) {
		$.detLoc.text = data.loc;
	} else {
		$.detLoc.top = 0;
		$.detLoc.height = 0;
	}

	if(data.url) {
		$.detURL.text = data.url;
	} else {
		$.detURL.top = 0;
		$.detURL.height = 0;
	}

	$.content.touchEnabled = false;
	$.details.show();
}

$.detButton.addEventListener('click', (e) => {
	$.details.hide();

	$.detTitle.text = '';
	$.detStart.text = '';
	$.detEnd.text = '';
	$.detLoc.text = '';
	$.detURL.text = '';
	$.detText.text = '';

	$.detText.top = 10;
	$.detLoc.top = 2;
	$.detURL.top = 2;

	$.detText.height = Ti.UI.SIZE;
	$.detLoc.height = Ti.UI.SIZE;
	$.detURL.height = Ti.UI.SIZE;

	$.content.touchEnabled = true;
});

$.detURL.addEventListener('click', (e) => {
	Ti.Platform.openURL($.detURL.text);
});
