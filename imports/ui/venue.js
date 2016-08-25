import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
 
import './venue_summary.html';
 
Template.venuesummary.helpers({
  isOwner() {
    return this.owner === Meteor.userId();
  },
  find() {
  	alert("Boing");
  },
});
 
Template.venuesummary.events({
  'click .delete'() {
    Meteor.call('venues.remove', this._id);
  },

});
