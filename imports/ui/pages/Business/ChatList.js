import React, { Component } from 'react';
import { withHistory, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { ChatUsers } from '../../../api/Messages';
import { Business } from '../../../api/Business';
import  Timestamp  from 'react-timestamp';
 class ChatList extends Component {
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
    console.log(session.get("messageLimit"));
  }
  renderLoadMore(){
    if(this.state.messages){
      return(<a onClick={this.loadMore} style={{paddingLeft:'35%'}}>load more...</a>);
    } else {
      return (
        <a></a> 
        );
    }
    
  }

  render(){
    return (
      <div>
        
        <div>
          {this.state.messages.map(ChatUsers => {

             const {owner, userId,toSendUsername, text, createdAt, tokensms} = ChatUsers;
                  if(owner == Meteor.userId()){
                            return(
                                    <article  key={tokensms}>
                                        <div className="direct-chat-info clearfix">
                                          <span className="direct-chat-name pull-left">You</span>
                                        </div>
                                        <img alt="iamgurdeeposahan" src="https://cdn4.iconfinder.com/data/icons/people-of-business/512/People_Business_man_jacket_name_tag-512.png" className="direct-chat-img" />
                                        <div className="direct-chat-text">
                                            {text}
                                        </div>
                                        <div className="direct-chat-info clearfix">
                                            <span className="direct-chat-timestamp pull-right"><Timestamp time={createdAt} format='time'/></span>
                                        </div>
                                    </article>
                                );
                              }
                    else{
                             return(
                                    <article key={tokensms}>
                                      <div className="direct-chat-info clearfix">
                                            <span className="direct-chat-name pull-left">{toSendUsername}</span>
                                        </div>
                                        <img alt="iamgurdeeposahan" src="https://cdn4.iconfinder.com/data/icons/people-of-business/512/People_Business_man_tie_shirt-512.png" className="direct-chat-img" />
                                        <div className="direct-chat-text">
                                          {text}
                                        </div>
                                        <div className="direct-chat-info clearfix">
                                            <span className="direct-chat-timestamp pull-right"><Timestamp time={createdAt} format='time'/></span>
                                        </div>
                                    </article>
                                );
                      }
          })}
        </div>
      </div>
    );
  }
}


export default createContainer(props =>{
  var limit = Session.get("messageLimit");
  Meteor.subscribe('chatusers',
     {chatIds:{$all:[props.chatUserId, Meteor.userId()]}},
     {sort: {createdAt: -1}, limit:100} // temporary 100
  );

  return { 
    messages: ChatUsers.find( {chatIds:{$all:[props.chatUserId, Meteor.userId()]}}, {sort:{createdAt: 1}},{limit:100}).fetch(),
  };
}, ChatList);


