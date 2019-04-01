import React from 'react';
import ReactDOM from 'react-dom';
import { renderRoutes } from './routes.js';


Meteor.startup(() =>{
    ReactDOM.render(renderRoutes(), document.querySelector('.app'));

});
