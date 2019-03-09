const
	data = $.args.sermon,
	lib = require('/lib'),
	moment = require('/alloy/moment');

let state;

function getMainPassage() {

	const arr = [];

	data.books.forEach(book => {
		arr.push(new Promise((resolve, reject) => {
			lib.request({ url: `https://bible-api.com/${book.replace(/ /g, '')}?translation=kjv` })
				.then(data => resolve(JSON.parse(data)))
				.catch(err => reject(err));
		}));
	});

	Promise.all(arr)
		.then(values => setUI(values))
		.catch(err => console.log(err));
}

function setUI(passages) {
	$.window.title = data.sermon;
	$.preacher.text = `Preacher: ${data.preacher}`;
	$.passage.text = `Main Passage: ${data.passage}`;
	$.date.text = `Date: ${data.date}`;
	$.time.text = `Time: ${data.service}`;
	$.length.text = `Duration: ${data.duration}`;
	$.views.text = `View Count: ${data.views}`;

	Ti.Media.audioSessionCategory = Ti.Media.AUDIO_SESSION_CATEGORY_PLAYBACK;

	$.audioPlayer.url = data.link;

	const
		durTime = moment($.audioPlayer.duration).format('mm:ss'),
		lblStr = `00:00 / ${data.duration}`;

	$.timeLabel.text = lblStr;

	// Because for some reason it auto plays still
	$.audioPlayer.stop();

	$.loading.visible = false;
	$.content.visible = true;

	passages.forEach(passage => {
		const view = Ti.UI.createView({
			width: Ti.UI.FILL,
			height: Ti.UI.FILL,
			layout: 'vertical'
		});

		const passageTitle = Ti.UI.createLabel({
			left: '2%',
			height: '8%',
			text: passage.reference,
			font: { fontSize: 20 }
		});

		const scroll = Ti.UI.createScrollView({
			height: '92%',
			layout: 'vertical'
		});

		const passageText = Ti.UI.createLabel({
			text: lib.parsePassage(passage.verses),
			font: { fontSize: 14 },
			height: Ti.UI.FILL,
			width: '96%'
		});

		scroll.add(passageText);

		view.add(passageTitle);
		view.add(scroll);

		$.scrollable.addView(view);
	});
}

function closeWindow() { $.win.close(); }

function back10() { $.audioPlayer.seekToTime($.audioPlayer.progress - 10000); }

function play() { $.audioPlayer.start(); }

function pause() { $.audioPlayer.pause(); }

function forward10() { $.audioPlayer.seekToTime($.audioPlayer.progress + 10000); }

$.win.addEventListener('close', (e) => { $.audioPlayer.stop(); });

$.audioPlayer.addEventListener('progress', (e) => {
	const
		durTime = moment($.audioPlayer.duration).format('mm:ss'),
		currTime = moment(e.progress).format('mm:ss'),
		lblStr = `${currTime} / ${data.duration}`;

	$.slider.setValue(e.progress / $.audioPlayer.duration);
	$.timeLabel.text = lblStr;
});

$.slider.addEventListener('start', (e) => {
	// Record the state before pausing, so we know what to do after touch has stopped
	state = $.audioPlayer.state;
	$.audioPlayer.pause();
});

$.slider.addEventListener('stop', (e) => {
	$.audioPlayer.seekToTime(e.value * $.audioPlayer.duration);
	// Resume playing if it already was in this state
	if(state === 3) $.audioPlayer.start();
});