import React, { Component } from 'react';
import { withHistory, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Business_Users } from '../../../api/Business';
 class Agents extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
      cbIsVisible: false,
      businessId:''
    };
  }

  renderRows(){
    return this.props.Agents.map(Agents => {
      const { _id, firstname, lastname} = Agents;
      return(
        <li key={_id} className="list-group-item" style={{padding: '15px 15px', textAlign: 'left'}}>
          {firstname} {lastname}
        <a className="glyphicon glyphicon-edit pull-right "/></li>
      );
    });
  }

  handleSave(event){
    event.preventDefault();

    var firstname = this.refs.fname.value;
    var lastname=this.refs.lname.value;
    var email=this.refs.email.value;
    var username=this.refs.username.value;
    var password=this.refs.password.value;
    
    var businessId = this.props.b_id;
    var roles = 'Member';
    Meteor.call('users.add',firstname, lastname, email, username, password,roles,businessId, (error)=>{
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
    return (
        <div>
            <div>
              <div className="panel panel-primary">
                <div className="panel-heading">
                  <h3 className="panel-title">Agents</h3>
                </div>
                <div className="panel-body">
                  <div className="list-group col-xs-5" style={{minHeight: '400px', maxHeight: '400px',  marginBottom: '10px', overflow: 'scroll',  'WebkitOverflowScrolling': 'touch',     padding: '15px, 15px'}}>
                        <a href="#" className="list-group-item active">
                         List
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
        </div>
    );
  }
}

Agents.propTypes = {
  username: PropTypes.string
}


export default createContainer(props => {
  Meteor.subscribe('Agents',
    {business_id:props.businessProps.business_id}, {});
  return {
    Agents: Business_Users.find({business_id:props.businessProps.business_id}).fetch(),
    b_id: props.businessProps.business_id,
  }
}, Agents);