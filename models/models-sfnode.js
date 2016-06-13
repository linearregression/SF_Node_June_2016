var mongoose = require('mongoose');

var peopleSchema = new mongoose.Schema({
    username: { type: String, trim: true, required: [true, 'You must have a username!'] }
    , password: { type: String, trim: true }
    , googleId: { type: String, trim: true }
    , usrFirst: { type: String, trim: true }
    , usrLast: { type: String, trim: true }
    , usrEmail: { type: String, trim: true }
    , usrPhotos: { type: String, trim: true }
    , usrGender: { type: String, trim: true }
    , usrOccupation: { type: String, trim: true }
    , usrSkills: { type: String, trim: true }
    , usrUrls: [String]
    , usrCover: { type: String, trim: true }
    , usrHome: { type: String, trim: true }
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

module.exports = People;