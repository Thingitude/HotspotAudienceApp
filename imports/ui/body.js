import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Venues } from '../api/venues.js';
import { ReactiveDict } from 'meteor/reactive-dict';
import { SensorData } from '../api/datastream.js';
import { Events } from '../api/events.js';
import { Reviews } from '../api/reviews.js';
 
import './venue.js';
import './body.html';
import './map.js';

Meteor.startup(function() {  
  
});
 
Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('venues');
  Meteor.subscribe('events');
  Meteor.subscribe('reviews');
  Meteor.subscribe('sensorData');
});

Template.VenueList.helpers({
  venues() {
    if(window.location.href.split('?').length == 2)
    {
    	switch(window.location.href.split('?')[1])
        {
		case "N":
			console.log("N");
			return Venues.find({}, {sort: {"name": 1}});
			break;
		case "P":
                        console.log("P");
			console.log(Venues.find({}, {sort: {"People": 1}}).fetch());
			return Venues.find({}, {sort: {"People": 1}});
			break;
		case "S":
                        console.log("S");
			return Venues.find({}, {sort: {"meanSnd": 1}});
			break;
		case "T":
			console.log("T");
			return Venues.find({}, {sort: {"Temp": 1}});
			break;
		case "R":
     			console.log("R");
			
			break;
	}
    }
    return Venues.find();
  },
  incompleteCount() {
    return Venues.find().count();
  },
});

Template.VenueList.events({
	'click th#headingName'(event){
	console.log("SortBy Name");
	window.location.assign("?N");
	},
        'click th#headingPeople'(event){
	console.log("SortBy People");
        window.location.assign("?P");
	},
        'click th#headingAvgsound'(event){
	console.log("SortBy Sound");
	window.location.assign("?S");
	},
        'click th#headingTemp'(event){
	console.log("SortBy Temp");
	window.location.assign("?T");
	},
        'click th#headingRating'(event){
	console.log("SortBy Rating");
	window.location.assign("?R");
	}
});

Template.Venue.helpers({
  thisVenue() {
    const venueId=FlowRouter.getParam("venueId");
    return Venues.findOne({"_id": venueId});
  }
});

datapackettemp = 0;
Template.datapacket.helpers({
  thisVenue() {
    const venueId=FlowRouter.getParam("venueId");
    datapackettemp = datapackettemp + 1;
    if(SensorData.find({"sensorId":Venues.findOne({"_id": venueId}).sensorId}).fetch()[datapackettemp-1] === undefined)
	{
		return 0;
	}
    return SensorData.find({"sensorId":Venues.findOne({"_id": venueId}).sensorId}).fetch()[datapackettemp-1];
  }
});

Template.venuesummarytemplatedata.helpers({
  thisVenue() {
    const venueId=this._id;
    var array = SensorData.find({"sensorId":Venues.findOne({"_id": venueId}).sensorId}).fetch();
    var reviewdata = Reviews.find({"venueId":venueId}).fetch();
    var temp = {data : array[array.length - 1],
                score : arrayavg(reviewdata),
                reviewcount : reviewdata.length};
    if(isNaN(temp.score))
      {
	temp.score = 0;
      }
    return temp;
  }
})

Template.DetailsView.helpers({
  sensorData() {
	 const venueId=FlowRouter.getParam("venueId");
         datapackettemp = 0;
    return SensorData.find({"sensorId":Venues.findOne({"_id": venueId}).sensorId});
  
    
  },
  events() {
  
  const venueId=FlowRouter.getParam("venueId");
   var temp = Events.find({"venueId":venueId}).fetch();
   var bubble;
    for(var i = 0;i < temp.length;i++)
       {
		for(var i2 = 0;i2 < temp.length - 1;i2++)
		   {
			if(temp[i2].startDateTime - temp[i2+1].startDateTime > 0)
                          {
			  	bubble = temp[i2+1];
				temp[i2+1] = temp[i2];
 				temp[i2] = bubble;
				
                          }
		   }
       }
    return temp;
  },
  reviews() {
    const venueId=FlowRouter.getParam("venueId");
    var temp = {score : arrayavg(Reviews.find({"venueId":venueId}).fetch()),
                reviewcount : Reviews.find().fetch().length};
    if(isNaN(temp.score))
      {
	temp.score = 0;
      }
    return temp;
  },
  thisVenue() {
    const venueId=FlowRouter.getParam("venueId");
     var avg = 0;
     var tot = 0;
     for(var i = 0;i < Reviews.find().fetch().length;i++)
	{
            tot = Reviews.find().fetch()[i].score + tot;
        }
     avg = tot / Reviews.find().fetch().length;
    data = Venues.findOne({"_id": venueId});
    document.getElementById('mapVenuesBtn').href = "/map?coord=" + data.latitude + ',' + data.longitude;
    return data;
  }
});



Template.AddReview.events({
  'submit .add-review'(event) {
    // Prevent default browser form submit
    event.preventDefault();
    // Get value from form element
    const target = event.target;
    const reviewDetails = document.getElementById('reviewDetails').value;
    const reviewRating = $('#rating').data('userrating');
    const reviewvenueId = FlowRouter.getParam("venueId");
    
    // Insert a venue into the collection
    if(reviewDetails.length < 140)
    {
    Meteor.call('reviews.insert', reviewDetails, 
      reviewvenueId, reviewRating);
      window.location.assign("/");
    }
    else{
	alert("Feedback too long (size limit of 140 characters)");
    }
    // Clear form
    //target.text.value = '';
    
  },
});

Template.DetailsView.events({
  'submit .edit-venue'(event) {
    // Prevent default browser form submit
    event.preventDefault();
    
    // Get value from form element
    const target = event.target;
    const venueId = this._id;
    const venueName = target.venueName.value;
    const venueDescription = target.venueDescription.value;
    const venueLatitude = target.venueLatitude.value;
    const venueLongitude = target.venueLongitude.value;
    const venueOpeningHours = target.venueOpeningHours.value;
    const venueWebsite = target.venueWebsite.value;
    const venueBooking = target.venueBooking.value;
    const venueNews = target.venueNews.value;
 
    // Insert a venue into the collection
    Meteor.call('venues.update', venueId, venueName, venueDescription, 
      venueLatitude, venueLongitude, venueOpeningHours, 
      venueWebsite, venueBooking, venueNews);
    // Clear form
    //target.text.value = '';
    window.location.assign("/venue/" + this._id);
  },
});


Template.DetailsView.onRendered(function(){
        
	
});

arrayavg = function(data){
var sum = 0;
for(var i = 0;i < data.length;i++)
{
	sum = sum + data[i].score;

}
return sum / data.length;

};

