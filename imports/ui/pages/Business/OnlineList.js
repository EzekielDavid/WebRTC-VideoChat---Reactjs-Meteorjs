import React, { Component } from 'react';
import { withHistory } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';
import styled from 'styled-components';
import SvgIcon from 'react-icons-kit';
import {bullhorn} from 'react-icons-kit/fa/bullhorn'

import Poundcodes from  './Poundcodes';
import Departments from  './Departments';
import Broadcasts from  './Broadcasts';

import { Business_Users } from '../../../api/Business';
import { Business } from '../../../api/Business';

class OnlineList extends Component {
    constructor(props) {
        super(props);
          this.state = {
              onlusers: this.props.onlusers,
            };

    }
    componentWillReceiveProps(nextProps){
        this.setState({onlusers: nextProps.onlusers})
      }


    render(){    
      return(

                    <div>          

                                {this.props.onlusers.map(onlUsers => {
                                      const {username, _id} = onlUsers;
                                      return(
                                        <li className="user">
                                            <a key={_id} onClick={this.props.toggleOnlineUser.bind(this, {username}, {_id})}>{username}</a>
                                        </li>
                                    );
                                  })}
                    </div>
         
   
      );
    }

}


export default createContainer(props =>{
  Meteor.subscribe("onlusers");

  return {
    onlusers: Meteor.users.find({"status.online":true, '_id':{$ne:Meteor.userId()}}), 
  };
}, OnlineList);

