// The sermons page

const lib = require('/lib');

function refreshSermons() {
	getSermons();
}

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
	$.refresh.endRefreshing();

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
			passage: {
				text: `Passage: ${sermon.bible_passage}`
			},
			data: {
				preacher: preacher,
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

	$.activityIndicator.hide();
	$.section.setItems(sermonData);
	$.listview.setSections([$.section]);
}

function handleListItemClick(e) {
	const sermon = e.section.getItemAt(e.itemIndex).data;
	Ti.Platform.openURL(sermon.link);
}