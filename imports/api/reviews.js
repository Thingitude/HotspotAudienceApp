import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Reviews = new Mongo.Collection('reviews');
 
if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish venues that belong to the current user
  Meteor.publish('reviews', function reviewsPublication() {
    //return Venues.find({ owner: this.userId, });
    return Reviews.find();
  });

}
 
Meteor.methods({
  'reviews.insert'(details, 
      venueId, rating) {
    console.log("run reviews.insert");
    var score = rating;
    //check(rating, String);
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    if (score > 5){
      throw new Meteor.Error('number too large');
    }
    if (score < 1){
      throw new Meteor.Error('number too low');
    }

    Reviews.insert({
      details, 
      venueId, 
      score, 
      owner: this.userId,
      timestamp: new Date(),
      username: Meteor.users.findOne(this.userId).username,
    });
  },
  'reviews.update'(venueId, name, description, 
      latitude, longitude, openingHours, 
      websiteURL, bookingURL,newsURL) {
    console.log("run venues.insert");
    check(name, String);
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
 
    const events = Venues.findOne(venueId);

    Reviews.update(venueId, {
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
  'reviews.remove'(venueId) {
    check(venueId, String);
 
    const events = Venues.findOne(venueId);
    if (venue.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }
 
    Reviews.remove(venueId);
  },
});
