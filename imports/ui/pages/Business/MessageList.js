import React, { Component } from 'react';
import { withHistory, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Messages } from '../../../api/Messages';
import { Business } from '../../../api/Business';
import  Timestamp  from 'react-timestamp';
import './css/timeline.css';
 class ConsumersList extends Component {
  constructor(props){
    super(props);
    this.state = {
      messages: this.props.messages,
    };
    this.loadMore= this.loadMore.bind(this);
    this.renderLoadMore= this.renderLoadMore.bind(this);
  }

  componentWillReceiveProps(nextProps){
    this.setState({messages: nextProps.messages})
  }
  componentWillUnmount(){
    delete Session.keys['messageLimit'];
  }
  loadMore(){

    var currentLimit = Session.get("messageLimit");
    var currentLimit = currentLimit + 100;
    Session.set('messageLimit',currentLimit);   
  }
  renderLoadMore(){
  
      return(      
      <div className="form-control">
        <a onClick={this.loadMore} style={{paddingLeft:'50%'}}>load more...</a>
      </div>
      );

    
  }

  render(){
  if(this.state.messages != ''){
    return (
      <div>
        <div>
          {this.renderLoadMore()}
        </div>
        <div>
          {this.state.messages.map(Messages => {

             const {sender, text, createdAt, tokensms} = Messages;
                  if(sender == Meteor.userId()){
                            return(
                                    <article className="timeline-entry" key={tokensms}>
                                          <div className="timeline-entry-inner">
                                            <time className="timeline-time" dateTime="2014-01-10T03:45"><span><Timestamp time={createdAt} format='time'/></span> <span><Timestamp time={createdAt} format='date'/></span></time>
                                            <div className="timeline-icon bg-success">
                                              <i className="entypo-feather"></i>
                                            </div>
                                            <div className="timeline-label">
                                              <h2><a href="#">You</a></h2>
                                              <p>{text}</p>
                                            </div>
                                          </div>
                                    </article>
                                );
                              }
                    else{
                             return(
                                  <article className="timeline-entry left-aligned" key={tokensms}>
                                    <div className="timeline-entry-inner">
                                      <time className="timeline-time" dateTime="2014-01-10T03:45"><span><Timestamp time={createdAt} format='time'/></span><span><Timestamp time={createdAt} format='date'/></span></time>
                                          <div className="timeline-icon bg-secondary">
                                            <i className="entypo-suitcase"></i>
                                          </div>
                                          <div className="timeline-label">
                                            <h2><a href="#">{sender}</a></h2>
                                            <p>{text}</p>
                                          </div>
                                        </div>
                                      </article>
                                );
                      }
          })}

          <article className="timeline-entry begin">
            <div className="timeline-entry-inner">
                <div className="timeline-icon" style={{WebkitTransform: 'rotate(-90deg)', MozTransform: 'rotate(-90deg)'}}>
                    <i className="entypo-flight"></i>
                </div>              
            </div>  
          </article>
        </div>
      </div>
    );
  } else {
      return (
        <a></a> 
        );
    }
  }
}


export default createContainer(props =>{
  var limit = Session.get("messageLimit");
  Meteor.subscribe('messages',
     {
      $and: [ {'consumers_id': props.propsConsumers_id}, {business_id:props.propsBusiness_id} ] 
     },
     {sort: {createdAt: -1}, limit:limit}
  );

  return { 
    messages: Messages.find( {'consumers_id': props.propsConsumers_id}, {sort:{createdAt: 1}},{limit:limit}).fetch(),
    countMessage: Counts.get('messCount'),
  };
}, ConsumersList);


