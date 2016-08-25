import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Events = new Mongo.Collection('events');
 
if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish venues that belong to the current user
  Meteor.publish('events', function eventsPublication() {
    //return Venues.find({ owner: this.userId, });
    return Events.find();
  });

}
 
Meteor.methods({
  'events.insert'(name, description, 
      latitude, longitude, openingHours, 
      websiteURL, bookingURL,newsURL) {
    console.log("run venues.insert");
    check(name, String);
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
 
    Events.insert({
      name, 
      description, 
      latitude, 
      longitude, 
      openingHours, 
      websiteURL, 
      bookingURL,
      newsURL,
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
    });
  },
  'events.update'(venueId, name, description, 
      latitude, longitude, openingHours, 
      websiteURL, bookingURL,newsURL) {
    console.log("run venues.insert");
    check(name, String);
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
 
    const events = Venues.findOne(venueId);

    Events.update(venueId, {
      $set: {name, 
        description, 
        latitude, 
        longitude, 
        openingHours, 
        websiteURL, 
        bookingURL,
        newsURL,
      }
    });
  },
  'events.remove'(venueId) {
    check(venueId, String);
 
    const events = Venues.findOne(venueId);
    if (venue.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }
 
    Events.remove(venueId);
  },
});
