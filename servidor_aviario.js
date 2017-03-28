/**
 * Arquivo: server.js
 * Descrição: Arquivo responsável por levantar o serviço do Node.Js para poder
 * executar a aplicação e a aviario através do Express.Js.
 * Author: FAusto Pegado
 * Data de Criação:
 */

//Base do Setup da Aplicação:

/* Chamada das Package*/
var app         = require('express')(); //definção da aplicação pelo express.
var express     = require('express'); //chamando o pacote express.
var bodyParser  = require('body-parser');  //chamando o pacote body-parser.
var Atuador     = require('./app/models/atuadores');//chama o arquivo atuadores.js
var mongoose    = require('mongoose');//instancia um objeto para o mongodb.
var fs          = require('fs');//realizar uma requisição de arquivos do sistema 'fs'.

var http        = require('http').Server(app);//
var io          = require('socket.io')(http);//cria uma instancia para armazenar os dados que serão enviado ou recebidos pela porta serial.
var srp         = require('serialport');
var SerialPort  = require('serialport');//adaptador que permite a comunicação via porta serial.

var sp = new SerialPort('/dev/ttyACM0', { //determina a porta serial que o arduino esta conectada.
  baudRate: 9600, //determina a velocidade de transmissão de dados que o arduino será configurado.
  parser: srp.parsers.readline("\r\n")//ler os dados da porta serial até a quebra de linha.
});




/*
*Recebe os dados enviados pelo Arduino.
*/
sp.on('data', function (dados) {
  var jsonData = JSON.stringify(dados);//Converte a String recebido pelo Arduino em um objeto JSON. OBS:não funcionou com .parse()
  console.log(dados); //para debug, imprime no console o json enviado pelo arduino.

  if (dados == 'Atuadores') {//Verifica se o arduino solicitou uma atualização dos atuadores
    updateActuators (); //
  }
  //envia o JSON como uma variavel "dados" para recebe-los no HTML.
  io.emit('dados', jsonData);
});


/*
*Recebe a ação vinda do JQuery do index.html e envia ao console para
  o Arduino ler.
*/
io.on('connection', function(socket) {
  socket.on('atuador01', function (json) {
    console.log('Arduino conectato..');
    /*escreve na porta do arduino para o Arduino interpretar e ligar
      ou desligar os atuadores atraves da interface web /view.
    */
    sp.write(json);
    console.log(json);
  });
});

/*URI que realiza a conecxão com o banco de dados em nuven
*/
//mongoose.connect('mongodb://Aviario2017:aviario2017@olympia.modulusmongo.net:27017/z5apYhev');
mongoose.connect('mongodb://Aviarioeaj:aviarioeaj@ds133450.mlab.com:33450/mongodbaviario');


/** Configuração da variável 'app' para usar o 'bodyParser()'.
 * Ao fazermos isso nos permitirá retornar os dados a partir de um POST
 */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/** Definição da porta onde será executada a nossa aplicação */
var port = process.env.PORT || 8000;

//Rotas da aviario:
//==============================================================

/* Aqui o 'router' irá pegar as instâncias das Rotas do Express */
var router  = express.Router();

/* Middleware para usar em todos os requests enviados para a nossa aviario- Mensagem Padrão */
router.use(function(req, res, next) {
    console.log('Middleware solicitado........');
    next(); //aqui é para sinalizar de que prosseguiremos para a próxima rota. E que não irá parar por aqui!!!
});

/* Rota de Teste para ver se tudo está realmente funcionando (acessar através: GET: http://localhost:8000/aviario) */
router.get('/', function(req, res) {
    res.json({ message: 'AVIÁRIO EAJ - Seja bem-vindo, aqui será mostrado ao usuário as opçoes do sistema' });
});

/*Rota para mostrar o painel de controle no navegador*/
router.get('/paineldecontrole', function(req, res) {
    res.end(fs.readFileSync('view/index.html'));
});

/* TODO - Definir futuras rotas aqui!!! */

    // Rotas que irão terminar em '/atuadoress' - (servem tanto para: GET All &amp; POST)
    router.route('/atuadores')

    /* 1) Método: Criar atuador (acessar em: POST http://localhost:8000/aviario/atuadoress */
    .post(function(req, res) {
        var atuador = new Atuador();

        //aqui setamos os campos do atuadoress (que virá do request)
        atuador.posicao = req.body.posicao;
        atuador.estado = req.body.estado;
        atuador.temperatura = req.body.temperatura;
        atuador.tipo = req.body.tipo;

        atuador.save(function(error) {
            if(error)
                res.send(error);

            res.json({ message: 'Estado do atuador Criado com Sucesso!' });
        });
    });

    router.route('/atuadores')

    /* 2) Método: Selecionar Todos (acessar em: GET http://locahost:8000/aviario/atuadores) */
    .get(function(req, res) {

        //Função para Selecionar Todos os estados criados para as atuadoress 'atuadoress' e verificar se há algum erro:
        Atuador.find(function(err, atuadores) {
            if(err)
                res.send(err);

            res.json(atuadores);

        });

    });

    // Rotas que irão terminar em '/atuadores/:atuador_id' - (servem tanto para GET by Id, PUT, &amp; DELETE)
    router.route('/atuadores/:atuador_id')

        /* 3) Método: Selecionar Por Id (acessar em: GET http://localhost:8000/aviario/atuadores/:atuador_id) */
        .get(function(req, res) {

            //Função para Selecionar Por Id e verificar se há algum erro:
            Atuador.findById(req.params.atuador_id, function(error, atuador) {
                if(error)
                    res.send(error);

                res.json(atuador);
                //console.log(atuador);
                //updateState (atuador);//TESTE
            });
        });

    router.route('/atuadores/:atuador_id')

    /* 4) Método: Atualizar (acessar em: PUT http://localhost:8000/aviario/atuadores/:atuador_id) */
    .put(function(req, res) {
            //Primeiro: Para atualizarmos, precisamos primeiro achar o atuador. Para isso, vamos selecionar por id:
            Atuador.findById(req.params.atuador_id, function(error, atuador) {
                if(error)
                    res.send(error);

                //Segundo: Diferente do Selecionar Por Id... a resposta será a atribuição do que encontramos na classe modelo:
                atuador.posicao = req.body.posicao;
                atuador.estado = req.body.estado;
                atuador.temperatura = req.body.temperat;
                atuador.tipo = req.body.tipo;

                //Terceiro: Agora que já atualizamos os campos, precisamos salvar essa alteração....
                atuador.save((error) => {
                    if(error)
                        res.send(error);

                    console.log(atuador.id);
                    //updateState (atuador);//TESTE

                    res.json({ message: 'Estado do atuador Atualizado!' });

                    //TODO: Cada vez que uma atuador for aualizada o método de enviar dados para o arduino via serial será chamado


                });
            });
        });

    router.route('/atuadores/:atuador_id')

     /* 5) Método: Excluir (acessar em: http://localhost:8000/aviario/atuadores/:atuador_id) */
    .delete(function(req, res) {

        //Função para excluir os dados e também verificar se há algum erro no momento da exclusão:
        Atuador.remove({
        _id: req.params.atuador_id
        }, function(error) {
            if(error)
                res.send(error);

            res.json({ message: 'Atuador excluído com Sucesso! '});
        });
    });

    /*TESTE DE ROTA
    */
    router.route('/atualizarAtuador/:atuador_id')

        /* 6) Método: Selecionar Por Id (acessar em: GET http://localhost:8000/aviario/atuadores/:atuador_id) */
        .get(function(req, res) {

            //Função para Selecionar Por Id e verificar se há algum erro:
            Atuador.findById(req.params.atuador_id, function(error, atuador) {
                if(error)
                    res.send(error);

                res.json(atuador);
                console.log(atuador);
                updateState (atuador);//TESTE
            });
        });



/* Todas as rotas serão prefixadas com '/aviario' */
app.use('/aviario', router);

/*Função para escrever na porta serial recebe um dado e envia para o arduino as informações necessárias
*/
function writeSerialPort (dados) {
  /*TODO: Recebe informações e escreve na porta serial
  */
  sp.write(dados);
}

function updateState (object) {
  /*TODO: Realizar atualização dos atuadores aqui, primeiro fazer um .get de todos os atuadores de depois separar os estdos
  e enviar para o arduino
  */

  var sendArduino;

  sendArduino = object.posicao;
  sendArduino = sendArduino + ';' + object.estado;
  //sendArduino = sendArduino + ';' + object.temperatura;
  //sendArduino = sendArduino + ';' + object.tipo;

  console.log(sendArduino);
  writeSerialPort(sendArduino);
  //console.log(sendArduino);
}

//Iniciando o Servidor (Aplicação):
//==============================================================
app.listen(port);
console.log('Aplicação inicializada na porta ' + port);
