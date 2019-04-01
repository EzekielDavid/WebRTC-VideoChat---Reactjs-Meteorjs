import React, { Component } from 'react';
import { withHistory, Link } from 'react-router-dom';
import { Panel } from 'react-bootstrap';
import PropTypes from 'prop-types';

import Sidebar from './Sidebar';



export default class MainPage extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: ''
    };
  }

  render(){
    let currentUser = this.props.currentUser;
    let userDataAvailable = (currentUser !== undefined);
    let loggedIn = (currentUser && userDataAvailable);
    return (
      <div>
       <Sidebar />
      </div>
    );
  }
}

MainPage.propTypes = {
  username: PropTypes.string
}