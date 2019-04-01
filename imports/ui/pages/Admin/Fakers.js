import React, { Component } from 'react';
import { withHistory, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import  Timestamp  from 'react-timestamp';
import { createContainer } from 'meteor/react-meteor-data';
import { Business } from '../../../api/Business';
import { Faker } from '../../../api/Faker';
 class Fakers extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
      cbIsVisible: false,
      businessId:'',
      loadspinner: false,
    };
    this.renderSpinner= this.renderSpinner.bind(this);
  }

  renderRows(){
    return this.props.faker.map(Faker => {
      const { _id, createdAt, status, note} = Faker;
      if (status){
        return(
          <li key={_id} className="list-group-item" style={{padding: '15px 15px', textAlign: 'left'}}>
           <span>{note}</span>
           <br />
           <span><Timestamp time={createdAt} utc={false} format='full' /></span> <span class="label label-success pull-right">Success</span>
          </li>
          );
        }
      else{
         return(
          <li key={_id} className="list-group-item" style={{padding: '15px 15px', textAlign: 'left'}}>
            <span>{note}</span>
            <br />
            <span><Timestamp time={createdAt} utc={false} format='full' /></span> <span class="label label-warning pull-right">Fail</span>
          </li>
          );
      }

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

  handleSave(event){
    event.preventDefault();
    var businessId = this.state.businessId;
    this.setState({
      loadspinner: true,
    });
    Meteor.call('faker.log', this.refs.note.value, (error)=>{
      if(error){
      console.log('error');
      } else{
        this.setState({
          loadspinner: false,
        });
        alert('Faker success!');
        this.refs.note.value = '';
      }
    });
  }
  render(){

    let currentUser = this.props.currentUser;
    let userDataAvailable = (currentUser !== undefined);
    let loggedIn = (currentUser && userDataAvailable);
    return (
        <div>
            <div>
              <div className="panel panel-primary">
                <div className="panel-heading">
                  <h3 className="panel-title">Panel title</h3>
                </div>
                <div className="panel-body">
                  <div className="list-group col-xs-5" style={{minHeight: '400px', maxHeight: '400px',  marginBottom: '10px', overflow: 'scroll',  'WebkitOverflowScrolling': 'touch',     padding: '15px, 15px'}}>
                        <a href="#" className="list-group-item active">
                         Faker - Generate Sample Data
                        </a>
                        {this.renderRows()}
                  </div>
                  <form className="form-horizontal  col-xs-7" role="form"  onSubmit={this.handleSave.bind(this)} style={{minHeight: '400px', maxHeight: '400px',  marginBottom: '10px', overflow: 'scroll',  'WebkitOverflowScrolling': 'touch'}}>
                    <div className="form-group">
                      <label  className="col-sm-3 control-label">Note</label>
                      <div className="col-sm-9">
                        <input type="text"  ref="note" className="form-control" 
                          placeholder="Type note..."  />
                      </div>
                    </div>
                    <div className="form-group">
                      <label  className="col-sm-3 control-label">Confirm</label>
                      <div className="col-sm-9">
                        <input type="text"  ref="confirm" className="form-control" 
                          placeholder="Type CONFIRM to continue..." required />
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
                    {this.renderSpinner()}
                  </form>
                </div>
              </div>
            </div>
     
        </div>
    );
  }
}

Faker.propTypes = {
  username: PropTypes.string
}

export default createContainer(()=>{
  Meteor.subscribe('faker');
  return { 
    userList: Meteor.users.find({}).fetch(),
    faker: Faker.find({}).fetch(),
          };
}, Fakers);
