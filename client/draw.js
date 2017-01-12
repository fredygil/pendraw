Template.draw.events({
	'click .sign-out': function(e){
		e.preventDefault();
		Meteor.logout(function(err){
			if (err) {
        		Session.set("displayMessage", err)
			} else {
				Router.go("/");
			}
		});
	}
});