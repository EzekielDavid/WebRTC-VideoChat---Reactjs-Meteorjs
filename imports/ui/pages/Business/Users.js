import React, { Component } from 'react';
import { withHistory, Link } from 'react-router-dom';
import { Panel } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
 class Users extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: ''
    };
  }

    renderRows(){
    return this.props.userList.map(User => {
      const { _id} = User;
      return(
        <li key={_id} className="list-group-item" style={{padding: '15px 15px', textAlign: 'left'}}>
          {User.profile.firstname} <i>-{User.roles}</i>
        <a className="glyphicon glyphicon-edit pull-right "/></li>
      );
    });
  }

  handleSave(event){
    event.preventDefault();
    console.log('clicked');
    var users = {
        firstname: this.refs.fname.value,
        lastname: this.refs.lname.value, 
        email: this.refs.email.value,
        username: this.refs.username.value,
        password: this.refs.password.value,
    }
    Meteor.call('users.add',users,this.refs.roles.value, (error)=>{
      if(error){
      console.log('error');
      } else{
        alert('success');
        this.refs.fname.value = '';
        this.refs.lname.value = '';
        this.refs.email.value = '';
        this.refs.username.value = '';
        this.refs.password.value = '';
      }
    });
  }
  render(){
    let currentUser = this.props.currentUser;
    let userDataAvailable = (currentUser !== undefined);
    let loggedIn = (currentUser && userDataAvailable);
    return (
        <div>
          <h1 className="text-center">
            { loggedIn ? 'Welcome '+currentUser.username : '' }
            <div>
              <div className="panel panel-primary" style={{fontSize:'12px'}}>
                <div className="panel-heading">
                  <h3 className="panel-title">Panel title</h3>
                </div>
                <div className="panel-body">
                  <div className="list-group col-xs-5" style={{maxHeight: '400px',  marginBottom: '10px', overflow: 'scroll',  'WebkitOverflowScrolling': 'touch',     padding: '15px, 15px'}}>
                        <a href="#" className="list-group-item active">
                         Users List
                        </a>
                        
                        {this.renderRows()}
                  </div>
                  <form className="form-horizontal  col-xs-7" role="form"  onSubmit={this.handleSave.bind(this)} style={{maxHeight: '400px',  marginBottom: '10px', overflow: 'scroll',  'WebkitOverflowScrolling': 'touch'}}>
                    <div className="form-group">
                      <label  className="col-sm-3 control-label">First Name</label>
                      <div className="col-sm-9">
                        <input type="text"  ref="fname" className="form-control" 
                          placeholder="Type first name..." required />
                      </div>
                    </div>
                    <div className="form-group">
                      <label  className="col-sm-3 control-label">Last Name</label>
                      <div className="col-sm-9">
                        <input type="text"  ref="lname" className="form-control form-control-sm" 
                          placeholder="Type last name..." required/>
                      </div>
                    </div>  
                    <div className="form-group">
                      <label  className="col-sm-3 control-label">Email</label>
                      <div className="col-sm-9">
                        <input type="email"  ref="email" className="form-control form-control-sm" 
                         placeholder="Type email..." required />
                      </div>
                    </div>
                    <div className="form-group">
                      <label  className="col-sm-3 control-label">Username</label>
                      <div className="col-sm-9">
                        <input type="text" ref="username"  className="form-control" 
                          placeholder="Type username..." required />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="col-sm-3 control-label">Password</label>
                      <div className="col-sm-9">
                        <input type="password" ref="password"  className="form-control" 
                          placeholder="Type password..." required />
                      </div>
                    </div>
                    <div className="form-group">
                      <label  className="col-sm-3 control-label">Roles</label>
                      <div className="col-sm-9">
                        <select className="form-control" ref="roles" >
                          <option>Admin</option>
                          <option>Manager</option>
                          <option>Member</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="col-sm-offset-2">
                        <button type="reset" className="btn btn-default">Unset</button>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="col-sm-offset-2">
                        <button type="submit" className="btn btn-default">Save</button>
                      </div>
                    </div>
                  </form>

                </div>
              </div>
            </div>
          </h1>
        </div>
    );
  }
}



export default createContainer(()=>{
  Meteor.subscribe('userList');
  Meteor.subscribe('userList');
  Meteor.subscribe('userList');

  return { userList: Meteor.users.find({}).fetch()};
}, Users);
