// The sermons page

const lib = require('/lib');

function getSermons() {
	$.activityIndicator.show();

	lib.request({ url: 'http://hope.ie/wp-json/wp/v2/wpfc_sermon' })
		.then(data => {
			return new Promise((resolve, reject) => {
				try {
					return resolve(JSON.parse(data));
				} catch (err) {
					return reject(err);
				}
			});
		})
		.then(data => {
			setUI(data);
		})
		.catch(err => {
			console.log(err);
		});
}

function setUI(sermons) {
	const sermonData = [];

	sermons.forEach(sermon => {
		let
			preachers = [],
			preacherString = 'Preacher';

		if(sermon.wpfc_preacher.length > 1) {
			preacherString = 'Preachers';
		}

		sermon.wpfc_preacher.forEach(preacherId => {
			preachers.push(lib.getPreacher(preacherId));
		});

		sermonData.push({
			preacher: {
				text: `${preacherString}: ${preachers.toString().replace(',', ', ')}`
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