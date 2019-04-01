import React, { Component } from 'react';
import { withHistory, Link } from 'react-router-dom';
import { Panel } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Business } from '../../../api/Business';
import BusinessList from './BusinessList';
export default class BusinessConfig extends Component {
  constructor(props){
    super(props);
    this.state = {
      searchString: ''
    };
    this.Search= this.Search.bind(this);
    this.Edit = this.Edit.bind(this);
    this.b_id = '';
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
  Search(){
    this.setState({
        searchString: this.refs.searchString.value,
    });
  }
  Edit(id, name, description, type){
    console.log('clicked from child component');
      this.refs.name.value = name.name;
      this.refs.description.value = description.description;
      this.refs.types.value = type.type;
      this.id = id._id;
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
                  <div className="list-group col-xs-5" style={{minHeight: '400px', maxHeight: '400px',  marginBottom: '10px', overflow: 'scroll',  'WebkitOverflowScrolling': 'touch',     padding: '15px, 15px'}}>
                        <a href="#" className="list-group-item active">
                         Data List
                        </a>

                        <input type="text" className="form-control" ref="searchString" onChange={this.Search} style={{padding: '15px 15px'}}/>
                        <BusinessList searchString={this.state.searchString} onEdit={this.Edit}/>
                  </div>
                  <form className="form-horizontal  col-xs-7" role="form"  onSubmit={this.handleSave.bind(this)} style={{minHeight:'400px', maxHeight: '400px',  marginBottom: '10px', overflow: 'scroll',  'WebkitOverflowScrolling': 'touch'}}>
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
                          <div className="form-group">
                            <label  className="col-sm-3 control-label">Business #</label>
                            <div className="col-sm-9">
                              <input type="text"  ref="busNumber" className="form-control" 
                                placeholder="Type business #" required />
                            </div>
                          </div>   
                          <div className="form-group">
                            <label  className="col-sm-3 control-label">SecretId</label>
                            <div className="col-sm-9">
                              <input type="text"  ref="busSecret" className="form-control" 
                                placeholder="Type business SecretId..." required />
                            </div>
                          </div>                        
                          <div className="form-group">
                            <label  className="col-sm-3 control-label">SecretToken</label>
                            <div className="col-sm-9">
                              <input type="password"  ref="busToken" className="form-control" 
                                placeholder="Type business Token..." required />
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


