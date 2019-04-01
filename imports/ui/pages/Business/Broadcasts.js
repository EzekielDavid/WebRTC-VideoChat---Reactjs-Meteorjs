import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Business} from '../../../api/Business';
import { Department } from '../../../api/Department';
import { Group_Consumer } from '../../../api/Consumer';
import { Tabs, Tab, TabContainer, TabContent, TabPane } from 'react-bootstrap';
import Select from 'react-select';
import { Async } from 'react-select';
import fetch from 'isomorphic-fetch';
import ConsumerInteractList from './ConsumerInteractList';
import GroupConList from './GroupConList';
 class Broadcasts extends Component {
  constructor(props){
    super(props);
    this.handleSelect = this.handleSelect.bind(this);
    this.renderConsumerSel = this.renderConsumerSel.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.Search = this.Search.bind(this);
    this.saveGroup = this.saveGroup.bind(this);
    this.addConsumer = this.addConsumer.bind(this);
    this.broadcast = this.broadcast.bind(this);
    this.state = {
      key: 1,
      searchString: 'A',
      group: [],
      groupConId: ''
    };

  }
  handleSelectChange (selectedOption) {
    console.log('You\'ve selected:', value);
    this.setState({ selectedOption });
    if (selectedOption) {
      console.log(`Selected: ${selectedOption.label}`);
    }
  }
    componentWillMount(){
    Session.set('messageLimit', 5);
    Session.set('consumersLimit', 5);   
  }

  broadcast(event){
    event.preventDefault();
    if(this.state.groupConId != ''){
      Meteor.call('broadcast.sendMessage',this.refs.broadmessage.value, this.state.groupConId, (error)=>{
        if(error){
        console.log(error);
        } else{
          alert('success');
          this.refs.broadmessage.value = '';
        }
      });
    } else{
      alert('Please select group first');
    }
  }

  Search(){
    this.setState({
        searchString: this.refs.searchString.value,
      });
  }
  saveGroup(event){

    event.preventDefault();
    console.log(this.state.group);
    if(this.state.group.length > 0){
      console.log('save');
      Meteor.call('groupCon.add',this.refs.groupname.value, this.props.b_id, this.state.group, (error)=>{
        if(error){
        console.log('error');
        } 
        else{
          alert('success');
          this.refs.groupname.value = '';
          this.setState({ group: [] })
        }
    });
    }
    else{
      alert('add member first');
    }
  }
  addConsumer(_id, mobiles, firstname, lastname, b_id){
    var b_id = b_id.business_id;
    var _id = _id._id;
    var mobiles = mobiles.mobiles;
    var firstname = firstname.firstname;
    var lastname = lastname.lastname;
    var joined = this.state.group.concat({_id, mobiles, firstname, lastname, b_id });
    this.setState({ group: joined })
    alert('consumer added');
    console.log(joined);
  }


 removeSelectedConsumer(key) {
  var index = key.i - 1;
  console.log(index);
  var array = this.state.group.splice(index,1); // make a separate copy of the array
  this.setState({group: array});
  }


  renderGroupList(){
    return (
        <div>
          <div>
            {this.props.group_consumer.map(Group_Consumer => {
              const {_id,name} = Group_Consumer;
              return(
                <li key={_id} className="list-group-item" style={{padding: '15px 15px', textAlign: 'left'}} >
                  {name} <a onClick={this.setGroup.bind(this, {_id})}className="glyphicon glyphicon-plus pull-right "/>
               </li>
              );
            })}
          </div>
        </div>
      );
  }

  setGroup(id){
    var id = id._id;

    this.setState({ groupConId: id });

  }



  renderConsumerSel(i){
    var i = 0;
    return (
        <div>
          <div>
          <b>Added to Group:</b>
            {this.state.group.map(Group => {
              console.log('cg' + i);
              const {_id, firstname, lastname, mobiles} = Group;
                i++;
              return(
                <span key={_id} onClick={this.removeSelectedConsumer.bind(this, {i} )} className="list-group-item" style={{padding: '15px 15px', textAlign: 'left'}} >
                  {firstname} {lastname} 
                <a className="glyphicon glyphicon-remove pull-right "/><br /><i>{mobiles}</i> </span>
              );
            })}
          </div>
        </div>
      );
  }

 handleSelect(key) {
    this.setState({ key });
  }

 
  render(){

    return (
      <Tabs
        activeKey={this.state.key}
        onSelect={this.handleSelect}
        id="controlled-tab-example"
      >
        <Tab eventKey={1} title="COMPOSE">
                      <div>
                          <div>
                            <div className="panel panel-primary" style={{fontSize:'12px'}}>
                              <div className="panel-heading">
                                <h3 className="panel-title">Compose</h3>
                              </div>
                              <div className="panel-body">
                                <div className="list-group col-xs-5" style={{minHeight:'400px', maxHeight: '400px',  marginBottom: '10px', overflow: 'scroll',  'WebkitOverflowScrolling': 'touch',     padding: '15px, 15px'}}>
                                      <a href="#" className="list-group-item active">
                                       Group List
                                      </a>

                                       {this.renderGroupList()}
                                </div>
                                <form className="form-horizontal  col-xs-7" onSubmit={this.broadcast} role="form"  style={{minHeight:'400px', maxHeight: '400px',  marginBottom: '10px', overflow: 'scroll',  'WebkitOverflowScrolling': 'touch'}}>
                                  <div className="form-group">
                                    <label  className="col-sm-3 control-label">Message</label>
                                    <div className="col-sm-9">
                                      <textarea type="text"  ref="broadmessage" rows="5" className="form-control" 
                                        placeholder="Type your message here..." required />
                                    </div>
                                  </div>

                                  <GroupConList gc_id={this.state.groupConId} />
                                </form>

                              </div>
                            </div>
                          </div>
                      </div>
        </Tab>
        <Tab eventKey={2} title="CREATE GROUP">
                      <div>
                          <div>
                            <div className="panel panel-primary" style={{fontSize:'12px'}}>
                              <div className="panel-heading">
                                <h3 className="panel-title">New</h3>
                              </div>
                              <div className="panel-body">
                                <div className="list-group col-xs-5" style={{minHeight:'400px', maxHeight: '400px',  marginBottom: '10px', overflow: 'scroll',  'WebkitOverflowScrolling': 'touch',     padding: '15px, 15px'}}>
                                      <a href="#" className="list-group-item active">
                                       Group List
                                      </a>
                                      
                                      {this.renderGroupList()}
                                </div>
                                 <form className="form-horizontal  col-xs-7" role="form"  onSubmit={this.saveGroup.bind(this)}  style={{minHeight:'400px', maxHeight: '400px',  marginBottom: '10px', overflow: 'scroll',  'WebkitOverflowScrolling': 'touch'}}>
                                  <div className="form-group">
                                    <label  className="col-sm-3 control-label">groupname</label>
                                    <div className="col-sm-9">
                                      <input type="text"  ref="groupname"  className="form-control" 
                                        placeholder="Type your message here..." required />
                                    </div>
                                  </div>        
                                  <div className="form-group">
                                      <label  className="col-sm-3 control-label">Consumers</label>
                                      <div className="col-sm-9">
                                        <input type="text" placeholder="search..." className="form-control" ref="searchString" onChange={this.Search} style={{padding: '15px 15px'}}/>
                                        <ConsumerInteractList searchString={this.state.searchString} b_id={this.props.b_id} onCheckRoom={this.addConsumer}/>
                                              <br />
                                        {this.renderConsumerSel()}
                                      </div>
                                  </div>
                                  <br />
                                  <div className="col-sm-offset-2">
                                      <button type="reset" className="btn btn-default">Unset</button>
                                  </div>
                                  <div className="col-sm-offset-2">
                                    <button  type="submit" className="btn btn-default">Save</button>
                                  </div>
                        
                                </form>

                              </div>
                            </div>
                          </div>
                      </div>
        </Tab>
      </Tabs>
    );
  }
}


export default createContainer(props => {
  Meteor.subscribe('group_consumers',{business_id:props.businessProps.business_id},{sort:{name:1}});
  return {
    group_consumer: Group_Consumer.find({business_id:props.businessProps.business_id}).fetch(),
    b_id: props.businessProps.business_id, 
  }
}, Broadcasts)



