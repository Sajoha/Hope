// The sermons page

const lib = require('/lib');

function refreshData() { getData(); }

function getData() {
	$.activityIndicator.show();

	const getSermons = new Promise((resolve, reject) => {
		lib.request({ url: 'http://hope.ie/wp-json/wp/v2/wpfc_sermon' })
			.then(data => resolve(JSON.parse(data)))
			.catch(err => reject(err));
	});

	const getPreachers = new Promise((resolve, reject) => {
		lib.request({ url: 'http://hope.ie/wp-json/wp/v2/wpfc_preacher' })
			.then(data => resolve(JSON.parse(data)))
			.catch(err => reject(err));
	});

	const getServices = new Promise((resolve, reject) => {
		lib.request({ url: 'http://hope.ie/wp-json/wp/v2/wpfc_service_type' })
			.then(data => resolve(JSON.parse(data)))
			.catch(err => reject(err));
	});

	Promise.all([getSermons, getPreachers, getServices])
		.then(values => setUI(values[0], values[1], values[2]))
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

		const sermonDate = require('/alloy/moment').unix(sermon.sermon_date).format("DD/MM/YYYY");

		sermonData.push({
			sermon: { text: sermon.title.rendered },
			preacher: { text: `Preacher: ${preacher}` },
			passage: { text: `Passage: ${sermon.bible_passage}` },
			data: {
				date: sermonDate,
				service: service,
				preacher: preacher,
				views: sermon._views,
				link: sermon.sermon_audio,
				sermon: sermon.title.rendered,
				passage: sermon.bible_passage,
				duration: sermon.sermon_audio_duration
			},
			properties: {
				itemId: sermon.id,
				selectionStyle: (OS_IOS) ? Ti.UI.iOS.ListViewCellSelectionStyle.NONE : null
			}
		});
	});

	$.activityIndicator.hide();
	$.section.setItems(sermonData);
	$.listview.setSections([$.section]);
}

function handleListItemClick(e) {
	const sermon = e.section.getItemAt(e.itemIndex).data;

	Alloy.createController('player', { sermon }).getView().open();
}