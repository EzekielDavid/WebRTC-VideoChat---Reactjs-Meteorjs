import React, { Component } from 'react';
import { withHistory } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data'
import MainPageContainer from './MainPageContainer';
class BusinessContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
          isVisible: false,
          b_id: this.props.b_id
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
          }
      });
    }
    render(){    
      return(
        <div>
           <MainPageContainer busUser_id={this.props.b_id}/>
        </div>
      );
    }

}

export default createContainer(props => {
  return {
    b_id: props.b_id,
  };
}, BusinessContainer);
