import React, { Component } from 'react';
import { withHistory } from 'react-router-dom';
import MainPageContainer from './MainPageContainer';

  export default class AdminContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
          isVisible: false,
        };
        this.logout = this.logout.bind(this);
    }

    updateModal(isVisible) {
      this.state.isVisible = isVisible;
      this.forceUpdate();
    }

    logout(e){
      e.preventDefault();
      Meteor.logout( (err) => {
          if (err) {
              console.log( err.reason );
              console.log('error');
          } else {
              this.props.history.push('/login');
              alert('success');
          }
      });
    }
    render(){    
      return(
        <div>
           <MainPageContainer />
        </div>
      );
    }

}