Alloy.Globals.nav = $.index;

function openSermons() {
	Alloy.Globals.nav.openWindow(Alloy.createController('sermons').getView());
}

function openEvents() {
	Alloy.Globals.nav.openWindow(Alloy.createController('events').getView());
}

function createEmail() {
	const emailDialog = Ti.UI.createEmailDialog({
		subject: 'Please Consider My Prayer Request',
		toRecipients: ['daniel.canavan@me.com']
	});

	emailDialog.open();
}

function openAbout() {
	Alloy.Globals.nav.openWindow(Alloy.createController('about').getView());
}

function openPastor() {
	Alloy.Globals.nav.openWindow(Alloy.createController('pastor').getView());
}

$.index.open();
