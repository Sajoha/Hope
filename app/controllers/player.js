const
	data = $.args.sermon,
	lib = require('/lib'),
	moment = require('/alloy/moment');

let state = false;

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

function back10() {
	if(Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad') {
		$.audioPlayer.seekToTime($.audioPlayer.progress - 10000);
	} else {
		$.audioPlayer.time = ($.audioPlayer.time - 10000);

		const
			durTime = moment($.audioPlayer.duration).format('mm:ss'),
			currTime = moment($.audioPlayer.time).format('mm:ss'),
			lblStr = `${currTime} / ${data.duration}`;

		$.timeLabel.text = lblStr;
	}
}

function play() { $.audioPlayer.start(); }

function pause() { $.audioPlayer.pause(); }

function forward10() {
	if(Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad') {
		$.audioPlayer.seekToTime($.audioPlayer.progress + 10000);
	} else {
		$.audioPlayer.time = ($.audioPlayer.time + 10000);

		const
			durTime = moment($.audioPlayer.duration).format('mm:ss'),
			currTime = moment($.audioPlayer.time).format('mm:ss'),
			lblStr = `${currTime} / ${data.duration}`;

		$.timeLabel.text = lblStr;
	}
}

$.window.addEventListener('close', (e) => { $.audioPlayer.release(); });

$.audioPlayer.addEventListener('progress', (e) => {
	const
		durTime = moment($.audioPlayer.duration).format('mm:ss'),
		currTime = moment(e.progress).format('mm:ss'),
		lblStr = `${currTime} / ${data.duration}`;

	$.slider.value = (e.progress / $.audioPlayer.duration);
	$.timeLabel.text = lblStr;
});

$.slider.addEventListener('start', (e) => {
	// Record the state before pausing, so we know what to do after touch has stopped
	state = $.audioPlayer.playing;
	$.audioPlayer.pause();
});

$.slider.addEventListener('stop', (e) => {
	if(Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad') {
		$.audioPlayer.seekToTime(e.value * $.audioPlayer.duration);
	} else {
		$.audioPlayer.time = (e.value * $.audioPlayer.duration);

		const
			durTime = moment($.audioPlayer.duration).format('mm:ss'),
			currTime = moment($.audioPlayer.time).format('mm:ss'),
			lblStr = `${currTime} / ${data.duration}`;

		$.timeLabel.text = lblStr;
	}

	// Resume playing if it already was in this state
	if(state) $.audioPlayer.start();
});

$.backCont.addEventListener('touchstart', (e) => {
	$.backCont.backgroundColor = '#D3D3D3';
});

$.backCont.addEventListener('touchend', (e) => {
	$.backCont.backgroundColor = 'white';
});

$.playCont.addEventListener('touchstart', (e) => {
	$.playCont.backgroundColor = '#D3D3D3';
});

$.playCont.addEventListener('touchend', (e) => {
	$.playCont.backgroundColor = 'white';
});

$.pauseCont.addEventListener('touchstart', (e) => {
	$.pauseCont.backgroundColor = '#D3D3D3';
});

$.pauseCont.addEventListener('touchend', (e) => {
	$.pauseCont.backgroundColor = 'white';
});

$.forwardCont.addEventListener('touchstart', (e) => {
	$.forwardCont.backgroundColor = '#D3D3D3';
});

$.forwardCont.addEventListener('touchend', (e) => {
	$.forwardCont.backgroundColor = 'white';
});
