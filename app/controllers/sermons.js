// The sermons page

const lib = require('/lib');

function getSermons() {
	$.activityIndicator.show();

	let
		sermons,
		preachers;

	Promise.resolve()
		.then(() => {
			return new Promise((resolve, reject) => {
				lib.request({ url: 'http://hope.ie/wp-json/wp/v2/wpfc_sermon' })
					.then(data => {
						try {
							sermons = JSON.parse(data);
							return resolve();
						} catch (err) {
							return reject(err);
						}
					});
			});
		})
		.then(() => {
			return new Promise((resolve, reject) => {
				lib.request({ url: 'http://hope.ie/wp-json/wp/v2/wpfc_preacher' })
					.then(data => {
						try {
							preachers = JSON.parse(data);
							return resolve();
						} catch (err) {
							return reject(err);
						}
					});
			});
		})
		.then(() => {
			setUI(sermons, preachers);
		})
		.catch(err => {
			console.log(err);
		});
}

function setUI(sermons, preachers) {
	const sermonData = [];

	sermons.forEach(sermon => {
		let
			preacher,
			index = preachers.indexOf(preachers.find(x => x.id === sermon.wpfc_preacher[0]));

		(index >= 0) ? preacher = preachers[index]['name']: preacher = 'Unknown';

		sermonData.push({
			preacher: {
				text: `Preacher: ${preacher}`
			},
			sermon: {
				text: sermon.title.rendered
			},
			books: {
				text: `Passage: ${sermon.bible_passage}`
			},
			link: sermon.sermon_audio,
			properties: {
				itemId: sermon.id,
				height: Ti.UI.SIZE
			}
		});
	});

	$.activityIndicator.hide();
	$.section.setItems(sermonData);
	$.listview.setSections([$.section]);
}

function handleListItemClick(e) {
	Ti.Platform.openURL(e.section.getItemAt(e.itemIndex).link);
}