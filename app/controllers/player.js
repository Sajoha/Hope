const
	data = $.args.sermon,
	lib = require('/lib'),
	moment = require('/alloy/moment');

let state;

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

	Ti.Media.audioSessionCategory = Ti.Media.AUDIO_SESSION_CATEGORY_PLAYBACK;

	$.audioPlayer.url = data.link;

	const
		durTime = moment($.audioPlayer.duration).format('mm:ss'),
		lblStr = `00:00 / ${data.duration}`;

	$.timeLabel.text = lblStr;

	// Because for some reason it auto plays still
	$.audioPlayer.stop();
}

function closeWindow() { $.tabGrp.close(); }

function back10() { $.audioPlayer.seekToTime($.audioPlayer.progress - 10000); }

function play() { $.audioPlayer.start(); }

function pause() { $.audioPlayer.pause(); }

function forward10() { $.audioPlayer.seekToTime($.audioPlayer.progress + 10000); }

$.tabGrp.addEventListener('close', (e) => { $.audioPlayer.stop(); });

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