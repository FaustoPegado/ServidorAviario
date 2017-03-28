/**
 * Arquivo: atuadores.js
 * Author: Fausto Pegado
 * Description: Arquino no qual criará estados para os atuadores.
 * Data:
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AtuadorSchema = new Schema({
    posicao: String,
    estado: String,
    temperatura: String,
    tipo: String
});

module.exports = mongoose.model('Atuador', AtuadorSchema);
