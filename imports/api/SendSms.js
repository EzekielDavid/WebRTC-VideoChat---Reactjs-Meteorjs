import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Faker } from './Faker';
import { Business } from './Business';
import { Consumer } from './Consumer';
import { Group_Consumer } from './Consumer';
import { Business_Users } from './Business';
import { Interaction } from './Interaction';
import { Messages } from './Messages';
import { ChatUsers } from './Messages';
var accountSid = Meteor.settings.accountSid;
var authToken = Meteor.settings.authToken;
var twilio_number = Meteor.settings.twilio_number;
var twilio = require('twilio');
var client = new twilio(accountSid, authToken);
var jsf = require('json-schema-faker');
var Chance = require('chance');
var chance = new Chance();
jsf.extend('faker', function() {
  var faker = require('faker/locale/de');
  return faker;
});
jsf.extend('chance', function() {
    chance.mixin({
    'roles': function() {
      return {
              "chance": {
        "pickone": [
          [
            "Manager",
            "Member",
          ]
        ]
      }
      };
    }
  });
  return chance;
});
var bulkBusiness = Business.rawCollection().initializeUnorderedBulkOp();
var bulkConsumer= Consumer.rawCollection().initializeUnorderedBulkOp();
var bulkBusiness_Users = Business_Users.rawCollection().initializeUnorderedBulkOp();
// var bulkInteraction = Interaction.rawCollection().initializeUnorderedBulkOp();

var bulkMessages = Messages.rawCollection().initializeUnorderedBulkOp();

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

Meteor.methods({
  'interact.sendMessage': function (outgoingMessage, consumers_id, contact, business_id) {
     const tokensms = Math.random().toString(36).slice(-5);
      var flag = 0;

      client.messages.create({
        body: outgoingMessage,
        to: contact,  // Text this number
        from: twilio_number  // From a valid Twilio number
      },function (error) {
                    if (error) {
                        console.log(error);
                        return error;
                    }
                    else {
                        console.log('SMS sent successfully.');
                        flag = 1;
                    }
                });
    

      var de = Messages.insert({
          consumers_id,
          business_id,
          sender: Meteor.userId(),
          text: outgoingMessage,
          tokensms,
          createdAt: new Date(),
          status: flag
        });
        console.log(de);
  },



  'broadcast.sendMessage': function (outgoingMessage, group_consumers_id) {
    const tokensms = Math.random().toString(36).slice(-5);
    const group_consumer = Group_Consumer.findOne({_id:group_consumers_id});
    members = group_consumer.members;
    Promise.all(
       members.map(GC => {
        const {_id,b_id, firstname, lastname, mobiles} = GC;

          Messages.insert({
            consumers_id:_id,
            business_id:b_id,
            sender: Meteor.userId(),
            text: outgoingMessage,
            tokensms,
            createdAt: new Date(),
            status: 1
          });
        return client.messages.create({
            to: mobiles,
            from: twilio_number,
            body: outgoingMessage
          });
      })
    )
      .then(messages => {
        console.log('Messages sent!');
      })
      .catch(err => console.error(err));



    members.map(GC => {
    const {firstname, lastname, mobiles} = GC;

    return twilio.messages.create({
        to: mobiles,
        from: process.env.TWILIO_MESSAGING_SERVICE_SID,
        body: body
      });
    })
  
     const tokensms = Math.random().toString(36).slice(-5);
      var flag = 0;
      
      client.messages.create({
        body: outgoingMessage,
        to: contact,  // Text this number
        from: twilio_number  // From a valid Twilio number
      },function (error) {
                    if (error) {
                        console.log(error);
                        return error;
                    }
                    else {
                        console.log('SMS sent successfully.');
                        flag = 1;
                    }
                });
    

      var de = Messages.insert({
          consumers_id,
          business_id,
          sender: Meteor.userId(),
          text: outgoingMessage,
          tokensms,
          createdAt: new Date(),
          status: flag
        });
        console.log(de);
  },

  'chat.sendMessage': function (outgoingMessage, userId, username) {
     const tokensms = Math.random().toString(36).slice(-5);

      var de = ChatUsers.insert({
          chatIds:[
            Meteor.userId(),
            userId,
          ],
          owner: Meteor.userId(),
          userId: userId,
          toSendUsername: username,
          text: outgoingMessage,
          tokensms,
          createdAt: new Date(),
        });
        console.log(de);
  },

  'faker.log': function(note)
    {
      const token = Math.random().toString(36).slice(-5);
       console.log('GATE 1: GENERATING...');

        jsf.option({
          resolveJsonPath: true,
          alwaysFakeOptionals: true,
        });


        const schema = {
          properties: {
            business: {
              type: 'array',
              minItems:100,
              maxItems: 100,
              uniqueItems: ['name', 'token'],
              items: {
                properties: {
                  _id: {
                    type: 'integer',
                    minimum: 1,
                    autoIncrement: true,
                  },
                  name: {
                    type: "string",
                    faker: "company.companyName" 
                  },
                  description: {
                    type: "string",
                    faker: "company.companySuffix"
                  },
                  type: {
                    type: "string",
                    faker: "company.companySuffix"
                  },
                  token: {
                    type: "string",
                    faker: "random.alphaNumeric"
                  }
                },
              },
            },
            user: {
              type: 'array',
              minItems:1000,
              maxItems: 1000,
              uniqueItems: ['email', 'username'],
              items: {
                properties: {
                  'firstname': {
                    type: "string",
                    faker: "name.findName"
                  },
                  'lastname': {
                    type: "string",
                    faker: "name.findName"
                  },
                  'email': {
                    type: "string",
                    faker: "internet.email"
                  },
                  'username': {
                    type: "string",
                    faker: "internet.userName"
                  },
                  'password': {
                    type: "string",
                    faker: "internet.password"
                  },                  
                  "roles": {
                    "type": "array",
                    "chance": {
                      "pickone": [
                        [
                          "Manager",
                          "Member",
                        ]
                      ]
                    }
                  },
                },
              },
            },
          },
        };

        jsf.resolve(schema).then(function(data) {

          Faker.insert({
              note,
              token,
              status: 1,
              createdAt: Date.now()
          });
          console.log('GATE 2: INSERTING GENERATED DATA...');
          
            business = data["business"];
            business.forEach(business => bulkBusiness.insert(business));
            bulkBusiness.execute();

            var users = data["user"];
            users.forEach(users => Accounts.createUser(users));

          console.log('GATE 3: FAKER SUCCESS!');
          return 'success';

        }).catch(err => console.log(err));
    },

  'faker.Consumer': function(b_id){
      console.log('GATE 1: GENERATING...');
      console.log(b_id);
        var b_id = b_id;
        jsf.option({

          resolveJsonPath: true,
          alwaysFakeOptionals: true,
        });

          const schema = {
          properties: {
            consumers: {
              type: 'array',
              minItems: 55000,
              maxItems: 55000,
              uniqueItems: ['_id', 'mobiles', 'token'],
              items: {
                properties: {
                 _id: {
                    type: 'integer',
                    minimum: 1,
                  },
                  firstname: {
                    type: "string",
                    faker: "name.findName"
                  },
                  lastname: {
                    type: "string",
                    faker: "name.findName"
                  },
                  mobiles: {
                    type: 'string',
                   faker: 'phone.phoneNumber'
                  },
                  token: {
                    type: "string",
                    faker: "random.alphaNumeric"
                  },
                  business_id: b_id,
                },
              },
            },
          },
        };

        jsf.resolve(schema).then(function(data) {
           console.log('GATE 2: INSERTING GENERATED DATA...');
            consumers = data["consumers"];
            consumers.forEach(consumers => bulkConsumer.insert(consumers));
            bulkConsumer.execute();
            console.log('GATE 3: FAKER SUCCESS!');
            return 'success';
        }).catch(err => console.log(err));
    },

  'faker.Messages': function(b_id, consumers_id, consumer_name){
      console.log('GATE 1: GENERATING...');
        jsf.option({

          resolveJsonPath: true,
          alwaysFakeOptionals: true,
        });

        const schema = {
          properties: {
            messages: {
              type: 'array',
              minItems: 100000,
              maxItems: 100000,
              items: {
                properties: {                 
                  consumers_id: consumers_id,
                  business_id: b_id,
                  sender: {
                    type: "string",                    
                    "chance": {
                      "pickone": [
                        [
                           consumer_name,
                           Meteor.userId(),
                        ]
                      ]
                    }     
                  },
                  text: {
                    type: "string",
                    faker: "lorem.paragraph"
                  }, 
                  createdAt:{
                    faker: "date.past"
                  },                  
                  tokensms: {
                    type: "integer",
                    minimum: 1
                  }, 
                },
              },
            },
          },
        };
        jsf.resolve(schema).then(function(data) {
           console.log('GATE 2: INSERTING GENERATED DATA...');
            messages = data["messages"];
            messages.forEach(messages => bulkMessages.insert(messages));
            bulkMessages.execute();
            console.log('GATE 3: FAKER SUCCESS!');
            return 'success';
        }).catch(err => console.log(err));
    },


  'faker.users': function(note)
    {
       console.log('GATE 1: GENERATING...');
      const token = Math.random().toString(36).slice(-5);
       console.log('GATE 1: GENERATING...');

        jsf.option({
          resolveJsonPath: true,
          alwaysFakeOptionals: true,
        });


        const schema = {
          properties: {
            user: {
              type: 'array',
              minItems:8000,
              maxItems: 8000,
              uniqueItems: ['email', 'username'],
              items: {
                properties: {
                  'firstname': {
                    type: "string",
                    faker: "name.findName"
                  },
                  'lastname': {
                    type: "string",
                    faker: "name.findName"
                  },
                  'email': {
                    type: "string",
                    faker: "internet.email"
                  },
                  'username': {
                    type: "string",
                    faker: "internet.userName"
                  },
                  'password': {
                    type: "string",
                    faker: "internet.password"
                  },                  
                  "roles": {
                    "type": "array",
                    "chance": {
                      "pickone": [
                        [
                          "Manager",
                          "Member",
                        ]
                      ]
                    }
                  },
                },
              },
            }
          },
        };

   jsf.resolve(schema).then(function(data) {
          console.log('GATE 2: INSERTING GENERATED DATA...');
          

            var users = data["user"];
            users.forEach(users1 => {
              var id = Accounts.createUser(users1);
              Roles.addUsersToRoles(id, 'member');
            });

          console.log('GATE 3: FAKER SUCCESS!');
          return 'success';

        }).catch(err => console.log(err));
    },

});
