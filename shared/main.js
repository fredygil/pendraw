// Method definitions
Meteor.methods({
    // Creates a first new draw 
    createFirstDraw: function(){
        var draw;
        if (!this.userId){// not logged in
            return;
        }
        else {
            //There is now draws for the user? Creates a new one
            if (Draws.find({owner: this.userId}).count() == 0){
                return newDraw(this.userId);
            } else {
                return Draws.findOne({owner: this.userId}, {sort: {createdOn: -1}, limit: 1});
            }
        }
        return;
    },
    //Creates a new empty draw
    newDraw: function(){
        return newDraw(this.userId);
    },
    //add new object to current draw
    addDrawObject: function(draw, object){
        if (!this.userId){// not logged in
            return;
        }
        //Get the last action
        var lastAction = Actions.findOne({drawId: draw._id}, {sort: {version: -1}, limit: 1});
        var lastVersion = 0;
        if (lastAction){
            lastVersion = lastAction.version;
        }
        //Insert the new action
        var lastUpdate = new Date();
        var action = {
            drawId: draw._id,
            userId: this.userId,
            version: lastVersion + 1,
            action: "add",
            object: object,
            date: lastUpdate
        };
        Actions.insert(action);
        //Updates draw metadata
        Draws.update({_id: draw._id}, {$set: {
                version: lastVersion + 1, 
                size: draw.size + 1,
                lastUpdate: lastUpdate
            }
        });
        return Draws.findOne({_id: draw._id});
    },
    removeDrawContent: function(drawId){
        Actions.remove({drawId: drawId});
        //Updates draw metadata
        Draws.update({_id: drawId}, {$set: {
                version: 0, 
                size: 0,
                lastUpdate: new Date()
            }
        });

        return Draws.findOne({_id: drawId});
    },
    changeDrawPrivacy: function(draw){
        //Draw must be owned by current user
        if (!draw)
            return;
        if (this.userId != draw.owner)
            return;
        Draws.update({_id: draw._id}, {$set: {
                lastUpdate: new Date(),
                private: !draw.private
            }
        });

        return Draws.findOne({_id: draw._id});

    },
    saveSharing: function(draw, user, permission){
        if (!draw)
            throw new Meteor.Error( 500, "There is no current draw");
        if (!user)
            throw new Meteor.Error( 500, "Shared user doesn't exist");
        //Draw must be owned by current user
        if (this.userId != draw.owner)
            throw new Meteor.Error( 500, "Can't share draw from other user");
        //Check user is different from owner
        if (user._id == this.userId)
            throw new Meteor.Error( 500, "You are the owner of the current draw");
        //Check this draw isn't shared with the user yet
        var share = Shares.findOne({drawId: draw._id, userId: user._id});
        if (share) {
            throw new Meteor.Error( 500, "Draw is already shared with " + user.emails[0].address);
        }

        //Insert new sharing
        var r = Shares.insert({
            drawId: draw._id,
            userId: user._id,
            userEmail: user.emails[0].address,
            permission: permission
        });
        return r;
    },
    updateSharePermission: function(shareId, permission){
        //Check share existence
        var share = Shares.findOne({_id: shareId});
        if (!share)
            throw new Meteor.Error( 500, "Share doesn't exists");

        var r = Shares.update({_id: shareId},
            {$set: {
                permission: permission
            }}
        );
        return r;
    },
    removeSharePermission: function(shareId){
        //Check share existence
        console.log("Removing share " + shareId);
        var share = Shares.findOne({_id: shareId});
        if (!share)
            throw new Meteor.Error( 500, "Share doesn't exists");
        var r = Shares.remove({_id: shareId});
        return r;
    }
});


function newDraw(userId){
    var date = new Date();
    draw = {
        owner: userId, 
        createdOn: date, 
        lastUpdate: date,
        title: "My New Draw",
        version: 0,
        size: 0,
        private: true,
        sharedUsers: new Array()
    };
    var id = Draws.insert(draw);
    return Draws.findOne({_id: id});
}

