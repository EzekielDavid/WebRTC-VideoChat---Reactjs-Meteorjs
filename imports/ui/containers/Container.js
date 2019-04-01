import React, { Component } from 'react';
import { withHistory } from 'react-router-dom';
import MainPageContainer from './Admin/MainPageContainer';

// import MainPageContainer from './Business/MainPageContainer';

  export default class Container extends Component {
    constructor(props) {
        super(props);
        this.state = {
          isVisible: false,
          roles: ''
        };
        this.logout = this.logout.bind(this);
    }


    updateModal(isVisible) {
      this.state.isVisible = isVisible;
      this.forceUpdate();
    }

    renderContainer(){
     
      // if(Roles.userIsInRole(Meteor.userId(), 'manager')){
      //   return <MainPageContainer />;
      // }
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
        
        </div>
      );
    }

}