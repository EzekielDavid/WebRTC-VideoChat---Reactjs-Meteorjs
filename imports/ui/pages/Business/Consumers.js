import React, { Component } from 'react';
import { withHistory, Link } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Business} from '../../../api/Business';
import { Consumer } from '../../../api/Consumer';
import PropTypes from 'prop-types';
import Modal from '../../components/Modal';
import ConsumersList from './ConsumersList';
 class Consumers extends Component {
  constructor(props){
    super(props);
    this.state = {
      searchString: '',
      b_id:this.props.b_id,
      isOpen: false,
    };
    this.Search= this.Search.bind(this);
    this.initFaker= this.initFaker.bind(this);
    this.toggleModal= this.toggleModal.bind(this);
  }
  componentWillMount(){
    Session.set('consumersLimit', 5);   
  }


  toggleModal() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  renderFaker(){
    return (
        <button onClick={this.initFaker} className="btn btn-warning">Faker</button>
    );
  }
  initFaker(event){
    event.preventDefault();
    this.setState({
        isOpen: !this.state.isOpen
    });
    Meteor.call('faker.Consumer', this.props.b_id, (error)=>{
      if(error){
        console.log('error');
      } else{
        this.setState({
          isOpen: !this.state.isOpen
        });
        alert('success');
      }
    });
  }

  handleSave(event){
    event.preventDefault();
    var business_id = this.props.b_id;
    Meteor.call('consumers.add',this.refs.mobile.value,this.refs.firstname.value, this.refs.lastname.value,this.refs.email.value, business_id, (error)=>{
      if(error){
      console.log('error');
      } else{
        alert('success');
        this.refs.mobile.value = '';
        this.refs.firstname.value = '';
        this.refs.lastname.value = '';
        this.refs.email.value = '';
      }
    });
  }

  Search(){
    this.setState({
      searchString: this.refs.searchString.value,
    });
    Session.setDefault('searchString', this.refs.searchString.value);

  }

  renderModal() {
    return (
      <div className="App">
        <Modal show={this.state.isOpen}
          onClose={this.toggleModal}>
            <h2>Generating Data...</h2>
            <div className="loader"></div>
        </Modal>
      </div>
    );
  }


  render(){
    Session.set('consumersLM', 5);   
    return (  
        <div>
            <div>
              <div className="panel panel-primary" style={{fontSize:'12px'}}>
                <div className="panel-heading">
                  <h3 className="panel-title">Consumers</h3>
                </div>
                <div className="panel-body">
                  <div className="list-group col-xs-5" style={{minHeight:'400px', maxHeight: '400px',  marginBottom: '10px', overflow: 'scroll',  'WebkitOverflowScrolling': 'touch',     padding: '15px, 15px'}}>
                        <a href="#" className="list-group-item active">
                         Data List    {this.renderFaker()}
                        </a>
                         <input type="text" className="form-control" ref="searchString" onChange={this.Search} style={{padding: '15px 15px'}}/>
                         <ConsumersList searchString={this.state.searchString} b_id={this.state.b_id} />
                  </div>
                  <form className="form-horizontal  col-xs-7" role="form"  onSubmit={this.handleSave.bind(this)} style={{minHeight:'400px', maxHeight: '400px',  marginBottom: '10px', overflow: 'scroll',  'WebkitOverflowScrolling': 'touch'}}>
                    <div className="form-group">
                      <label  className="col-sm-3 control-label">Mobile Number</label>
                      <div className="col-sm-9">
                        <input type="text"  ref="mobile" className="form-control" 
                          placeholder="Type business name..." required />
                      </div>
                    </div>
                    <div className="form-group">
                      <label  className="col-sm-3 control-label">First Name</label>
                      <div className="col-sm-9">
                        <input type="text"  ref="firstname" className="form-control" 
                          placeholder="Type business description..." required />
                      </div>
                    </div>
                    <div className="form-group">
                      <label  className="col-sm-3 control-label">Last Name</label>
                      <div className="col-sm-9">
                        <input type="text"  ref="lastname" className="form-control" 
                          placeholder="Type business description..." required />
                      </div>
                    </div>

                    <div className="form-group">
                      <label  className="col-sm-3 control-label">Email</label>
                      <div className="col-sm-9">
                        <input type="email"  ref="email" className="form-control" 
                          placeholder="Type business description..." required />
                      </div>
                    </div>
                      <div className="col-sm-offset-2">
                        <button type="reset" className="btn btn-default">Unset</button>
                      </div>
                      <div className="col-sm-offset-2">
                        <button type="submit" className="btn btn-default">Save</button>
                      </div>
                   
                       {this.renderModal()}
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

  return {
    b_id: props.businessProps.business_id,
  }
}, Consumers);