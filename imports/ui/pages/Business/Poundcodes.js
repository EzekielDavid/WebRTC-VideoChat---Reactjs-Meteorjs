import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Business} from '../../../api/Business';
import { Poundcode } from '../../../api/Poundcode';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
 class Poundcodes extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: ''
    };
     this.renderRows = this.renderRows.bind(this);
     this.editPound = this.editPound.bind(this);
  }

    editPound(poundId, message, code){
    var res = '';
    this.refs.code.value = code.code;
    this.refs.message.value = message.Message;
  }

  renderRows(){
    return this.props.poundcodes.map(PoundCodes => {
      const {code, Message, expiration,_id} = PoundCodes;
      return(
        <li key={_id} className="list-group-item" style={{padding: '15px 15px', textAlign: 'left'}}>
          <bold>{code}</bold> -> <small>{Message}</small>
        <a className="glyphicon glyphicon-edit pull-right " onClick={this.editPound.bind(this, {_id},{Message},{code})}/><br /><i>Date Expired: {expiration}</i> </li>
      );
    });
  }

  handleSave(event){
    event.preventDefault();

    var business_id = this.props.b_id;
    Meteor.call('poundcode.insert',this.refs.code.value,this.refs.message.value, this.refs.expiration.value,business_id, (error)=>{
      if(error){
      console.log('error');
      } else{
        alert('success');
        this.refs.code.value = '';
        this.refs.message.value = '';
        this.refs.expiration.value = '';
      }
    });
  }
  render(){

    return (
        <div>
     
            <div>
              <div className="panel panel-primary" style={{fontSize:'12px'}}>
                <div className="panel-heading">
                  <h3 className="panel-title">Poundcodes</h3>
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
                      <label  className="col-sm-3 control-label">Code</label>
                      <div className="col-sm-9">
                        <input type="text"  ref="code" className="form-control" 
                          placeholder="Type code..." required />
                      </div>
                    </div>
                    <div className="form-group">
                      <label  className="col-sm-3 control-label">Message</label>
                      <div className="col-sm-9">
                        <textarea className ="form-control" rows="5"  ref="message" className="form-control" 
                          placeholder="Type message..." required />
                      </div>
                    </div>
                    <div className="form-group">
                      <DateRangePicker startDate="1/1/2014" endDate="3/1/2014" ref="expiration" className="form-control" >
                        <a type="button">Expiry</a>
                      </DateRangePicker>
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
  Meteor.subscribe('poundcodes');
  return {
    poundcodes: Poundcode.find({business_id:props.businessProps.business_id}).fetch(),
    b_id: props.businessProps.business_id,
  }
}, Poundcodes);