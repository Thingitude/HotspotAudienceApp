FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render("mainLayout", {content: "VenueList"});
  }
});


FlowRouter.route('/map', {
  action: function() {
    console.log("map template");
    BlazeLayout.render("mainLayout", {content: "MapView"});
  }
});

FlowRouter.route('/addvenue', {
  action: function() {
    console.log("AddVenue template");
    BlazeLayout.render("mainLayout", {content: "AddVenue"});
  }
});

FlowRouter.route('/list', {
  action(params, queryParams) {
    BlazeLayout.render("mainLayout", {content: "VenueList"});
  }
});

FlowRouter.route('/details/:venueId/review', {
  action(params, queryParams) {
    BlazeLayout.render("mainLayout", {content: "AddReview"});
  }
});

FlowRouter.route('/details/:venueId', {
  action(params, queryParams) {
    BlazeLayout.render("mainLayout", {content: "DetailsView"});
  }
});

FlowRouter.route('/venueevents/:venueId', {
  action(params, queryParams) {
    BlazeLayout.render("mainLayout", {content: "VenueEvents"});
  }
});

FlowRouter.route('/venue/:venueId', {
  action(params, queryParams) {
    BlazeLayout.render("mainLayout", {content: "Venue"});
  }
});

FlowRouter.route('/addevent/:venueId', {
  action(params, queryParams) {
    BlazeLayout.render("mainLayout", {content: "AddEvent"});
  }
});

FlowRouter.route('/editevent/venueId', {
  action(params, queryParams) {
    BlazeLayout.render("mainLayout", {content: "EditEvent"});
  }
});
