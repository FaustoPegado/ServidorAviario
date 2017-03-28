/**
 * Arquivo: lampadas.js
 * Author: Fausto Pegado
 * Description: Arquino no qual criará estados para as lampadas.
 * Data:
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LampadaSchema = new Schema({
    posicao: String,
    estado: String,
    temperatura: String
});

module.exports = mongoose.model('Lampada', LampadaSchema);
