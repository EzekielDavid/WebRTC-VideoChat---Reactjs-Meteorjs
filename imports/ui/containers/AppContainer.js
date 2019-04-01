import React, { Component } from 'react';
import { withHistory } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';
import AdminContainer from './Admin/AdminContainer.js';
import NotFoundPage from '../pages/notfound.js';
import { Business } from '../../api/Business';
import BusinessContainer from './Business/BusinessContainer.js';

 class AppContainer extends Component {
  constructor(props){
    super(props);
    this.state =  this.getMeteorData();
    this.logout = this.logout.bind(this);

    this.renderUsername= this.renderUsername.bind(this);
    this.roles = 0;
  }

  getMeteorData(){
    return { isAuthenticated: Meteor.userId() !== null };
  }

  componentWillMount(){
    if (!this.state.isAuthenticated) {
      this.props.history.push('/login');
    }
  }

  componentDidUpdate(prevProps, prevState){ 
    if (!this.state.isAuthenticated) {
      this.props.history.push('/login');
    }
  }

  logout(e){
    e.preventDefault();
    Meteor.logout( (err) => {
        if (err) {
            console.log( err.reason );
        } else {
            this.props.history.push('/login');
        }
    });
  }

  renderUsername(){
        return (
         <li>
          {this.props.currentUser.map(User => {
            const {username, roles} = User;
            return(
                      <a>Hi User: {username}</a>
                 
            );
          })}
        </li>
    );
  }

  render(){

      if (this.props.isRoles == 1){
        return (
                  <div>
                      <nav className="navbar navbar-default navbar-static-top">
                        <div className="container">
                          <div className="navbar-header">
                            <a className="navbar-brand" href="#">chatApp - Admin</a>
                            
                          </div>
                         
                          <div className="navbar-collapse">
                            <ul className="nav navbar-nav navbar-right">
                              {this.renderUsername()}
                              <li>
                                <a href="#" onClick={this.logout}>Logout</a>
                              </li>
                        
                            </ul> 
                          </div>
                        </div>
                      </nav>
                       <AdminContainer />
                  </div>
                 );
      }
      if (this.props.isRoles == 2 || this.props.isRoles == 3){
       Session.set('isRoles', this.props.isRoles); 
        return (
                  <div>
                      <nav className="navbar navbar-default navbar-static-top">
                        <div className="container">
                          <div className="navbar-header">
                            <a className="navbar-brand" href="#">chatApp</a>
                             
                          </div>
                          <div className="navbar-collapse">
                            <ul className="nav navbar-nav navbar-right">
                              {this.renderUsername()}
                              <li>
                                <a href="#" onClick={this.logout}>Logout</a>
                              </li>
                            </ul> 
                          </div>
                        </div>
                      </nav>
                       <BusinessContainer roles={this.props.isRoles}/>
                  </div>
                 );
      }
      else
      {
        return<NotFoundPage />;
      }
              
    
  }
}

export default AppContainer = createContainer(({params}) => {

  Meteor.subscribe('userList',
    {_id: Meteor.userId()}, {});
   var isRoles = 0;
   if(Roles.userIsInRole(Meteor.userId(), 'Admin')){
           isRoles = 1;
      }
  if(Roles.userIsInRole(Meteor.userId(), 'Manager')){
            isRoles = 2;
      }
  if(Roles.userIsInRole(Meteor.userId(), 'Member')){
            isRoles = 3;
      }
  var currentUser = Meteor.users.findOne({_id: Meteor.userId()});

  return {
    isRoles,
    currentUser: Meteor.users.find({_id: Meteor.userId()}),
  };
}, AppContainer);
