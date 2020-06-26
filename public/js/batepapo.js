$(document).ready(function() {
    var $window = $(window);
    var $usuario = $( '.usuario');
    var $batepapo = $( '.batepapo' );

    var socket = io.connect();

    var pronto = false;
    var nomeDoCliente;

    var INTERVALO_FADE = 200;  // ms

    var $mensagens = $( '.mensagens' );
    var $apelido = $( '.apelido' ); // input apelido
    var $mensagem = $( '.mensagem' );

    const setNome = () => {
        nomeDoCliente = textoSemInjecao( $apelido.val().trim() );

        if (nomeDoCliente) {
            $usuario.slideUp("slow");
            
            // var nome = $( ".apelido" ).val();
            var hora = new Date();

            // $("#nome").html(nome);
            $("#nome").html(nomeDoCliente);

            $("#hora").html( 'Primeiro Login: ' + hora.getHours() + ':' + hora.getMinutes() );

            
            $batepapo.slideDown("slow");
            // $usuario.off('click');
            // $batepapo.on('click');

            socket.emit( 'entrar', { "nome": nomeDoCliente} );
        }
        else {
            alert( "Digite seu apelido.");
        }
    }


    $window.keydown( evento => {

        console.log( "Entrei em keyDown.....");


        // tem coisas
        var texto = $( "#falei" ).val();

        if (evento.which === 13) {
            if (nomeDoCliente) {
                //
                $("#falei").val('');
                
                dizer( texto );
            } else {
                setNome();
            }
        }
    });

    /*
    $("#textarea").keypress( function(e) {
        if (e.which == 13 ) {
            var text = $( "#textarea" ).val();
            $("#textarea").val('');
            var hora = new Date();

            $( ".batepapo" ).append( '<li class="self"><div class="msg"><span>' +
            $("#apelido").val() + ':</span><p>' + text + '</p><hora>' + hora.getHours() +
            ':' + hora.getMinutes() + '</hora></div></li>' );

            socket.emit( "enviar", text );

            // Scroll
            document.getElementById( 'rodape' ).scrollIntoView();

        }
    });
*/


    // 

    const dizer = (mensagem, opcoes ) => {
        var hora = new Date();
        //$(".mensagens").append('<li class="me"><div class="msg"><span>' + $(".apelido").val() + ':</span><p>' + texto + '</p><time>' + hora.getHours()  )

        var $el = $( '<li>' ).addClass('me').text(mensagem);
        adicionaMensagem( $el, opcoes );
    }

    const textoSemInjecao = (entrada) => {
        return $('<div/>').text(entrada).html();
    }

    const adicionaMensagem = (el, opcoes ) => {
        var $el = $( el );

        if (!opcoes) {
            opcoes = {};
        }
        if (typeof opcoes.fade === 'undefined') {
            opcoes.fade = true;
        }
        if (typeof opcoes.prepend === 'undefined') {
            opcoes.prepend = false;
        }

        if (opcoes.fade) {
            $el.hide().fadeIn(INTERVALO_FADE);
        }

        if (opcoes.prepend) {
            $mensagens.prepend($el);
        } else {
            $mensagens.append( $el );
        }
        $mensagens[0].scrollTop = $mensagens[0].scrollHeight;
    }



    socket.on( 'connect', function(cliente) {
        console.log( 'ESTOU CONECTADO!');

    });




    socket.on( "entrou", function(msg) {
        var mensagem = "Bem vindo ao Bate-papo - " + msg.nome;
        
        console.log( "->entrou" );
        console.log( mensagem );

        dizer( mensagem, {prepend: true});
        qtosClientesMsg( msg );
    });

    socket.on( "juntou-se", function(msg) {
        dizer( msg.nomeDoCliente + " entrou no Bate-papo");
        qtosClientesMsg( msg );
    });

    socket.on( "atualizar", function(msg) {
        if (pronto) {
            $( '.batepapo' ).append( '<li class="info">' + msg + '</li>' );
        }
    });

    socket.on( "batepapo", function( cliente, msg ) {
        if (pronto) {
            var hora = new Date();
            $( ".batepapo" ).append( '<li class="field"><div class="msg"><span>' + cliente +
            ':</span><p>' + msg + '</p><hora>' + hora.getHours() + ':' + hora.getMinutes() + 
            '</hora></div></li>' );
        }

    });

});