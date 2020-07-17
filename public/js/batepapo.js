$(document).ready(function() {
    var $window = $(window);
    var $usuario = $( '.usuario');
    var $batepapo = $( '.batepapo' );

    var socket = io.connect();

    var pronto = false;
    var nomeDoCliente;

    const INTERVALO_FADE = 200;  // ms
    const $quadro = $( '.quadro' );

    var $apelido = $( '.apelido' ); // input apelido
    var $mensagem = $( '.mensagem' );

    const setNome = () => {
        nomeDoCliente = textoSemInjecao( $apelido.val().trim() );

        if (nomeDoCliente) {
            $usuario.slideUp("slow");
            
            var hora = new Date();

            $("#nome").html(nomeDoCliente);

            $("#hora").html( 'Primeiro Login: ' + hora.getHours() + ':' + hora.getMinutes() );

            
            $batepapo.slideDown("slow");

            pronto = true;

            socket.emit( 'entrar', { "nome": nomeDoCliente} );
        }
        else {
            alert( "Digite seu apelido.");
        }
    }


    $window.keydown( evento => {

        var texto = $( "#falei" ).val();

        if (evento.which === 13) {
            if (nomeDoCliente) {

                $("#falei").val('');
                
                dizer( texto, {falador: 'eu'} );
                socket.emit( 'enviar', texto );
            } else {
                setNome();
            }
        }
    });

    const dizer = (mensagem, opcoes ) => {
        var hora = new Date();
        let $el;

        if (!opcoes.falador || opcoes.falador == 'eu') {
            $el = $( '<li>' ).addClass('eu').text(mensagem)
                        .append(' - <time>' + 
                                hora.getHours()+':'+hora.getMinutes() +
                                '</time>');
        } else {
            $el = $( '<li>' ).addClass(opcoes.falador)
                        .append(
                            '<time>' +
                            hora.getHours()+':'+hora.getMinutes() +
                            '</time>'     
                        ).text(mensagem);
        }
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
            $quadro.prepend($el);
        } else {
            $quadro.append( $el );
        }
        $quadro[0].scrollTop = $quadro[0].scrollHeight;
    }



    socket.on( 'connect', function(cliente) {
        console.log( 'ESTOU CONECTADO!');

    });


    socket.on( "entrou", function(msg) {
        var mensagem = "Bem vindo ao Bate-papo - " + msg.nomeDoCliente;
        
        dizer( mensagem, {prepend: true, falador: "servidor"});
        //qtosClientesMsg( msg );
    });

    socket.on( "juntou-se", function(msg) {
        dizer( msg.nomeDoCliente + " entrou no Bate-papo",
                {falador: "servidor"});
        //qtosClientesMsg( msg );
    });

    socket.on( "atualizar", function(msg) {
        if (pronto) {
            $( '.batepapo' ).append( '<li class="info">' + msg + '</li>' );
        }
    });

    socket.on( "papo", function( quem, msg ) {
        if (pronto) {

            var hora = new Date();
            $( ".quadro" )
                .append( '<li class="mensagens" ' +
                '><div class="msg" style="color:' + quem.cor + ';">' +
                    '<p>' +
                        '<time>'+ hora.getHours()+':'+ hora.getMinutes() +
                        '</time>' +
                        '<span>&nbsp;' + 
                        quem.nomeDoCliente +
                        ':&nbsp;</span>' + 
                        msg + 
                '   </p>' + 
                '</div></li>' );
        }

    });

});