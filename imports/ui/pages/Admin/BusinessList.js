import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Business } from '../../../api/Business';

 class BusinessList extends Component {
  constructor(props){
    super(props);
    this.state = {
      businessList: props.business ,
    };
  }

  componentWillReceiveProps(nextProps){
    this.setState({businessList: nextProps.business})
  }
  render(){
        return (
      <div>
          {this.props.business.map(Business => {
            const {_id, name, description, type} = Business;
            return(
              <li key={_id} className="list-group-item" style={{padding: '15px 15px', textAlign: 'left'}}>
                {name} <i></i>
              <a className="glyphicon glyphicon-edit pull-right" onClick={this.props.onEdit.bind(this, {_id},{name},{description},{type})}/></li>
            );
          })}
      </div>
    );
  }


}

// BusinessConfig.propTypes = {
//   username: PropTypes.string
// }

export default createContainer(props =>{
  
    Meteor.subscribe('business',
     {'name': {$regex: ".*" + props.searchString + ".*"}},
     {sort:{name:1}, limit:300}
  );

  return { 
    business: Business.find({'name': {$regex: ".*" + props.searchString + ".*"}}, {limit:25},{sort: {name: -1}}).fetch(),
    onEdit: props.onEdit,
};
}, BusinessList);



