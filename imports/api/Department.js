import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Department = new Mongo.Collection('department');

Meteor.methods({
  'department.insert': function(name,shortname, description, b_id){
      Department.insert({
        name,
        shortname,
        description,
        status: 1,
        business_id: b_id
      });
  }
});


