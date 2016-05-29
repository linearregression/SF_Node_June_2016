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
    , meetupId: { type: String, trim: true }
    , usrEmail: { type: String, trim: true }
    , usrFirst: { type: String, trim: true }
    , usrLast: { type: String, trim: true }
    , usrAccessToken: { type: String, trim: true }
    , usrRefreshToken: { type: String, trim: true }
    , usrSocial: { type: String, trim: true }
});

var People = mongoose.model('People', peopleSchema);

/*
mongoose.model('MeetupEvent', meetupEventSchema);
mongoose.model('GoogleEvent', googleEventSchema);

*/

module.exports = People;