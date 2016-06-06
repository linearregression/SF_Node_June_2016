var mongoose = require('mongoose');

/*
var meetupEventSchema = new mongoose.Schema({
    // [TO DO] I need to know what data will be used so I can add it to the schema
    // [NOTE] meetup API documentation ( https://secure.meetup.com/meetup_api )
    title: { type: String, trim: true }
});

var googleEventSchema = new mongoose.Schema({
    // [TO DO] I need to know what data will be used so I can add it to the schema
    title: { type: String, trim: true }
});
*/

var peopleSchema = new mongoose.Schema({
    username: { type: String, trim: true }
    , password: { type: String, trim: true }
    , googleId: { type: String, trim: true }
    , usrFirst: { type: String, trim: true }
    , usrLast: { type: String, trim: true }
    , usrEmail: { type: String, trim: true }
    , usrPhotos: { type: String, trim: true}
    , usrGender: {type: String, trim:true}
    , usrOccupation: {type: String, trim:true}
    , usrSkills: {type:String, trim:true}
    , usrUrls: [String] // NOTE - look into this type ( http://mongoosejs.com/docs/schematypes.html )
    , usrAccessToken: { type: String, trim: true }
    , usrRefreshToken: { type: String, trim: true }
    /*
    //add time with Moment
    , usrCreatedDate:{ type:Date, default:Date.now}
    , usrLastLogin:{type:Date}
    */
    
    , usrSocial: { type: String, trim: true }
});

var People = mongoose.model('People', peopleSchema);

/*
mongoose.model('MeetupEvent', meetupEventSchema);
mongoose.model('GoogleEvent', googleEventSchema);

*/

module.exports = People;