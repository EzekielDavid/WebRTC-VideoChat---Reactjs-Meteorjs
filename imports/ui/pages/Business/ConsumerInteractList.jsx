import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { withHistory, Link } from 'react-router-dom';
import  Timestamp  from 'react-timestamp';
import { Business} from '../../../api/Business';
import { Consumer } from '../../../api/Consumer';
import { Interaction } from '../../../api/Interaction';


 class CosumerInteractList extends Component {
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

  loadMore(){
    var currentLimit = Session.get("consumersLimit");
    var currentLimit = currentLimit + 100;
    Session.set('consumersLimit',currentLimit);   
    console.log(Session.get("consumersLimit"));
  }

  render(){
    return (
      <div>
        <div>
            {this.props.consumers.map(Consumer => {
              const {_id, firstname, lastname, mobiles, business_id} = Consumer;
              return(
                <li key={_id} className="list-group-item" style={{padding: '15px 15px', textAlign: 'left'}}>
                  {firstname} {lastname} 
                   <a className="glyphicon glyphicon-eye-open pull-right " onClick={this.props.onCheckRoom.bind(this, {_id},{mobiles},{firstname}, {lastname}, {business_id})}/>
                   <br /><i>{mobiles}</i>
                </li>
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

export default createContainer(props => {
  const limit = Session.get("consumersLimit");
  var subscriptions = new SubsManager({
    cacheLimit: 10,
    expireIn: 5
});
  Meteor.subscribe('consumers',
     { $and: [ {'firstname': {$regex: ".*" + props.searchString + ".*"}}, {business_id:props.b_id} ] },
     {sort:{firstname: 1}, limit:limit},
  );

  return {
     consumers: Consumer.find({ $and: [ {'firstname': {$regex: ".*" + props.searchString + ".*"}}, {business_id:props.b_id} ] }, {sort:{firstname: 1}, limit:limit}).fetch(),
 }
}, CosumerInteractList);