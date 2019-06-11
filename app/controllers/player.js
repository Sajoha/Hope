const
	data = $.args.sermon,
	lib = require('/lib'),
	moment = require('/alloy/moment');

let state;

function getMainPassage() {
	return new Promise((resolve, reject) => {
		lib.request({ url: `https://bible-api.com/${data.passage.replace(/ /g, '')}?translation=kjv` })
			.then(data => setUI(JSON.parse(data)))
			.catch(err => reject(err));
	});
}

function setUI(passage) {
	let sermonDate = moment.unix(data.date).format('dddd Do MMMM');

	switch (data.service) {
		case 'Sunday AM':
			sermonDate = `${sermonDate} - Morning`;
			break;

		case 'Sunday PM':
		case 'Wednesday PM':
			sermonDate = `${sermonDate} - Evening`;
			break;
	}

	$.window.title = sermonDate;
	$.sermonTitle.text = data.sermon;
	$.preacher.text = `Preacher: ${data.preacher}`;
	$.passage.text = `Main Passage: ${data.passage}`;

	Ti.Media.audioSessionCategory = Ti.Media.AUDIO_SESSION_CATEGORY_PLAYBACK;

	$.audioPlayer.url = data.link;

	const
		durTime = moment($.audioPlayer.duration).format('mm:ss'),
		lblStr = `00:00 / ${data.duration}`;

	$.timeLabel.text = lblStr;

	$.bibleTitle.text = passage.reference;
	$.bibleText.text = lib.parsePassage(passage.verses);

	// Because for some reason it auto plays still
	$.audioPlayer.stop();

	$.loading.visible = false;
	$.content.visible = true;
}

function back10() { $.audioPlayer.seekToTime($.audioPlayer.progress - 10000); }

function play() { $.audioPlayer.start(); }

function pause() { $.audioPlayer.pause(); }

function forward10() { $.audioPlayer.seekToTime($.audioPlayer.progress + 10000); }

$.window.addEventListener('close', (e) => { $.audioPlayer.release(); });

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
