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

$.tabbed.addEventListener('click', (e) => {
	$.schedule.hide();
	$.beliefs.hide();
	$.socials.hide();

	switch (e.index) {
	case 0:
		$.schedule.show();
		break;

	case 1:
		$.beliefs.show();
		break;

	case 2:
		$.socials.show();
		break;
	}
});