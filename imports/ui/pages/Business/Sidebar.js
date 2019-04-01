import React, { Component } from 'react';
import { withHistory } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';
import styled from 'styled-components';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import  { withRR4, Nav, NavIcon, NavText } from 'react-sidenav';
import SvgIcon from 'react-icons-kit';

import { ic_aspect_ratio } from 'react-icons-kit/md/ic_aspect_ratio';
import { ic_business } from 'react-icons-kit/md/ic_business';
import { ic_business_center } from 'react-icons-kit/md/ic_business_center';
import { ic_people } from 'react-icons-kit/md/ic_people';
import { ic_textsms } from 'react-icons-kit/md/ic_textsms';
import { rocket } from 'react-icons-kit/fa/rocket';
import {bullhorn} from 'react-icons-kit/fa/bullhorn'
import Dashboard from  './Dashboard';
import Users from  './Users';
import Agents from  './Agents';
import ChatList from  './ChatList';
import { VideoCallServices } from 'meteor/elmarti:video-chat';


import { Department } from '../../../api/Department';
import { Business } from '../../../api/Business';

import 'antd/dist/antd.css'; 
import { Modal, Button } from 'antd';

const confirm = Modal.confirm;
const error = Modal.error;
const info = Modal.info;

const Icon20 = props => <SvgIcon size={props.size || 20} icon={props.icon} />;
const Title = styled.div`
    padding: 12px;
`;
const SideNav = withRR4();

class Sidebar extends Component {
    constructor(props) {
        super(props);
          this.state = {
              onlusers: this.props.onlusers,
              viewChat: false,
              chatUserId:'',
              activeChatUser:'',
              business: this.props.business,
              show: false,
              showChat: false, 
              isLocalMute: false,
              isRemoteMute: false
            };
        this.renderDashboad = this.renderDashboad.bind(this);
        this.viewChat = this.viewChat.bind(this);
        this.sendChat = this.sendChat.bind(this);
        this.agents = '';
        this.departments = '';
        this.renderBusinessname= this.renderBusinessname.bind(this);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.toggleLocalMute = this.toggleLocalMute.bind(this);
        this.toggleRemoteMute = this.toggleRemoteMute.bind(this);
        
        this.renderLocalMute = this.renderLocalMute.bind(this);
        this.renderRemoteMute = this.renderRemoteMute.bind(this);
        VideoCallServices.init({
            iceServers: [
                { url: 'stun:stun.l.google.com:19302' }
            ]
        });
        VideoCallServices.setOnError((err, data) => {
            switch (err.name) {
                case "NotFoundError":
                    error({
                        title: "Could not find webcam",
                        content: "Please ensure a webcam is connected",
                        okText: "OK"
                    });
                    VideoCallServices.endCall();
                    break;
                case "NotAllowedError":
                    error({
                        title: "Not allowed error",
                        content: "Could not access media device",
                        okText: "OK"
                    });
                    VideoCallServices.endCall();
                    break;
                case "NotReadableError":
                    error({
                        title: "Hardware error",
                        content: "Could not access your device.",
                        okText: "OK"
                    });
                    VideoCallServices.endCall();
                    break;
                case "SecurityError":
                    error({
                        title: "Security error",
                        content: "Media support is disabled in this browser.",
                        okText: "OK"
                    });
                    VideoCallServices.endCall();
                    break;
                default:
                    console.log(err, data);
            }
        });
        VideoCallServices.onReceiveCall = (_id) => {
            this.setState({
                showChat: _id,
                show:true
            });
            console.log(_id);
            const { caller, target } = this.refs;
            confirm({
                title: 'You are receiving a call',
                onOk() {
                    VideoCallServices.answerCall({
                        localElement: caller,
                        remoteElement: target,
                        audio: true,
                        video: true
                    });
                },
                okText: "Answer",
                cancelText: "Ignore",
                onCancel() {
                    VideoCallServices.rejectCall();
                },
            });
        };

        VideoCallServices.onTerminateCall = () => {
            Modal.info({
                title: "Call ended",
                okText: "OK"
            });
            this.setState({
                showChat: false,
                show:false,
                isLocalMute: false,
                isRemoteMute: false
            });
        };
        VideoCallServices.onCallRejected = () => {
          Modal.error({
              title: "Call rejected",
              okText: "OK"
          });


          this.setState({
              show:false,
              showChat: false
          });
        };
    }
    componentWillReceiveProps(nextProps){
        this.setState({onlusers: nextProps.onlusers})
      }
    renderBusinessname(){
        return (
         <div>
          Business: {Meteor.user().profile.business_id}
        </div>
    );
  }
    handleClose() {
      VideoCallServices.endCall();
      this.setState({ show: false });
      
    }

    handleShow() {
      this.setState({ show: true});
      let id_callee = this.state.chatUserId;
      console.log(id_callee);
      VideoCallServices.call({
          id: id_callee,
          localElement: this.refs.caller,
          remoteElement: this.refs.target,
          audio: true,
          video: true
      });
    }

    renderDashboad ()  {
        return <Dashboard />;
    }

    sendChat(event){
      event.preventDefault();
      const usersId = this.state.chatUserId; 
      const username = this.state.activeChatUser;  
      Meteor.call('chat.sendMessage', this.refs.outgoingMessage.value,usersId,username, (error)=>{
        if(error){
        console.log(error);
        } else{
          this.refs.outgoingMessage.value = '';
        }
      });
  }


    viewChat(){
        if(this.state.viewChat == true){
            return(
                <div className="popup-box chat-popup popup-box-on" id="qnimate">
                    <div className="popup-head">
                        <div className="popup-head-left pull-left">
                        <img src="https://cdn4.iconfinder.com/data/icons/people-of-business/512/People_Business_man_tie_shirt-512.png" alt="iamgurdeeposahan" /> 
                         {this.state.activeChatUser}
                        </div>
                        <div className="popup-head-right pull-right">
                            <div className="btn-group">
                                <button className="chat-header-button" onClick={this.handleShow} data-toggle="dropdown" type="button" aria-expanded="false">
                                    <i className="glyphicon glyphicon-facetime-video"></i> </button>
  
                            </div>
                            <button data-widget="remove" id="removeClass" className="chat-header-button pull-right" type="button" onClick={this.toggleOnlineUser.bind(this, '', '')}><i className="glyphicon glyphicon-off"></i></button>
                        </div>
                    </div>
                    <div className="popup-messages">
                        <div className="direct-chat-messages">
                            <div className="direct-chat-msg doted-border">
                                <ChatList chatUserId={this.state.chatUserId} />
                            </div>
                        </div>
                    </div>
                    <div className="popup-messages-footer">
                         <form onSubmit={this.sendChat}>
                            <textarea id="status_message" ref="outgoingMessage" placeholder="Type a message..." rows="1" cols="40" name="message" required></textarea>
                            <div className="btn-footer">
                                <button className="bg_none"><i className="glyphicon glyphicon-film"></i> </button>
                                <button className="bg_none"><i className="glyphicon glyphicon-camera"></i> </button>
                                <button className="bg_none"><i className="glyphicon glyphicon-paperclip"></i> </button>
                                <button type="submit" className="bg_none pull-right"><i className="glyphicon glyphicon-send"></i> </button>
                            </div>
                        </form>
                    </div>
                </div>
            );
        }else{
            return <a></a>;
        }

        
    }

    toggleOnlineUser(username, chatUserId){
        this.setState({
            viewChat: !this.state.viewChat,
            activeChatUser: username.username,
            chatUserId: chatUserId._id,
            showChat: chatUserId._id
        });
    }

    toggleLocalMute(){
        VideoCallServices.toggleLocalAudio();
        console.log('local mute');
        this.setState({
            isLocalMute: !this.state.isLocalMute
        });
     
    }

    toggleRemoteMute(){
      VideoCallServices.toggleRemoteAudio();
      console.log('remote mute');
        this.setState({
            isRemoteMute: !this.state.isRemoteMute
        });
        
    }

    renderRemoteMute(){
      if(this.state.isRemoteMute == false){
        return(
             <Button type="primary" onClick={this.toggleRemoteMute} pull-right>
                  Mute
              </Button>
          );
      } else{

        return(              
 
          <Button type="danger" onClick={this.toggleRemoteMute} pull-right>
                  UnMute
          </Button>
          );
      }
    }

    renderLocalMute(){
      if(this.state.isLocalMute == false){
          return(
          
            <Button type="primary" onClick={this.toggleLocalMute}>
              Mute
            </Button>
          );
      } else{
        return(      

            <Button type="danger" onClick={this.toggleLocalMute}>
              UnMute
            </Button>
          );
      }
    }


    render(){     
      return(
       <Router>
            <div>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <div className="col-xs-3" style={{background: '#2c3e50', color: '#FFF', width: '220',minHeight:'900px', maxHeight: '900px'}}>
                        <SideNav  highlightBgColor="#00bcd4" defaultSelected="dashboard">
                            <Title> 
                            {this.renderBusinessname()}
                            </Title>
                            <Nav id="dashboard">
                                <NavIcon><Icon20 icon={ic_aspect_ratio} /></NavIcon>
                                <NavText> Dashboard </NavText>
                            </Nav>
                        </SideNav>
                    </div>
                    <div className="container">
                        <Route exact path="/" render={this.renderDashboad}/>
                    </div>
                    <div className="col-sm-2">          
                        <SideNav  highlightBgColor="#00bcd4" className="pull-right">
                            <ul className="nav tabs">
                                <li className="active"><a href="#tab1" data-toggle="tab"><h4>Online Users</h4></a></li>
                                {this.state.onlusers.map(onlUsers => {
                                      const {username, _id} = onlUsers;
                                      return(
                                        <li className="user">
                                            <a key={_id} onClick={this.toggleOnlineUser.bind(this, {username}, {_id})}>{username}</a>
                                        </li>
                                    );
                                  })}
                            </ul>
                        </SideNav>
                    </div>
                </div>
                <Modal
                title="Modal"
                visible={this.state.show}
                onOk={this.handleClose}
                okText="End Call"
                >
                        <h4>You</h4>
                          <video width="300" height="200" ref="caller"></video>
                          {this.renderLocalMute()}
                        <hr />
                        <h4>{this.state.activeChatUser}</h4>
                          <video width="300" height="200" ref="target"></video>
                          {this.renderRemoteMute()}
                </Modal>

                {this.viewChat()}
            </div>
        </Router>

      );
    }

}


export default createContainer(props =>{
  Meteor.subscribe("onlusers");
  Meteor.subscribe('business', {_id:Meteor.user().profile.business_id}, {});
  Meteor.subscribe('department', {business_id:Meteor.user().profile.business_id}, {sort:{name: 1}});
  console.log(Meteor.user().profile.business_id);
  return {
    business:  Business.find({_id:Meteor.user().profile.business_id}).fetch(),
    business_users: Meteor.user().profile,
    onlusers: Meteor.users.find({"status.online":true,_id:{$ne:Meteor.userId()}}), 
    department:Department.find( {business_id:Meteor.user().profile.business_id}, {sort:{name: 1}}).fetch(),
  };
}, Sidebar);



