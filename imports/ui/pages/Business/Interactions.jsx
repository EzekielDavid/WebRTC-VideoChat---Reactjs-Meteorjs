import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { withHistory, Link } from 'react-router-dom';
import  Timestamp  from 'react-timestamp';
import  InteractionList from './InteractionList';
import { Business} from '../../../api/Business';
import { Consumer } from '../../../api/Consumer';
import { Interaction } from '../../../api/Interaction';
import './css/timeline.css';

 class Interactions extends Component {
  constructor(props){
    super(props);
    this.state = {
      haveRoom:false,
      convoIsVisible: false,
      searchString: '',
      b_id:this.props.b_id,
    };
    this.consumerId = '';
    this.consumerName = '';
    this.consumerNo = '';
    this.roomId = '';

    this.Search= this.Search.bind(this);
    this.renderConvHistory = this.renderConvHistory.bind(this);
    this.renderConversation = this.renderConversation.bind(this);
    this.checkRoom = this.checkRoom.bind(this);
    this.sendSms = this.sendSms.bind(this);
  }


  // componentDidMount() {
  //       let rowConv = document.getElementById("row-conv");
  //       rowConv.scrollTop = rowConv.scrollHeight;
  //   }


  // handleOpen ()  {
  //       this.setState({ open: true });
  //       // hack
  //       setTimeout(() => {
  //           let rowConv = document.getElementById("row-conv");
  //           if (rowConv !== null) {
  //               rowConv.scrollTop = rowConv.scrollHeight;
  //           }
  //       }, 100);
  //   };

  checkRoom(consumersId, mobiles, consumerFirstName, consumerLastName){
    var res = '';
    var b_id = this.props.b_id;
    this.consumerId = consumersId._id;
    this.mobiles = mobiles.mobiles;
    this.consumerName = consumerFirstName.firstname+' '+consumerLastName.lastname;
   
     Meteor.call('interact.find', consumersId._id, b_id, function(error, result) {
      if(error){
        console.log(error);
      }else
      {
        console.log(result);

          if(result){
            Session.set("roomid", result);
            console.log(result);
          }
          else{
            Meteor.call('interact.new', consumersId._id, b_id, function(error, res){
                 if(error){
                    console.log(error);
                  }else
                  {
                     Session.set("roomid", res);
                     console.log(res);
                  }
            });
          }
      }
    });    
    this.setState({
        convoIsVisible: true
      });

    setTimeout(() => {
      let rowConv = document.getElementById("row-conv");
            rowConv.scrollTop = rowConv.scrollHeight;

      }, 100);
    
  }

    sendSms(event){
      event.preventDefault();
 
      var consumersId = this.consumerId; 
      var mobiles = this.mobiles;
      var roomId = Session.get("roomid");
      Meteor.call('interact.sendMessage', this.refs.outgoingMessage.value,consumersId,mobiles,roomId, (error)=>{
        if(error){
        console.log(error);
        } else{
          alert('success');
          this.refs.outgoingMessage.value = '';
        }
      });
  }
  renderConvHistory(){
          return this.props.messages.map(Convo => {
             const {_id, messages} = Convo;
            return (
              <div>
                {messages.map(Messages => {
                 const {to, sender, text, createdAt, tokensms} = Messages;
                  if(sender == Meteor.userId()){
                            return(
                                    <article className="timeline-entry" key={tokensms}>
                                          <div className="timeline-entry-inner">
                                            <time className="timeline-time" dateTime="2014-01-10T03:45"><span><Timestamp time={createdAt} format='time'/></span> <span>Today</span></time>
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
                                  <article className="timeline-entry left-aligned" key={_id}>
                                    <div className="timeline-entry-inner">
                                      <time className="timeline-time" dateTime="2014-01-10T03:45"><span></span> <span>Today</span></time>
                                          <div className="timeline-icon bg-secondary">
                                            <i className="entypo-suitcase"></i>
                                          </div>
                                          <div className="timeline-label">
                                            <p>{text}</p>
                                          </div>
                                        </div>
                                      </article>
                                );
                      }
                  }
              )}
              </div>
              )
          });
    }


  renderConversation(){
    if(this.state.convoIsVisible){
     return(
            <div className="container col-md-9" style={{float:'left'}}>
              <div className="panel panel-primary" >
                <div className="panel-heading">
                  <h3 className="panel-title">{this.consumerName}</h3>
                </div>
                <div className="panel-body">
                      <div >
                        <div id="row-conv" className="row" style={{minHeight:'600px', maxHeight: '600px',  marginBottom: '10px', overflow: 'scroll',  'WebkitOverflowScrolling': 'touch'}}>
                          <div className="timeline-centered">
                              {this.renderConvHistory()}
                              <article className="timeline-entry begin">
                              
                                <div className="timeline-entry-inner">
                                  
                                  <div className="timeline-icon" style={{WebkitTransform: 'rotate(-90deg)', MozTransform: 'rotate(-90deg)'}}>
                                    <i className="entypo-flight"></i>
                                  </div>
                                  
                                </div>  
                              </article>
                          </div>
                          <form onSubmit={this.sendSms}>
                              <div className="input-group col-md-12" style={{paddingLeft:'1%'}}>
                                  <input id="btn-input" type="text" className="form-control input-sm message" ref="outgoingMessage" placeholder="Type your message here..." required/>
                                  <span className="input-group-btn">
                                    <button type="submit" className="btn btn-warning btn-sm" id="btn-chat">
                                      Send
                                    </button>
                                </span>
                              </div>
                          </form>
                        </div>
                      </div>
                
                </div>
              </div>
            </div>

      );
    } else{
      return(<a></a>);
    }

  }

    Search(){
    
             this.setState({
              searchString: this.refs.searchString.value,
            });
  }


  render(){
    return (
      <div >
         <div className="list-group col-xs-3" style={{minHeight:'600px', maxHeight: '600px',  marginBottom: '10px', overflow: 'scroll',  'WebkitOverflowScrolling': 'touch'}}>
            <a  className="list-group-item active">
                Contacts 
            </a>
           <input type="text" className="form-control" ref="searchString" onChange={this.Search} style={{padding: '15px 15px'}}/>
           <InteractionList searchString={this.state.searchString} b_id={this.state.b_id} onCheckRoom={this.checkRoom} />
        </div>
        {this.renderConversation()}
      </div>
        
    );
  }
}

export default createContainer(props => {
  Meteor.subscribe('consumersBusiness');
  Meteor.subscribe('interaction', {_id: Session.get("roomid")});
  return {
    consumers: Consumer.find({business_id:props.businessProps.business_id}).fetch(),
    b_id: props.businessProps.business_id,
    interaction: Interaction.find({}).fetch(),
    messages: Interaction.find({_id: Session.get("roomid")}),
  }
}, Interactions);