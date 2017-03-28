import { HTTP } from 'meteor/http';

import './main.html';

import { Atuadores } from '../imports/api/atuadores';

Template.home.onCreated(function helloOnCreated() {
  Meteor.subscribe('atuadores');

});

Template.home.helpers({
  atuadores() {
    return Atuadores.find();
}
});

Template.atuador.events({
  'click .altera-estado': function(event, instance) {
  	
  	Meteor.call('update',this);
  },
});
