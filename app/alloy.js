// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

const
	converter = 'https://ical-to-json.herokuapp.com/convert.json',
	calendar = 'webcal://p71-calendars.icloud.com/published/2/AAAAAAAAAAAAAAAAAAAAAHFD-f9dJNH5biZqhakqUrFnvlxGFs7r2SacLByirRvAwnUySeTP5UZdtRt2QlDTUmovGoixYpy2ps-6mQ9TJfA';

const
	hope = 'http://hope.ie',
	sermons = 'wpfc_sermon?per_page=15',
	preachers = 'wpfc_preacher',
	services = 'wpfc_service_type';

// Links
Alloy.Globals.calConvert = `${converter}?url=${calendar}`;
Alloy.Globals.getSermons = `${hope}/wp-json/wp/v2/${sermons}`;
Alloy.Globals.getServices = `${hope}/wp-json/wp/v2/${services}`;
Alloy.Globals.getPreachers = `${hope}/wp-json/wp/v2/${preachers}`;

// Colours
Alloy.Globals.backColour = '#FDF5E8';
Alloy.Globals.accentColour = '#40E0D0';
