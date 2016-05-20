var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
    
var meetupEvent = new Schema({
    // [TO DO] I need to know what data will be used so I can add it to the schema
    // [NOTE] meetup API documentation ( https://secure.meetup.com/meetup_api )
    title:{type:String, trim:true}
});
    
var googleEvent = new Schema({
    // [TO DO] I need to know what data will be used so I can add it to the schema
    title:{type:String, trim:true}
});

var people = new Schema({
    username:{type:String, trim:true}
    , password:{type:String, trim:true}
    , usrEmail: {type:String, trim:true}
    , usrFirst: {type:String, trim:true}
    , usrLast: {type:String, trim:true}
    , usrAccessToken: {type:String, trim:true}
    , usrRefreshToken: {type:String, trim:true}
});

mongoose.model('meetupEvent',meetupEvent);
mongoose.model('googleEvent',googleEvent);
mongoose.model('people',people);