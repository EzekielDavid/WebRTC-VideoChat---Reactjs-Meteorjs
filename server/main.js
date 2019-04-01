import { Meteor } from 'meteor/meteor';
import http from 'http';

import { ChatUsers } from '../imports/api/Messages';
import  './publications';
Meteor.startup(() => {
	Accounts.onCreateUser(function(options,user)
	{
		if(!user.profile){
			user.profile = {};
		}

		user.profile.firstname = options.firstname;
		user.profile.lastname = options.lastname;
    user.profile.business_id = options.business_id;

		assignRoles(options, user);
		return user;
	});
	const checkIfFirstUser = () => {
  	const userCount = Meteor.users.find().count();
  	return userCount === 0;
	};
	const assignRoles = (options, user) => {
  	const firstUser = checkIfFirstUser();
  	if (firstUser) {
    	const roles = ['Admin'];
    	user.roles = roles;
    	Roles.addUsersToRoles(user._id, roles);
  	} 

  	return user;
	};


  var bodyParser = require( 'body-parser' );
  var post = Picker.filter(function(req, res) {
    return req.method == "POST";
  });

  var updates = Picker.filter(function(req, res) {
    return req.method == "PUT";
  });

  var del = Picker.filter(function(req, res) {
    return req.method == "DELETE";
  });
  Picker.middleware( bodyParser.json() );
  Picker.middleware( bodyParser.urlencoded( { extended: false } ) );

  let affixResponse = function (instance, statusCode, headers, body) {
     if (instance) {
        instance.statusCode = statusCode;
        for (let head in headers) {
           instance.setHeader(head, headers[head]);
        }
        instance.end(body);
     }
  };

  post.route('/get/:from/:to/', function (params, req, response, next) {
    let message = 'Get Message!';
    var msgFrom = params.from;
    var msgTo = params.to;
    let result =  Meteor.users.findOne({'username':msgFrom});
    let to =  Meteor.users.findOne({'username':msgTo});
    if(result != '' && to != ''){
       result = ChatUsers.find({'owner': result._id, 'userId': to._id}).fetch(); 
      console.log(result);
    }
    else{
      result = 'Username not found';
    }
    affixResponse(response, 200, { 'Content-Type': 'application/xml' }, JSON.stringify(result));

  });

    post.route('/post/:from/:to/:body', function (params, req, response, next) {
    let message = 'Get Message!';
    var msgFrom = params.from;
    var msgTo = params.to;
    var msgBody = params.body;
    let result =  Meteor.users.findOne({'username':msgFrom});
    let to =  Meteor.users.findOne({'username':msgTo});
    if(result != '' && to != ''){
      ChatUsers.insert({
          chatIds:[
            to._id,
            result._id,
          ],
          owner: result._id,
          userId:  to._id,
          toSendUsername: msgFrom,
          text: msgBody,
          createdAt: new Date(),
        });

      result = 'Message Sent';
    }
    else{
      result = 'Username not found';
    }
    affixResponse(response, 200, { 'Content-Type': 'application/xml' }, JSON.stringify(result));

  });

    updates.route('/update/:id/:body', function (params, req, response, next) {
      let message = 'Get Message!';
      var msgid = params.id;
      var msgBody = params.body;
      let result =  ChatUsers.findOne({'_id':msgid});
      if(result){
        ChatUsers.update({ _id: msgid },        {
          $set: 
          { 
            "text": msgBody
            }
        });
        result = 'Message Sent';
      }
      else{
        result = 'Username not found';
      }
      affixResponse(response, 200, { 'Content-Type': 'application/xml' }, JSON.stringify(result));
   });

    del.route('/remove/:id', function (params, req, response, next) {
      let message = 'Get Message!';
      var msgid = params.id;
      let result =  ChatUsers.findOne({'_id':msgid});
      if(result){
        ChatUsers.remove({ _id: msgid });
        result = 'Message Sent';
      }
      else{
        result = 'Username not found';
      }
      affixResponse(response, 200, { 'Content-Type': 'application/xml' }, JSON.stringify(result));
   });


});


