console.log('Nuevo Ticket HTML');
//ELEMENTOS del html
const lblNuevoTicket = document.querySelector('#lblNuevoTicket');
const btnCrear       = document.querySelector('button');


const socket = io();

socket.on('connect', () => {
    //Si se conecta el boton estara habilitado
    btnCrear.disabled = false;

});

socket.on('disconnect', () => {
    //Si esta desconectado no se podra disparar nada
    btnCrear.disabled = true;
});

socket.on('ultimo-ticket', (ultimo) => {
    //Si esta desconectado no se podra disparar nada
    lblNuevoTicket.innerText = `Ticket ${ultimo}`;
});



btnCrear.addEventListener( 'click', () => {
    
    //PRESIONAMOS boton disparamos evento que genera un nuevo ticket
    socket.emit( 'siguiente-ticket', null, ( ticket ) => {
        console.log('Desde el server estamos mandando el: ', ticket );
        //INRESAMOS los datos del ticket en pantalla
        lblNuevoTicket.innerHTML = ticket;
    });

});