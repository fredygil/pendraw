Router.configure({
  layoutTemplate: 'layout'
});

//Welcome screen
Router.route('/', function () {
    //By default, loginMode is LOGIN, i.e., User must sign in or sign up
    Session.set("loginMode", "LOGIN");

    if (Meteor.userId()) {
        Session.set("userStatus", "loggedIn");
        Router.go("/draw");
    }
    else {
        Session.set("userStatus", "login");
    }
    
    this.render("welcome", {to: "body"});  
});


Router.route('/reset-password/:token', function () {
    //Used for password recovery. If URL has a recovery token, it is 
    //stored in resetPasswordToken
    if (this.params.token) {
        Session.set('resetPassword', this.params.token);
        Session.set("loginMode", "RECOVER");
    }
    
    this.render("welcome", {to: "body"});  
});


// After Sign In or Sign Up, shows drawing canvas
Router.route('/draw', function () {
    if (Meteor.userId()) {
        this.render("draw", {to: "body"});  
    } else {
        //Not logged in? Go to welcome screen
        Router.go("/");
    }
});

