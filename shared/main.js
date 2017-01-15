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
                // var date = new Date();
                // draw = {
                //     owner: this.userId, 
                //     createdOn: date, 
                //     lastUpdate: date,
                //     title: "My New Draw",
                //     version: 0,
                //     size: 0,
                //     private: true
                // };
                // var id = Draws.insert(draw);
                // return Draws.findOne({_id: id});
                return newDraw(this.userId);
            } else {
                return Draws.findOne({owner: this.userId}, {sort: {createdOn: -1}, limit: 1});
            }
        }
        return;
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

