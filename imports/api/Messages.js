import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Messages = new Mongo.Collection('messages');
export const ChatUsers = new Mongo.Collection('chatusers');

Meteor.methods({

    // 'interact.find': function(consumersId, b_id){
    //  var res = Interaction.findOne({chatIds:{$all:[{consumers_id: consumersId,business_id: b_id}]}});
    //  console.log(res);
    //  if (res){
    //   return res._id;
    // }else return res;
     
    // },
     'message.new': function(consumers_id, business_id, text){
        const tokensms = Math.random().toString(36).slice(-5);
        Interaction.insert({
          consumers_id,
          business_id,
          text,
          tokensms,
          sender: Meteor.userId(),
          createdAt: Date.now()
        });
    }
});
