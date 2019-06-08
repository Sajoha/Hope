Alloy.Globals.nav = $.index;

function openSermons() {
	Alloy.Globals.nav.openWindow(Alloy.createController('sermons').getView());
}

function openEvents() {
	Alloy.Globals.nav.openWindow(Alloy.createController('events').getView());
}

function openFind() {
	Alloy.Globals.nav.openWindow(Alloy.createController('find').getView());
}

function openAbout() {
	Alloy.Globals.nav.openWindow(Alloy.createController('about').getView());
}

function openPastor() {
	Alloy.Globals.nav.openWindow(Alloy.createController('pastor').getView());
}

$.index.open();