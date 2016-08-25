import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Venues } from '../api/venues.js';
import { ReactiveDict } from 'meteor/reactive-dict';
import { SensorData } from '../api/datastream.js';
import { Events } from '../api/events.js';
import { Reviews } from '../api/reviews.js';
 
import './venue.js';
import './body.html';

test = SensorData;
test2 = Venues;
test3 = Events;
test4 = Reviews;


Meteor.startup(function() {  
  
});
 
Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('venues');
  Meteor.subscribe('sensorData');
  Meteor.subscribe('events');
  Meteor.subscribe('reviews');
});

Template.VenueList.helpers({
  venues() {
    //console.log("body.js venuesssummary helper");
    return Venues.find();
  },
  incompleteCount() {
    return Venues.find().count();
  },
});


Template.Venue.helpers({
  thisVenue() {
    const venueId=FlowRouter.getParam("venueId");
    // console.log(venueId);
    return Venues.findOne({"_id": venueId});
  }
});

datapackettemp = 0;
Template.datapacket.helpers({
  thisVenue() {
    const venueId=FlowRouter.getParam("venueId");
    datapackettemp = datapackettemp + 1;
    console.log(datapackettemp);
    console.log(test.find({"sensorId":test2.findOne({"_id": venueId}).sensorId}).fetch()[datapackettemp-1]);
    if(test.find({"sensorId":test2.findOne({"_id": venueId}).sensorId}).fetch()[datapackettemp-1] === undefined)
	{
		return 0;
	}
    return test.find({"sensorId":test2.findOne({"_id": venueId}).sensorId}).fetch()[datapackettemp-1];

    //Useful
    //test.find({"sensorId":"0004A30B001B67C9"}).fetch()
//    return Venues.find({"_id": "ZzwCsxZHFRQDiXtiF"});
    //return Venues.findOne({"_id": venueId});
  }
});

Template.venuesummarytemplatedata.helpers({
  thisVenue() {
    const venueId=this._id;
    var array = test.find({"sensorId":test2.findOne({"_id": venueId}).sensorId}).fetch();
    return array[array.length - 1];
  }
})

Template.DetailsView.helpers({
  sensorData() {
	 const venueId=FlowRouter.getParam("venueId");
         datapackettemp = 0;
    //console.log(test.find({"sensorId":test2.findOne({"_id": venueId}).sensorId}));;
	//return preloaded
    return test.find({"sensorId":test2.findOne({"_id": venueId}).sensorId});
  },
  events() {
  const venueId=FlowRouter.getParam("venueId");
   return test3.find({"venueId":venueId});
  },
  thisVenue() {
    const venueId=FlowRouter.getParam("venueId");
     // sensordata;


    //Useful
    //test.find({"sensorId":"0004A30B001B67C9"}).fetch()
    //sensordata
//    return Venues.find({"_id": "ZzwCsxZHFRQDiXtiF"});
    return Venues.findOne({"_id": venueId});
  }
});

Template.AddReview.events({
  'submit .add-review'(event) {
    console.log("Save me!")
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    const reviewTitle = target.reviewTitle.value;
    const reviewDetails = target.reviewDetails.value;
    const reviewRating = target.reviewRating.value;
    const reviewvenueId = FlowRouter.getParam("venueId");

    // Insert a venue into the collection
    Meteor.call('reviews.insert', reviewTitle, reviewDetails, 
      reviewvenueId, reviewRating);
    // Clear form
    //target.text.value = '';
    window.location.assign("/");
  },
});

Template.DetailsView.events({
  'submit .edit-venue'(event) {
    //console.log("Save me!")
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

Template.MapView.helpers({  
  mapOptions: function() {
    if (GoogleMaps.loaded()) {
	
      return {
        //center: new google.maps.LatLng(51.4530493, -0.9698146),
	center: new google.maps.LatLng(51.4530493, -0.9698146),
        zoom: 15
      };
    }
  }
  
});


maphandler = function()
{	
	GoogleMaps.ready('map', function(map) {	
	venuedata = Venues.find().fetch();
	for(var i = 0;i < venuedata.length;i++)
	{
		//console.log(venuedata[i].latitude + "," + venuedata[i].longitude);
		 var marker = new google.maps.Marker({
      draggable: false,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(venuedata[i].latitude, venuedata[i].longitude),
      map: map.instance,
      id: document._id,
      infowindow: new google.maps.InfoWindow({content: "<h1>" + venuedata[i].name + "</h1>" + "<p>" + venuedata[i].description + "</p><a href=/details/" + venuedata[i]._id +"/ >Show More</a>"})
	
         });
	
	 marker.addListener('click', function() { 
	       
               this.infowindow.open(GoogleMaps.maps.map.instance, marker);
               GoogleMaps.maps.map.instance.panTo(new google.maps.LatLng(51.4530493, -0.9698146));
	       
               
         
        });
        
   
	}
    google.maps.event.addListener(map.instance, 'click', function(event) {
	alert(event.latLng.lat() + "," + event.latLng.lng()); 
        GoogleMaps.maps.map.instance.panTo(new google.maps.LatLng(51.4530493, -0.9698146));
	for(var i = 0;i < venuedata.length;i++)
	{
		
		if((venuedata[i].latitude - event.latLng.lat()) * (venuedata[i].latitude - event.latLng.lat()) < 0.0000005)
		{
			if((venuedata[i].longitude - event.latLng.lng()) * (venuedata[i].longitude - event.latLng.lng()) < 0.0000005)
		{
			

	  i
		}	
		}
	


	}
    });


  });

};



Template.DetailsView.onCreated(function(){
});


Template.MapView.onCreated(function(){
maphandler();
GoogleMaps.load({ key: 'AIzaSyAoa0T7bQBwDRH-C3jx2QUj4_Se-g2RPLg'});
});

