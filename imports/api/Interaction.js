import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Interaction = new Mongo.Collection('interaction');

Interaction.allow({
    insert: function(userId, doc){
        return true;
    },
    update: function(userId,doc,fieldNames, modifier){
        return true;
    },

    remove: function(userId,doc){
        return false;
    },

});

Meteor.methods({
    'interact.find': function(consumersId, b_id){
     var res = Interaction.findOne({chatIds:{$all:[{consumers_id: consumersId,business_id: b_id}]}});
     console.log(res);
     if (res){
      return res._id;
    }else return res;
     
    },
     'interact.new': function(consumersId, b_id){
      var interactId = Interaction.insert({chatIds:[{consumers_id: consumersId,business_id: b_id}],messages:[]});
      return interactId;
    }
});
