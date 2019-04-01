import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { withHistory, Link } from 'react-router-dom';
import { Panel, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
class Dashboard extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: ''
    };
  }

  render(){
    return (
        <div >
             <Row className="show-grid">
              <Col xs={6} md={4}>
                <Panel  bsStyle="primary">
                  <Panel.Heading>Number of Consumers</Panel.Heading>
                  <Panel.Body>{this.props.conCount}</Panel.Body>
                </Panel>
              </Col>
              <Col xs={6} md={4}>
                <Panel  bsStyle="success">
                  <Panel.Heading>Total Messages</Panel.Heading>
                  <Panel.Body>{this.props.countMessage}</Panel.Body>
                </Panel>
              </Col>
              <Col xsHidden md={4}>
               <Panel  bsStyle="info">
                  <Panel.Heading>Statistic Reports</Panel.Heading>
                  <Panel.Body>Dashboard content</Panel.Body>
                </Panel>
              </Col>
            </Row>
            <div>
              <Panel>
                <Panel.Heading>Statistic Reports</Panel.Heading>
                <Panel.Body>Dashboard content</Panel.Body>
              </Panel>
            </div>
        </div>
    );
  }
}

Dashboard.propTypes = {
  username: PropTypes.string
}

export default createContainer(props =>{
  
  Meteor.subscribe('dashboard');
  return {
  

    onlusers: Meteor.users.find({"status.online":true,_id:{$ne:Meteor.userId()}}), 
    countMessage: Counts.get('messCount'),
    conCount: Counts.get('conCount') 
  };
}, Dashboard);