Meteor.subscribe("draws");
Meteor.subscribe("actions");
Meteor.subscribe("shares");
Meteor.subscribe('allUsers')


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
        setupCurrentDraw();
        this.render("draw", {to: "body"});  
    } else {
        //Not logged in? Go to welcome screen
        Router.go("/");
    }
});


// Helper to make sure a draw is available
function setupCurrentDraw(){
    //Get the last created draw or creates a first one
    if (Meteor.userId()){
        draw = Draws.findOne({owner: Meteor.userId()}, {sort: {createdOn: -1}, limit: 1});
        if (draw){
            Session.set("currentDraw", draw);
        } else {
            //Creates a new draw to start with
            Meteor.call("createFirstDraw", function(err, result){
                if (!err && result){
                    Session.set("currentDraw", result);
                }
            });
        }
    }
}