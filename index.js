var express = require( 'express' );
var app = express();
var server = app.listen(3000);
var io = require('socket.io').listen(server);

var clientes = {};
var numClientes = 0;

app.use( express.static( __dirname + '/views' ));
app.use( '/node_modules', express.static( __dirname + '/node_modules/' ));
app.use( '/public', express.static( __dirname + '/public' ));

app.get( '/', function(req,res){
    res.sendFile( __dirname + "/views/batepapo.html" );
});

io.on('connection', function(cliente) {
    var clienteAtivo = false;

    
    console.log( "io.on. connection - cliente ");




    cliente.on('entrar', function(usuario) {

        console.log( "In: function entrar... estou aqui!" );


        if (clienteAtivo) return;

        cliente.nomeDoCliente = usuario.nome;
        ++numClientes;
        clienteAtivo = true;

        console.log(usuario.nome + ' Entrou no bate-papo.');
        clientes[cliente.id] = usuario;
        cliente.emit("entrou", {
            nomeDoCliente: usuario.nome,
            numClientes: numClientes
        });

        cliente.broadcast.emit("juntou-se", {
            nomeDoCliente: usuario.nome,
            numClientes: numClientes
        });
    });

    cliente.on("enviar", function(msg) {
        console.log( "Mensagem: " + msg );
        cliente.broadcast.emit( "batepapo", clientes[cliente.id], msg);
    });

    cliente.on( "sair", function() {
        console.log( "Bye bye..." );
        io.emit( "atualizar", clientes[cliente.id] + " saiu do bate-papo." );
        delete clientes[cliente.id];
    });

});
