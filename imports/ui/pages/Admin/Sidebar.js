import React, { Component } from 'react';
import { withHistory } from 'react-router-dom';
import styled from 'styled-components';
import { createContainer } from 'meteor/react-meteor-data';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import  { withRR4, Nav, NavIcon, NavText } from 'react-sidenav';
import SvgIcon from 'react-icons-kit';
import { ic_aspect_ratio } from 'react-icons-kit/md/ic_aspect_ratio';
import { ic_business } from 'react-icons-kit/md/ic_business';
import { ic_business_center } from 'react-icons-kit/md/ic_business_center';
import { ic_format_list_bulleted } from 'react-icons-kit/md/ic_format_list_bulleted';
import { ic_people } from 'react-icons-kit/md/ic_people';
import { ic_shopping_cart } from 'react-icons-kit/md/ic_shopping_cart';
import Dashboard from  './Dashboard';
import Users from  './Users';
import Faker from  './Fakers';
import BusinessConfig from  './BusinessConfig';
const Icon20 = props => <SvgIcon size={props.size || 20} icon={props.icon} />;
const Title = styled.div`
    padding: 12px;
`;
const SideNav = withRR4();

 class Sidebar extends Component {
    constructor(props) {
        super(props);

    }

    renderDashboad ()  {
        return <Dashboard />;
    }
     renderUsers ()  {
        return <Users />;
    }


    renderBusiness ()  {
        return <BusinessConfig />;
    }

    renderFaker () {
        return <Faker />;
    }

    render(){    
      return(
       <Router>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <div className="col-xs-3" style={{background: '#2c3e50', color: '#FFF', width: 220}}>
                        <SideNav  highlightBgColor="#00bcd4" defaultSelected="dashboard">
                            <Title>Navigation</Title>
                            <Nav id="dashboard">
                                <NavIcon><Icon20 icon={ic_aspect_ratio} /></NavIcon>
                                <NavText> Dashboard </NavText>
                            </Nav>
                            <Nav id="users">
                                <NavIcon><Icon20 icon={ic_people} /></NavIcon>
                                <NavText> Users </NavText>
                            </Nav>

                            <Nav id="business">
                                <NavIcon><Icon20 icon={ic_business} /></NavIcon><NavText> Business </NavText>
                            </Nav>
                            <Nav id="faker">
                                <NavIcon><Icon20 icon={ic_business_center} /></NavIcon>
                                <NavText> Faker </NavText>
                            </Nav>

                        </SideNav>
                    </div>
                    <div className="container col-xs-7">
                        <Route exact path="/" render={this.renderDashboad}/>
                        <Route path="/dashboard" render={this.renderDashboad}/>
                        <Route path="/users" render={this.renderUsers}/>
                        <Route path="/business" render={this.renderBusiness}/>
                        <Route path="/faker" render={this.renderFaker}/>
                    </div>
                </div>
            </Router>


   
      );
    }

}

export default createContainer(props =>{
  Meteor.subscribe("onlusers");
  return {
    onlusers: Meteor.users.find({"status.online":true,_id:{$ne:Meteor.userId()}}), 
  };
}, Sidebar);