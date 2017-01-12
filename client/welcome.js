Template.welcome.helpers({
    userLogin: function () {
        return Session.get("userStatus") == 'login' || false;
    },
    userRegister: function () {
        return Session.get("userStatus") == 'register' || false;
    },
    userStatus: function(){
    	return Session.get("userStatus");
    },
    loginMode: function(mode){
    	return Session.get("loginMode") == mode;
    }
});

//User Sign In
Template.login.events({
    'click #signup-link': function (e) {
        e.preventDefault();
        Session.set("userStatus", "register");
    },
    'click #recover-password': function(e){
    	e.preventDefault();
    	Session.set("loginMode", "RECOVER");
    },
    'submit form': function(e){
        e.preventDefault();
        
        var username = $.trim(e.target.username.value);
        var password = e.target.password.value;
        
        Meteor.loginWithPassword(username, password, function(err){
			if (err){
        		Session.set("displayMessage", err);
			} else {
		        Session.set("userStatus", "loggedIn");
		        //Logged in? Start to draw
		        Router.go("/draw");
			}    
			return false; 	
        });
    }    
});

//User Sign Up
Template.register.events({
    'click #login-buttons-cancel': function (e) {
        e.preventDefault();
        Session.set("userStatus", "login");
    },
    'submit form': function (e) {
        e.preventDefault();
        
        //Get form data
        var username = $.trim(e.target.username.value);
        var password = e.target.password.value;
        var password2 = e.target.password2.value;

        if (password != password2){
        	//Passwords match validation. Uses UIKit
        	Session.set("displayMessage", "Passwords Don't Match")
        } else {
        	//Go ahead an create new user
	        Accounts.createUser({
	            email: username,
	            password: password
	        }, function(err){
				if (err){
        			Session.set("displayMessage", err);
				} else {
			        Session.set("userStatus", "loggedIn");
			        Router.go("/draw");
				}    
				return false; 	
	        });

        }

    }
});


//Password recovery helpers
Template.recover.helpers({
	resetPassword: function(t) {
	  	return Session.get('resetPassword');
	}
});


//Password recovery events
Template.recover.events({
	'click #login-screen': function(e){
		e.preventDefault();
		Session.set("loginMode", "LOGIN");
	},
	'submit #recovery-form' : function(e) {
        e.preventDefault()
        var email = $.trim(e.target.username.value);

		Session.set('loading', true);
        Accounts.forgotPassword({email: email}, function(err){
        	if (err) {
            	Session.set('displayMessage', err);
        	}
          	else {
            	Session.set('displayMessage', {message: 'Email Sent. Please check your email.', status: 'success'});
          	}
          	Session.set('loading', false);
        });
        return false; 
    },
	'submit #new-password' : function(e, t) {
    	e.preventDefault();
        
        var password = e.target.password.value;
      	Session.set('loading', true);
      	Accounts.resetPassword(Session.get('resetPassword'), password, function(err){
        	if (err)
          		Session.set('displayMessage', err);
        	else {
            	Session.set('displayMessage', {message: 'Password succesfully changed', status: 'success'});
          		Session.set('resetPassword', null);
				Session.set("loginMode", "LOGIN");
				Router.go("/");
        	}
        	Session.set('loading', false);
      	});
      	return false;
    }
});
