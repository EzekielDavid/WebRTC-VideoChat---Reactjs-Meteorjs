import React, { Component } from 'react';
import { withHistory, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Business } from '../../../api/Business';
import UsersList from './UsersList';
 class Users extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
      cbIsVisible: false,
      businessId:'',
      usersName:'',
      loadspinner: false,
    };
    this.changeRoles = this.changeRoles.bind(this);
    this.searchUsers = this.searchUsers.bind(this);
    this.Edit = this.Edit.bind(this);
    this.changeBusiness = this.changeBusiness.bind(this);
    this.renderBusiness = this.renderBusiness.bind(this);
    this.renderSpinner= this.renderSpinner.bind(this);
    this.handleFaker= this.handleFaker.bind(this);
    // this.='';
  }

  renderBusinesslist(){
    return this.props.business.map(Business => {
      const { _id, name} = Business;
      return(
         <option key={_id} value={name}>{name}</option>              
      );
    });
  }
    renderSpinner(){
    if(this.state.loadspinner)
    {
      return(                    
        <div className="form-group"> 
            <h2>Generating Data...</h2>
            <div className="loader"></div>
        </div>
      );
    } else {
      return <a></a>;
      }
  }

  handleFaker(event){
    event.preventDefault();
    var businessId = this.state.businessId;
    this.setState({
      loadspinner: true,
    });
    Meteor.call('faker.users', (error)=>{
      if(error){
      console.log('error');
      } else{
        this.setState({
          loadspinner: false,
        });
        alert('Faker success!');
      }
    });
  }
  renderBusiness(){
    if(this.state.cbIsVisible){
      return(
            <div className="form-group">
              <label  className="col-sm-3 control-label">Business</label>
              <div className="col-sm-9">
                <select className="form-control" ref="business"  onChange={this.changeBusiness}>
                  {this.renderBusinesslist()}
                </select>
              </div>
            </div>
        );
    }
    else{
      return <a>.</a>;
    }
  }

  changeBusiness(event){
        var b_id = event.target.value;
        console.log(b_id);
          this.setState({
              businessId: b_id
            });
  }

  changeRoles(event){
        var role = event.target.value;
        if(role == "Manager"||"Member"){
            this.setState({
              cbIsVisible: true,
            });
        }if(role == "Admin"){
            this.setState({
              cbIsVisible: false,
              businessId: " ",
            });
        }
  }


  handleSave(event){
    event.preventDefault();
    var businessId = this.state.businessId;

    var firstname = this.refs.fname.value;
    var lastname=this.refs.lname.value;
    var email=this.refs.email.value;
    var username=this.refs.username.value;
    var password=this.refs.password.value;
    
    Meteor.call('users.add',firstname, lastname, email, username, password, this.refs.roles.value,businessId, (error)=>{
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
  searchUsers(){
    console.log('change');
             this.setState({
              usersName: this.refs.usersName.value,
            });
  }
  Edit(id, firstname, lastname, email, username){
    console.log('clicked from child component');
      this.refs.fname.value = firstname.firstname;
      this.refs.lname.value = lastname.lastname;
      this.refs.email.value = email.email;
      this.refs.username.value = username.username;
      this.id = id._id;
  }
  render(){
    console.log(this.state.usersName);
    return (
        <div>
            <div>
              <div className="panel panel-primary">
                <div className="panel-heading">
                  <h3 className="panel-title">Panel title 
                      <button onClick={this.handleFaker}  className="btn btn-warning">Faker</button>
                  </h3>
                </div>
                <div className="panel-body">
                  <div className="list-group col-xs-5" style={{minHeight: '400px', maxHeight: '400px',  marginBottom: '10px', overflow: 'scroll',  'WebkitOverflowScrolling': 'touch',     padding: '15px, 15px'}}>
                        <a href="#" className="list-group-item active">
                         Users List
                        </a>
                        <input type="text" className="form-control" ref="usersName" onChange={this.searchUsers} style={{padding: '15px 15px'}}/>
                        <UsersList filterUser={this.state.usersName} onEdit={this.Edit}/>
                  </div>
                  <form className="form-horizontal  col-xs-7" role="form"  onSubmit={this.handleSave.bind(this)} style={{minHeight:'400px', maxHeight: '400px',  marginBottom: '10px', overflow: 'scroll',  'WebkitOverflowScrolling': 'touch'}}>
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
                        <select className="form-control" ref="roles" onChange={this.changeRoles}>
                          <option>Admin</option>
                          <option>Manager</option>
                          <option>Member</option>
                        </select>
                      </div>
                    </div>
                    {this.renderBusiness()}
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

                    {this.renderSpinner()}
                  </form>
                </div>
              </div>
            </div>
        </div>
    );
  }
}

Users.propTypes = {
  username: PropTypes.string
}

export default createContainer(()=>{
var searchString = '';
  var subscriptions = new SubsManager({
    // maximum number of cache subscriptions
    cacheLimit: 10,
    // any subscription will be expire after 5 minute, if it's not subscribed again
    expireIn: 5
  });
  subscriptions.subscribe('business',
     {'name': {$regex: ".*" + searchString + ".*"}},
     {sort:{name:1}, limit:300}
  );
  
  return { 
    business: Business.find({'name': {$regex: ".*" + searchString + ".*"}}, {limit:25},{sort: {name: -1}}).fetch(),
          };
}, Users);
