import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Business = new Mongo.Collection('business');
export const Business_Users = new Mongo.Collection('business_users');


Meteor.methods({
   'users.add'(firstname, lastname, email, username, password, rolesRef, businessId){ 
    var id = Accounts.createUser({
        firstname: firstname,
        lastname: lastname,
        email: email,
        username: username,
        password: password,
        business_id:businessId});
    Roles.addUsersToRoles(id, rolesRef);
    
    if(businessId !== ""){
      
      Business_Users.insert({
          users_id: id,
          business_id: businessId,
          status: 1,
          firstname: firstname,
          lastname: lastname,
        });
      Business.update({ "_id": businessId},
        {
          $push: 
          { 
            "consumers": 
            { 
              "_id" : id, 
              }
            }
        });
    
    }

  },


  'business.insert': function(name,description, type){
      const token = Math.random().toString(36).slice(-5);
      Business.insert({
        name,
        description,
        type,
        token
      });
  }
});


