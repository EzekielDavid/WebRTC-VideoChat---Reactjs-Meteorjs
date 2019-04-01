import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import './css/timeline.css';
import { Interaction } from '../../../api/Interaction';
class Timeline extends Component {
  constructor(props){
    super(props);
  }

  render(){
  	if(this.props.messages){
  		    return this.props.messages.map(Convo => {
  		    	 const {_id, messages} = Convo;
  		    	return (
  		    		<div>
	  		    		{messages.map(Messages => {
	  		    		 const {to, sender, text, createdAt} = Messages;
							if(sender == Meteor.userId()){
					              return(
					                          <article key={_id} className="timeline-entry">
					                                <div className="timeline-entry-inner">
					                                  <time className="timeline-time" dateTime="2014-01-10T03:45"><span>03:45 AM</span> <span>Today</span></time>
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
	  		    		} )}
	  		    	</div>
  		    		)

  		    }
			     
			);
  	} else{
  		return <a>No Messages</a>	
  	}

  }
}

export default createContainer(props => {
  Meteor.subscribe('consumers');
  Meteor.subscribe('interaction');
  var result = Interaction.find({_id:Session.get("roomid")});
  // var messages = result[0].messages;
  return {
    messages: Interaction.find({_id:props.roomId}),
  }
}, Timeline);
