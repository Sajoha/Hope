const
	lib = require('/lib'),
	data = $.args.sermon;

function getMainPassage() {
	lib.request({ url: `https://bible-api.com/${(data.passage).replace(/ /g, '')}?translation=kjv` })
		.then(data => setUI(JSON.parse(data)))
		.catch(err => console.log(err));
}

function setUI(passage) {
	$.win1.title = data.sermon;
	$.win2.title = data.passage;
	$.preacher.text = `Preacher: ${data.preacher}`;
	$.passage.text = `Main Passage: ${data.passage}`;
	$.date.text = `Date: ${data.date}`;
	$.time.text = `Time: ${data.service}`;
	$.length.text = `Duration: ${data.duration}`;
	$.views.text = `View Count: ${data.views}`;

	$.biblePassage.text = lib.parsePassage(passage.verses);
}

function closeWindow() { $.tabGrp.close(); }