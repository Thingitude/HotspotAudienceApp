// This section sets up some basic app metadata,
// the entire section is optional.
App.info({
  id: 'com.thingitude.hotspot.audience',
  version: '0.0.1',
  name: 'Hotspot Audience',
  description: 'Where is hot in Reading right now?',
  author: 'Thingitude Ltd',
  email: 'mark.stanley@coraledge.co.uk',
  website: 'http://thingitude.com'
});
// Set up resources such as icons and launch screens.
App.icons({
});
App.launchScreens({
});
// Set PhoneGap/Cordova preferences
App.setPreference('BackgroundColor', '0xff0000ff');
App.setPreference('HideKeyboardFormAccessoryBar', true);
App.setPreference('Orientation', 'default');
App.setPreference('Orientation', 'all', 'ios');
App.accessRule('*.google.com/*');
App.accessRule('*.googleapis.com/*');
App.accessRule('*.gstatic.com/*');
// Pass preferences for a particular PhoneGap/Cordova plugin
App.configurePlugin('com.phonegap.plugins.facebookconnect', {
  APP_ID: '933308433481548',
  API_KEY: '1029680811dbadd7e80337667f09c6bd'
});
