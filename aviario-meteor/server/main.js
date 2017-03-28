import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';


import '../imports/api/atuadores';

import { Atuadores } from '../imports/api/atuadores';

Meteor.methods({
	update: function  (atuador) {

		if (atuador.estado === 1) {
			Atuadores.update({_id: atuador._id},{$set: {estado: 0}});	
		}else {
			Atuadores.update({_id: atuador._id},{$set: {estado: 1}});	
		}

		HTTP.call("GET", "http://192.168.0.97:8000/aviario/atualizarAtuador/"+atuador._id, (err,result)=>{

		});
	}
})