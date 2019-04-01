import { check } from 'meteor/check';
import { Business } from '../imports/api/Business';
import { Business_Users } from '../imports/api/Business';
import { Interaction } from '../imports/api/Interaction';
import { Faker } from '../imports/api/Faker';
import { ChatUsers } from '../imports/api/Messages';
import '../imports/api/SendSms';



Meteor.publish('userList', function(query, options){
  this.unblock();
  return Meteor.users.find(query, options);
});
 Meteor.publish('business', function(query, options){
  this.unblock();
  return Business.find(query, options);
});

Meteor.publish('Agents', function (query, options) {
  return Business_Users.find(query);
});



Meteor.publish('dashboard', function(){
    this.unblock();
    return   Meteor.users.find({}, {sort:{firstname: 1}, limited: 1});
});




Meteor.publish('chatusers', function(query, options){
  return ChatUsers.find(query, options);
});


Meteor.publish('faker', function(){
  return Faker.find({});
});



Meteor.publish('onlusers', function(query, options){
  this.unblock();
  return Meteor.users.find({"status.online":true});
});

