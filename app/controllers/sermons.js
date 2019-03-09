// The sermons page

const
	lib = require('/lib'),
	moment = require('/alloy/moment');

function refreshData() {
	$.content.hide();
	$.loading.show();
	getData();
}

function getData() {
	const getSermons = new Promise((resolve, reject) => {
		lib.request({ url: 'http://hope.ie/wp-json/wp/v2/wpfc_sermon?per_page=20' })
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

	const getBooks = new Promise((resolve, reject) => {
		lib.request({ url: 'http://hope.ie/wp-json/wp/v2/wpfc_bible_book' })
			.then(data => resolve(JSON.parse(data)))
			.catch(err => reject(err));
	});

	Promise.all([getSermons, getPreachers, getServices, getBooks])
		.then(values => setUI(values[0], values[1], values[2], values[3]))
		.catch(err => console.error(err));
}

function setUI(sermons, preachers, serviceType, bookIds) {
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

		const books = [sermon.bible_passage];

		sermon.wpfc_bible_book.forEach(id => {
			const
				bookId = bookIds.indexOf(bookIds.find(x => x.id === id)),
				bookName = (bookIds[bookId]).name;

			books.push(bookName)
		});

		const
			sermonDate = moment.unix(sermon.sermon_date).format('DD/MM/YYYY'),
			sermonDuration = moment(sermon.sermon_audio_duration, 'HH:mm:ss').format('mm:ss');

		sermonData.push({
			sermon: { text: sermon.title.rendered },
			preacher: { text: `Preacher: ${preacher}` },
			passage: { text: `Passage: ${sermon.bible_passage}` },
			data: {
				books: books,
				date: sermonDate,
				service: service,
				preacher: preacher,
				views: sermon._views,
				duration: sermonDuration,
				link: sermon.sermon_audio,
				sermon: sermon.title.rendered,
				passage: sermon.bible_passage
			},
			properties: {
				itemId: sermon.id,
				selectionStyle: (OS_IOS) ? Ti.UI.iOS.ListViewCellSelectionStyle.NONE : null
			}
		});
	});

	$.loading.hide();
	$.section.setItems(sermonData);
	$.listview.setSections([$.section]);
	$.content.show();
}

function handleListItemClick(e) {
	const sermon = e.section.getItemAt(e.itemIndex).data;

	Alloy.createController('player', { sermon }).getView().open();
}