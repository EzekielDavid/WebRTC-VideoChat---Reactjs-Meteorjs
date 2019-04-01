import React, { Component } from 'react';
import { withHistory, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Consumer } from '../../../api/Consumer';
import { Group_Consumer } from '../../../api/Consumer';
 class ConsumersList extends Component {
  constructor(props){
    super(props);
    this.state = {
      group_consumers: this.props.group_consumers,
    };
  }

  componentWillReceiveProps(nextProps){
    this.setState({group_consumers: nextProps.group_consumers})
  }

  
  componentWillMount(){
    Session.set('consumersLM', 5);   
  }

  componentWillUnmount(){
    delete Session.keys['consumersLM'];
  }



  render(){
    return(
      <div>
       <b>RECIPIENT</b>
        {this.props.group_consumers.map(Consumers => {
            const {_id, members} = Consumers;
            return (
              <div>
                {members.map(Members => {
                 const {firstname, lastname, mobiles} = Members;
                            return(
                              <span key={_id} className="list-group-item" style={{padding: '15px 15px', textAlign: 'left'}} >
                                  {firstname} {lastname} <a className="glyphicon glyphicon-plus pull-right "/>
                                  <br /><i>{mobiles}</i>
                               </span>
                                );
                  }
              )}
                        <div className="col-sm-offset-2">
                                      <button type="reset" className="btn btn-default">Unset</button>
                                    </div>
                                    <div className="col-sm-offset-2">
                                      <button type="submit" className="btn btn-default">Send</button>
                                    </div>
              </div>
              )
          })}
      </div>
      );   
    }
}


export default createContainer(props =>{
  Meteor.subscribe('group_consumers',
     {_id:props.gc_id},
     {sort:{name: 1}, limit:1},
  );
  return { 
  group_consumers: Group_Consumer.find({_id:props.gc_id}, {sort:{name: 1}, limit:1}).fetch(),
 }
}, ConsumersList);
