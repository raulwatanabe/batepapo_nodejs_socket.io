const express = require('express');
const app = express();
const server = app.listen(3000);
const io = require('socket.io').listen(server);
const obterCor = require('./lib/cor');

var papeadores = [];
var papeador = {};
var numPapeador= 0;

app.use( express.static(__dirname + '/views'));
app.use( '/node_modules', express.static(__dirname + '/node_modules/'));
app.use( '/public', express.static(__dirname + '/public'));

app.get( '/', function(req,res){
    res.sendFile(__dirname + "/views/batepapo.html");
});

io.on('connection', function(cliente) {
    var clienteAtivo = false;

    cliente.on('entrar', function(novo) {
        if (clienteAtivo) return;

        ++numPapeador;
        clienteAtivo = true;

        papeador = { id: cliente.id,
                    nomeDoCliente: novo.nome,
                    cor: obterCor(novo.nome),
                    numPapeador };

        papeadores.push(papeador);
        
        cliente.emit("entrou", papeador);

        cliente.broadcast.emit("juntou-se", papeador);
    });

    cliente.on("enviar", function(msg) {
        papeador = papeadores.filter(function(p) {
            return p.id == cliente.id;
        });
        if (papeador.length >= 1) {
            papeador = papeador[0];
        } else {
            papeador = {
                nomeDoCliente: 'desconectado'
            };
        }
                
        cliente.broadcast.emit( "papo", papeador, msg);
    });

    cliente.on( "sair", function() {
        papeador = papeadores.filter(function(p) {
            return p.id == cliente.id;
        });
        if (papeador.length >= 1) {
            papeador = papeador[0];

            io.emit( "atualizar", papeador.nomeDoCliente + 
                        " saiu do bate-papo." );
            
            //delete papeadores[cliente.id];
            papeadores = papeadores.filter(function(p) {
                return p.id != cliente.id;
            });
        }
    
    });

});
