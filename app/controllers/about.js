function closeWindow() {
	$.tabgrp.close();
}

function openFacebook() {
	Ti.Platform.openURL('https://www.facebook.com/HopeBCDundrum/');
}

function openTwitter() {
	Ti.Platform.openURL('https://twitter.com/hopedotie');
}

function openYouTube() {
	Ti.Platform.openURL('https://www.youtube.com/channel/UCmBzYxuQTOu_cy1BtclMydw');
}

function openVimeo() {
	Ti.Platform.openURL('https://vimeo.com/user6896404');
}

function loadMap() {
	Ti.Platform.openURL('http://maps.apple.com/?daddr=53.289818,-6.242318&dirflg=d');
}

$.tabbed.addEventListener('click', (e) => {
	$.schedule.hide();
	$.beliefs.hide();
	$.location.hide();
	$.socials.hide();

	switch (e.index) {
		case 0:
			$.schedule.show();
			break;

		case 1:
			$.beliefs.show();
			break;

		case 2:
			$.location.show();
			break;

		case 3:
			$.socials.show();
			break;
	}
});
