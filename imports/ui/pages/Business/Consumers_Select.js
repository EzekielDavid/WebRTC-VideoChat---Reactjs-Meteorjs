import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import Select from 'react-select';
import fetch from 'isomorphic-fetch';
 export default class Consumers_Select extends Component {
  constructor(props){
    super(props);
    this.handleSelect = this.handleSelect.bind(this);
    this.state = {
      stayOpen: false,
      backspaceRemoves: true,
      multi: true,
      creatable: false,
    };
  }

  onChange (value) {
    this.setState({
      value: value,
    });
  }

  getUsers (input) {
    if (!input) {
      return Promise.resolve({ options: [] });
    }

    return fetch(`https://api.github.com/search/users?q=${input}`)
    .then((response) => response.json())
    .then((json) => {
      return { options: json.items };
    });
  }

  toggleBackspaceRemoves () {
    this.setState({
      backspaceRemoves: !this.state.backspaceRemoves
    });
  }


  handleSelect(key) {
    this.setState({ key });
  }

  render(){

    return (
      <div className="section">
        <h3 className="section-heading">{this.props.label} <a href="https://github.com/JedWatson/react-select/tree/master/examples/src/components/GithubUsers.js">(Source)</a></h3>
        <Select.Async multi={this.state.multi} value={this.state.value} onChange={this.onChange} onValueClick={this.gotoUser} valueKey="id" labelKey="login" loadOptions={this.getUsers} backspaceRemoves={this.state.backspaceRemoves} />

        <div className="hint">This example uses fetch.js for showing Async options with Promises</div>
      </div>
    );
  }
}