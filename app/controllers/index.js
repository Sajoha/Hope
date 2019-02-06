$.index.open();

function openSermons() {
	$.index.openWindow(Alloy.createController('sermons').getView());
}

function openEvents() {
	$.index.openWindow(Alloy.createController('events').getView());
}

function openFind() {
	$.index.openWindow(Alloy.createController('find').getView());
}

function openAbout() {
	$.index.openWindow(Alloy.createController('about').getView());
}

function openPastor() {
	$.index.openWindow(Alloy.createController('pastor').getView());
}