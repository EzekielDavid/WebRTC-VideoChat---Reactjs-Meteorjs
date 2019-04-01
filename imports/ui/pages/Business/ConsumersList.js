import React, { Component } from 'react';
import { withHistory, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Consumer } from '../../../api/Consumer';
 class ConsumersList extends Component {
  constructor(props){
    super(props);
    this.state = {
      consumers: this.props.consumers,
    };
    this.loadMore= this.loadMore.bind(this);
  }

  componentWillReceiveProps(nextProps){
    this.setState({consumersList: nextProps.consumers})
  }

  
  componentWillMount(){
    Session.set('consumersLM', 5);   
  }

  componentWillUnmount(){
    delete Session.keys['consumersLM'];
  }

  loadMore(){
    var currentLimit = Session.get("consumersLM");
    var currentLimit = currentLimit + 100;
    Session.set('consumersLM',currentLimit);   
    console.log(Session.get("consumersLM"));
  }

  render(){
        return (
      <div>
        <div>
          {this.props.consumers.map(Consumer => {
            const {_id, firstname, lastname, mobiles} = Consumer;
            return(
              <li key={_id} className="list-group-item" style={{padding: '15px 15px', textAlign: 'left'}}>
                {firstname} {lastname} 
              <a className="glyphicon glyphicon-edit pull-right "/><br /><i>{mobiles}</i> </li>
            );
          })}
        </div>
        <div className="form-control">
          <a onClick={this.loadMore} style={{paddingLeft:'50%'}}>load more...</a>
        </div>
      </div>
    );
  }
}


export default createContainer(props =>{
  const limit = Session.get("consumersLM");
    var subscriptions = new SubsManager();
  Meteor.subscribe('consumers',
     { $and: [ {'firstname': {$regex: ".*" + props.searchString + ".*"}}, {business_id:props.b_id} ] },
     {sort:{firstname: 1}, limit:limit},
  );
  return { 
  consumers: Consumer.find({ $and: [ {'firstname': {$regex: ".*" + props.searchString + ".*"}}, {business_id:props.b_id} ] }, {sort:{firstname: 1}, limit:limit}).fetch(),
 }
}, ConsumersList);
