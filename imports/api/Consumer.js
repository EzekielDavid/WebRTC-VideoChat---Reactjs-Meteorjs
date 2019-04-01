import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import Business from './Business';
export const Consumer = new Mongo.Collection('consumers');
export const Group_Consumer = new Mongo.Collection('group_consumers');

Meteor.methods({
  'consumers.add': function(mobiles, firstname,lastname,email, b_id){
      const token = Math.random().toString(36).slice(-5);
      Consumer.insert({
            firstname,
            lastname,
            mobiles,
            email,
            token,
            business_id: b_id,
            isActive : 1
          }, function(error, res){
            if(error){
              console.log(error)
            }
          });
  },
    'groupCon.add': function(name, b_id,members){
      const token = Math.random().toString(36).slice(-5);
      Group_Consumer.insert({
            business_id: b_id,
            name,
            token,
            members,
            isActive : 1
          }, function(error, res){
            if(error){
              console.log(error)
            }
          });
  }
});


