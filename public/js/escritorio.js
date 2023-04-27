console.log('Escritorio HTML');

  //ELEMENTOS del html
const lblEscritorio    = document.querySelector('h1');
const lblTicketAtender = document.querySelector('small');
const lblPendientes = document.querySelector('#lblPendientes');
const btnAtender       = document.querySelector('button');
const divAlerta        = document.querySelector('.alert');

//OBTENEMOS los parametros que vienen por URL
const searchParams = new URLSearchParams(window.location.search);

// BUSCAMOS si viene el parametro de escritorio
if (!searchParams.has('escritorio')) {
    /* EN CASO de que no venga el parametro, nos movemos a index.html y mandamos un error */
    window.location = 'index.html';
    throw new Error('El escritorio es obligatorio!');
}

  //OBTENER escritorio al que se entro
const escritorio              = searchParams.get('escritorio');
lblEscritorio.innerText       = escritorio;

//OCULTAMOS la alerta
divAlerta.style.display = 'none';


const socket = io();

socket.on('connect', () => {
    //Si se conecta el boton estara habilitado
    btnAtender.disabled = false;

});

socket.on('disconnect', () => {
    //Si esta desconectado no se podra disparar nada
    btnAtender.disabled = true;
});

socket.on('tickets-pendientes', (pendientes) => {
    console.log(pendientes)
    if (pendientes === 0 ) {
        lblPendientes.style.display = 'none';
    }
    else{
        lblPendientes.style.display = '';
        lblPendientes.innerText = pendientes
    }
});


/* PRESIONAMOS boton de atender ticket y emitimos un evento al backend, en el cual se envia el escritorio */
btnAtender.addEventListener( 'click', () => {
    const payload = {escritorio};

    socket.emit( 'atender-ticket', payload , ( ticketAtender ) => {
        console.log('El ticket que se va atender: ', ticketAtender.ticket );
        if (!ticketAtender.ok) {
            //CASO de que el ok sea falso, no hay mas ticket por atender, mostramos la alerta
            lblTicketAtender.innerText = 'Nadie';     
            return  divAlerta.style.display = '';
        }
        lblTicketAtender.innerText = `ticket: ${ticketAtender.ticket.numero}`;     
    });
});