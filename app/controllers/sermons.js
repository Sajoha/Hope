// The sermons page

const
	lib = require('/lib'),
	moment = require('/alloy/moment');

function refreshData() { getData(); }

function getData() {
	const getSermons = new Promise((resolve, reject) => {
		lib.request({ url: Alloy.Globals.getSermons })
			.then(data => resolve(JSON.parse(data)))
			.catch(err => reject(err));
	});

	const getPreachers = new Promise((resolve, reject) => {
		lib.request({ url: Alloy.Globals.getPreachers })
			.then(data => resolve(JSON.parse(data)))
			.catch(err => reject(err));
	});

	const getServices = new Promise((resolve, reject) => {
		lib.request({ url: Alloy.Globals.getServices })
			.then(data => resolve(JSON.parse(data)))
			.catch(err => reject(err));
	});

	Promise.all([getSermons, getPreachers, getServices])
		.then(values => setUI(values[0], values[1], values[2], values[3]))
		.catch(err => console.error(err));
}

function setUI(sermons, preachers, serviceType) {
	$.refresh.endRefreshing();

	const sermonData = [];

	sermons.forEach(sermon => {
		let
			preacher,
			preacherIndex = preachers.indexOf(preachers.find(x => x.id === sermon.wpfc_preacher[0]));

		(preacherIndex >= 0) ? preacher = preachers[preacherIndex]['name']: preacher = 'Unknown';

		let
			service,
			serviceIndex = serviceType.indexOf(serviceType.find(x => x.id === sermon.wpfc_service_type[0]));

		(serviceIndex >= 0) ? service = serviceType[serviceIndex]['name']: service = 'Unknown';

		const
			sermonTitle = sermon.title.rendered.replace(/&#8217;/g, '\''),
			sermonDuration = moment(sermon.sermon_audio_duration, 'HH:mm:ss').format('mm:ss');

		sermonData.push({
			sermon: { text: sermonTitle },
			preacher: { text: `Preacher: ${preacher}` },
			passage: { text: `Passage: ${sermon.bible_passage}` },
			data: {
				service: service,
				preacher: preacher,
				sermon: sermonTitle,
				date: sermon.sermon_date,
				duration: sermonDuration,
				link: sermon.sermon_audio,
				passage: sermon.bible_passage
			},
			properties: {
				itemId: sermon.id,
				selectionStyle: (OS_IOS) ? Ti.UI.iOS.ListViewCellSelectionStyle.NONE : null
			}
		});
	});

	$.loading.hide();
	$.section.items = sermonData;
	$.listview.sections = [$.section];
	$.content.show();
}

function handleListItemClick(e) {
	const sermon = e.section.getItemAt(e.itemIndex).data;

	Alloy.Globals.nav.openWindow(Alloy.createController('player', { sermon }).getView());
}
