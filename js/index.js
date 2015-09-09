var $ = require('jquery');

var React = window.React = require('react/addons');
var Toolbar = require('./ttt');

React.render(
    React.createElement(Toolbar()),
    document.getElementById('container')
);
if (NODE_ENV === 'production') {
    $('body').append('There is Production mode.');
} else {
    $('body').append('There is Development mode.');
}