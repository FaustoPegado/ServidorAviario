import { Mongo } from 'meteor/mongo';

export const Atuadores = new Mongo.Collection('atuadors');

if (Meteor.isServer) {

	Meteor.publish('atuadores', function () {
		return Atuadores.find({});
	});

}
