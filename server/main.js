import fs from 'fs';
import path from 'path';

Meteor.startup(function() {
    
    //Redefine URL sent to user for password resseting. reset-password is 
    //intercepted for iron router and properly handles the action
    Accounts.urls.resetPassword = function(token) {
        return Meteor.absoluteUrl('reset-password/' + token);
    };
    
    //Feed templates collection with files in public/templates
    if (!Templates.findOne()){
        const meteorRoot = fs.realpathSync( process.cwd() + '/../' );
        const publicPath = meteorRoot + '/web.browser/app/';

        var files = fs.readdirSync(publicPath + '/templates');
        for (i=0; i<files.length; i++){
            Templates.insert({file: files[i]});
        }
    }

    //Creates folder for storing draws thumbnails
    // var basePath = process.env['METEOR_SHELL_DIR'] + '/../../../.thumbnails/';
    // if (!fs.existsSync(basePath)) {
    //     fs.mkdirSync(basePath);
    // } 
});

//Publish draws where current user is owner or are public or
//are shared with the current user
Meteor.publish("draws", function(){
    return Draws.find({
        $or: [
            {owner: this.userId},
            {private: false},
            {sharedUsers: this.userId}
            ]
    }); 
});

//Only publish actions for current draw
Meteor.publish("actions", function(){
    return Actions.find({});
});

//Shares for each draw
Meteor.publish("shares", function(){
    return Shares.find({});
});

//Users for email searching
Meteor.publish('allUsers', function() {
    return Meteor.users.find({});
});

//Draws templates
Meteor.publish('templates', function() {
    return Templates.find({});
});


//Uses iron router to server .thumbnails as /thumbnails
Router.map(function () {
    this.route('thumbnails', {
        where: 'server',
        path: '/thumbnails/:filename(.*)',
        action: function() {
            var basePath = process.env['METEOR_SHELL_DIR'] + '/../../../.thumbnails/';
            var filename = path.normalize(path.join(basePath, this.params.filename));
            var res = this.response;
            console.log("filename: " + filename);
            console.log(fs.existsSync(filename));
            if (!fs.existsSync(filename) ||
                !fs.statSync(filename).isFile()) {
                    // res.writeHead(404, {'Content-Type': 'text/html'});
                    // res.end('404: no such asset: ' + this.params.filename);
                    // return;
                    filename = path.normalize(path.join(basePath, 'blank.svg'));
            }
            var data = fs.readFileSync(filename);
            var mimeType = mime.lookup(filename);
            res.writeHead(200, { 'Content-Type': mimeType });
            res.write(data);
            res.end();
    },
  });
});

var mime = {
  lookup: (function() {

    var mimeTypes = {
      ".svg": "image/svg+xml",  
      ".html": "text/html",
      ".js":   "application/javascript",
      ".json": "application/json",
      ".png":  "image/png",
      ".gif":  "image/gif",
      ".jpg":  "image/jpg",
    };

    return function(name) {
      var type = mimeTypes[path.extname(name)];
      return type || "text/html";
    };
  }()),
};
