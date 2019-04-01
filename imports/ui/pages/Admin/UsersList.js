import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
 class UsersList extends Component {
  constructor(props){
    super(props);
    console.log(props.userList);
    this.state = {
      usersList: props.userList ,
    };
  }

   componentWillReceiveProps(nextProps){
    this.setState({usersList: nextProps.userList})
  }

  render(){
    console.log(this.state.usersList);
    if(this.state.userList == ''){
      return <a></a>;
    }else{
    return (
      <div>
          {this.props.userList.map(User => {
          const { _id, profile, username} = User;
          const firstname = User.profile.firstname;
          const lastname = User.profile.lastname;
          const emails = User.profile.address;
          return(
            <li key={_id} className="list-group-item" style={{padding: '15px 15px', textAlign: 'left'}}>
              {profile.firstname} <i>-{User.roles}</i>
            <a className="glyphicon glyphicon-edit pull-right"  onClick={this.props.onEdit.bind(this, {_id},{firstname},{lastname},{emails},{username})}/></li>
          );
      })}
      </div>
    );
    }
  }
}

           

export default createContainer(props => {
  console.log(props.filterUser);
  Meteor.subscribe('userList',
     { $or: [ {'profile.firstname': {$regex: ".*" + props.filterUser + ".*"}}, {'profile.lastname': {$regex: ".*" + props.filterUser + ".*"}} ] },
     {sort:{firstname: 1}, limit:100}
  );
  return { 
    userList:Meteor.users.find( { $or: [ {'profile.firstname': {$regex: ".*" + props.filterUser + ".*"}}, {'profile.lastname': {$regex: ".*" + props.filterUser + ".*"}} ] } , {limit:20},{sort: {firstname: -1}}).fetch(),
          };
}, UsersList);

