import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { withHistory, Link } from 'react-router-dom';
import  ConsumerInteractList from './ConsumerInteractList';
import  MessageList from './MessageList';
import { Business} from '../../../api/Business';
import { Consumer } from '../../../api/Consumer';
import { Interaction } from '../../../api/Interaction';
import Modal from '../../components/Modal';

 class Message extends Component {
  constructor(props){
    super(props);
    this.state = {
      haveRoom:false,
      convoIsVisible: false,
      searchString: 'A',
      isOpen: false,

    };
    this.consumerId = '';
    this.consumerName = '';
    this.consumerNo = '';
    this.roomId = '';
    this.Search= this.Search.bind(this);
    this.renderMessageHistory = this.renderMessageHistory.bind(this);
    this.checkRoom = this.checkRoom.bind(this);
    this.sendSms = this.sendSms.bind(this);
    this.initFaker= this.initFaker.bind(this);
    this.toggleModal= this.toggleModal.bind(this);
    this.renderModal= this.renderModal.bind(this);
    this.renderUsername= this.renderUsername.bind(this);
  }

    toggleModal() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
    renderUsername(){
        return (
         <li>
          {this.props.currentUser.map(User => {
            const {username} = User;
            return(
          
                      <a>User: {username}</a>
                 
 
            );
          })}
        </li>
    );
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
  componentWillMount(){
    Session.set('messageLimit', 5);
    Session.set('consumersLimit', 5);   
  }


  //get Consumers Id -> proc messages
  checkRoom(consumersId, mobiles, consumerFirstName, consumerLastName, business_id){
    var res = '';
    var b_id = this.props.b_id;
    this.consumerId = consumersId._id;
    this.mobiles = mobiles.mobiles;
    this.consumerName = consumerFirstName.firstname+' '+consumerLastName.lastname;

    this.setState({
        convoIsVisible: true
      });

    Session.set('messageLimit', 5);   

    // setTimeout(() => {
    //   let rowConv = document.getElementById("row-conv");
    //         rowConv.scrollTop = rowConv.scrollHeight;

    //   }, 100);
    
  }

   sendSms(event){
      event.preventDefault();
 
      const consumersId = this.consumerId; 
      const mobiles = this.mobiles;
      const business_id = this.props.b_id;

      Meteor.call('interact.sendMessage', this.refs.outgoingMessage.value,consumersId,mobiles,business_id, (error)=>{
        if(error){
        console.log(error);
        } else{
          alert('success');
          this.refs.outgoingMessage.value = '';
        }
      });
  }

  renderMessageHistory(){
    if(this.state.convoIsVisible){
     return(
            <div className="container col-md-9" style={{float:'left'}}>
              <div className="panel panel-primary" >
                <div className="panel-heading">
                  <h3 className="panel-title">{this.consumerName} {this.renderFaker()}</h3>
                </div>
                <div className="panel-body">
                      <div >
                        <div id="row-conv" className="row" style={{minHeight:'600px', maxHeight: '600px',  marginBottom: '10px', overflow: 'scroll',  'WebkitOverflowScrolling': 'touch'}}>
                          <div className="timeline-centered">
                              <MessageList propsBusiness_id={this.props.b_id} propsConsumers_id={this.consumerId} />
    
                          </div>
                        </div>
                          <form onSubmit={this.sendSms}>
                              <div className="input-group col-md-12" style={{paddingLeft:'1%'}}>
                                  <input id="btn-input" type="text" className="form-control input-sm" ref="outgoingMessage" placeholder="Type your message here..." required/>
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

      );
    } else{
      return(<a></a>);
    }

  }

  renderFaker(){
    return (

        <button onClick={this.initFaker} className="btn btn-warning" >Faker!</button>
 
    );
  }

  initFaker(event){
    event.preventDefault();
    this.setState({
        isOpen: !this.state.isOpen
    });
    Meteor.call('faker.Messages', this.props.b_id,this.consumerId,this.consumerName, (error)=>{
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
           <ConsumerInteractList searchString={this.state.searchString} b_id={this.props.b_id} onCheckRoom={this.checkRoom} />
        </div>
            {this.renderModal()}
            {this.renderMessageHistory()}
           
      </div>
        
    );
  }
}

export default createContainer(props => {
  return {
    b_id: props.businessProps.business_id
  }
}, Message);