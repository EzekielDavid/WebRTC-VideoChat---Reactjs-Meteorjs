import React, { Component } from 'react';
import { withHistory, Link } from 'react-router-dom';
import { Panel } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Business } from '../../../api/Business';
 class BusinessConfig extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: ''
    };
  }

  renderRows(){
    return this.props.business.map(Business => {
      const {_id, name} = Business;
      return(
        <li key={_id} className="list-group-item" style={{padding: '15px 15px', textAlign: 'left'}}>
          {name} <i></i>
        <a className="glyphicon glyphicon-edit pull-right "/></li>
      );
    });
  }

  handleSave(event){
    event.preventDefault();
    console.log('clicked');

    Meteor.call('business.insert',this.refs.name.value,this.refs.description.value, this.refs.types.value,(error)=>{
      if(error){
      console.log('error');
      } else{
        alert('success');
        this.refs.name.value = '';
        this.refs.description.value = '';
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
                  <h3 className="panel-title">Business</h3>
                </div>
                <div className="panel-body">
                  <div className="list-group col-xs-5" style={{maxHeight: '400px',  marginBottom: '10px', overflow: 'scroll',  'WebkitOverflowScrolling': 'touch',     padding: '15px, 15px'}}>
                        <a href="#" className="list-group-item active">
                         Data List
                        </a>
                        
                        {this.renderRows()}
                  </div>
                  <form className="form-horizontal  col-xs-7" role="form"  onSubmit={this.handleSave.bind(this)} style={{maxHeight: '400px',  marginBottom: '10px', overflow: 'scroll',  'WebkitOverflowScrolling': 'touch'}}>
                        <div className="form-group">
                          <label  className="col-sm-3 control-label">Name</label>
                          <div className="col-sm-9">
                            <input type="text"  ref="name" className="form-control" 
                              placeholder="Type business name..." required />
                          </div>
                        </div>
                        <div className="form-group">
                          <label  className="col-sm-3 control-label">Description</label>
                          <div className="col-sm-9">
                            <input type="text"  ref="description" className="form-control" 
                              placeholder="Type business description..." required />
                          </div>
                        </div>
                        <div className="form-group">
                          <label  className="col-sm-3 control-label">Business Type</label>
                          <div className="col-sm-9">
                            <input type="text"  ref="types" className="form-control" 
                              placeholder="Type business description..." required />
                          </div>
                        </div>
                      <div className="col-sm-offset-2">
                        <button type="reset" className="btn btn-default">Unset</button>
                      </div>
                      <div className="col-sm-offset-2">
                        <button type="submit" className="btn btn-default">Save</button>
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

BusinessConfig.propTypes = {
  username: PropTypes.string
}

export default createContainer(()=>{
  Meteor.subscribe('business');
  console.log(Counts.get('busCount'));
  return { business: Business.find({}).fetch()};
}, BusinessConfig);
