import { SensorData } from '../api/datastream.js';
import { Venues } from '../api/venues.js';
import { Reviews } from '../api/reviews.js';

import './map.html';


Template.MapView.helpers({  
  
});

Template.MapView.onCreated(function(){
	
  
});

arrayavg = function(data){
var sum = 0;
for(var i = 0;i < data.length;i++)
{
	sum = sum + data[i].score;

}
return sum / data.length;

};

initMap = function() {
	
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 15,
          center:new google.maps.LatLng(FlowRouter.getQueryParam("coord").split(',')[0],FlowRouter.getQueryParam("coord").split(',')[1])
        });
        var data = Venues.find().fetch();
        for(var i = 0;i < data.length;i++)
            {
               var array = SensorData.find({"sensorId":Venues.findOne({"_id": data[i]._id}).sensorId}).fetch();
               var latest = array[array.length - 1];
               var reviews = Reviews.find({"venueId":data[i]._id}).fetch();
               var avg = arrayavg(reviews);
	       if(isNaN(avg))
	        {
		  avg = 0;
		}
               if(latest == undefined)
		{
                   latest = {people:0,meanSnd:0,temp:0};
		}
        var contentString = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h1 id="firstHeading" class="firstHeading">'+ data[i].name + '</h1>'+
            '<div id="bodyContent">'+
            '<p>' + data[i].description + '</p>' +
	    '<p>Phone: '+ data[i].phone + '</p>' +
            '<p>Review Score: ' + avg +'/5 </p>' +
            '<p>People: ' + latest.people + ' Noise: ' + latest.meanSnd + ' Temperature: ' + latest.temp + '</p>' +
            '<p><a href="'+ data[i].websiteURL + '" class="btn btn-default" role="button" target="new">Website</a>' +
            '<p><a href="/details/'+ data[i]._id + '" class="btn btn-default" role="button">More Details</a>' +
            '</p>' +
            '</div>'+
            '</div>';

        var infowindow = new google.maps.InfoWindow({
          content: contentString
        });

        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(data[i].latitude, data[i].longitude),
          map: map,
          title: data[i].name,
          wind: infowindow,
          _id: data[i]._id
        });
        marker.addListener('click', function() {
          this.wind.open(map, this);
        });
      }
}
