import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Poundcode = new Mongo.Collection('poundcode');

Meteor.methods({
  'poundcode.insert': function(code,Message, expiration, business_id){
      Poundcode.insert({
        code,
        Message,
        expiration,
        business_id,
        status: 1,
      });
  }
});


