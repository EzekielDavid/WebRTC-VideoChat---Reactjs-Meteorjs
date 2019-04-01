import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Business} from '../../../api/Business';
import { Department } from '../../../api/Department';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import ConsumersList from './ConsumersList';
import 'bootstrap-daterangepicker/daterangepicker.css';
 class Departments extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: ''
    };
     this.renderRows = this.renderRows.bind(this);
     this.editDept = this.editDept.bind(this);
  }

    editDept(name, shortname, description){
    var res = '';
    this.refs.name.value = name.name;
    this.refs.shortname.value = shortname.shortname;
    this.refs.description.value = description.description;
  }

  renderRows(){
    return this.props.department.map(Department => {
      const {name, shortname, description,_id} = Department;
      return(
        <li key={_id} className="list-group-item" style={{padding: '15px 15px', textAlign: 'left'}}>
          <bold>{name}</bold> -> <small>{description}</small>
        <a className="glyphicon glyphicon-edit pull-right " onClick={this.editDept.bind(this, {_id},{name},{shortname},{description})}/><br /><i> {shortname}</i> </li>
      );
    });
  }

  handleSave(event){
    event.preventDefault();

    var business_id = this.props.b_id;
    Meteor.call('department.insert',this.refs.name.value,this.refs.shortname.value, this.refs.description.value,business_id, (error)=>{
      if(error){
      console.log('error');
      } else{
        alert('success');
        this.refs.name.value = '';
        this.refs.shortname.value = '';
        this.refs.description.value = '';
      }
    });
  }
  render(){

    return (
        <div>
     
            <div>
              <div className="panel panel-primary" style={{fontSize:'12px'}}>
                <div className="panel-heading">
                  <h3 className="panel-title">Description</h3>
                </div>
                <div className="panel-body">
                  <div className="list-group col-xs-5" style={{minHeight:'400px', maxHeight: '400px',  marginBottom: '10px', overflow: 'scroll',  'WebkitOverflowScrolling': 'touch',     padding: '15px, 15px'}}>
                        <a href="#" className="list-group-item active">
                         Data List
                        </a>
                        {this.renderRows()}
                  </div>
                  <form className="form-horizontal  col-xs-7" role="form"  onSubmit={this.handleSave.bind(this)} style={{minHeight:'400px', maxHeight: '400px',  marginBottom: '10px', overflow: 'scroll',  'WebkitOverflowScrolling': 'touch'}}>
                    <div className="form-group">
                      <label  className="col-sm-3 control-label">Name</label>
                      <div className="col-sm-9">
                        <input type="text"  ref="name" className="form-control" 
                          placeholder="Type department name..." required />
                      </div>
                    </div>                    
                    <div className="form-group">
                      <label  className="col-sm-3 control-label">Shortname</label>
                      <div className="col-sm-9">
                        <input type="text"  ref="shortname" className="form-control" 
                          placeholder="Type department initials..." required />
                      </div>
                    </div>
                    <div className="form-group">
                      <label  className="col-sm-3 control-label">Description</label>
                      <div className="col-sm-9">
                        <textarea class="form-control" rows="5"  ref="description" className="form-control" 
                          placeholder="Type message..." required />
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
        </div>
    );
  }
}


// export default createContainer(props => ()=>{
//   Meteor.subscribe('consumers');
//   return {
//  consumers: Consumer.find({}).fetch(),  

//   };
// }, Consumers);

export default createContainer(props => {
  Meteor.subscribe('department');
  return {
    department: Department.find({business_id:props.businessProps.business_id}).fetch(),
    b_id: props.businessProps.business_id,
  }
}, Departments);