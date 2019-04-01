import React from 'react';
import ReactDOM from 'react-dom';
import './login.css';
import {
    Route,
    Redirect,
} from "react-router-dom";


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.getMeteorData();
    }
    getMeteorData() {
        return { isAuthenticated: Meteor.userId() !== null };
    }
    componentWillMount() {
        if (this.state.isAuthenticated) {
            this.props.history.push('/');
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.state.isAuthenticated) {
            this.props.history.push('/');
        }
    }


    handleSubmit(event) {
        event.preventDefault();
        Meteor.loginWithPassword(this.refs.userName.value, this.refs.userPassword.value, (error) => {
            if (error) {
                alert('Login failed.')
            } else {
                this.setState({ isAuthenticated: true });
            }
        });
    }
    render() {
        if (this.state.isAuthenticated) {
            return <Redirect to = { this.state.path } />;
        } else {
            return (
            	<div className="container container-login">
				    <div className="row">
				        <div className="col-md-offset-5 col-md-3">
				            <div className="form-login">

					             <h4 style={{'border': '0 solid #fff', 'borderBottomWidth': '1px', 'paddingBottom':'10px', 'textAlign': 'center' }}>txtConsole</h4>
					             <form onSubmit={this.handleSubmit.bind(this)}>
						            <input type="text"  ref="userName" id="userName" className="form-control input-sm chat-input" placeholder="username" required/>
						            <br/>
						            <input type="password" ref="userPassword" id="userPassword" className="form-control input-sm chat-input" placeholder="password" required/>
						            <br/>
						            <div className="wrapper">
						            <span className="group-btn">     
						                <button type="submit" className="btn btn-primary btn-md">login<i className="fa fa-sign-in"></i></button>
						            </span>
						            </div>
					            </form>
				            </div>
				        
				        </div>
				    </div>
				</div>
            );
        }
    }
}

export default Login;