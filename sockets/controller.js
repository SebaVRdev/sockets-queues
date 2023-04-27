const TicketControl = require("../models/ticket-control");

//TRAEMOS LA INFORMACION
const ticketControl = new TicketControl();

const socketController = (socket) => {

    //CUANDO el cliente recien se conecta
    socket.emit('estado-actual', ticketControl.ultimos4); //MANDAMOS los ultimos 4
    socket.emit('ultimo-ticket', ticketControl.ultimo); //MANDAMOS el ultimo ticket
    socket.emit('tickets-pendientes', ticketControl.tickets.length); //MANDAMOS el total de tickets aun sin tomar

    socket.on('siguiente-ticket', ( payload, callback ) => {
        const siguiente = ticketControl.siguiente(); //Se hace la logica que crea un nuevo ticket
        
        callback(siguiente); //MANDA el callback con la informacion el cliente
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length); //CADA vez que se crea un nuevo ticket se emite el de tickets pendientes
        // TODO: Notificar que hay un nuevo ticket pendiente
    });
    
    socket.on('atender-ticket', ( payload, callback ) => {
        //Validamos que venga el escritorio
        if (!payload.escritorio) {
            return callback({
                ok : false,
                msg: 'El escritorio es obligatorio'
            })
        };

        const ticket = ticketControl.atenderTicket(payload.escritorio);
        socket.broadcast.emit('estado-actual', ticketControl.ultimos4); //MANDAMOS los ultimos 4 cuando se comienza atender otro
        
        /* Volvemos a emitir este evento cuando se asigna un ticket, de tal forma que ese evento llegue tanto a los demas usuarios
            como un resultado a nosotros mismos
        */
        socket.emit('tickets-pendientes', ticketControl.tickets.length); 
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length); 


        if (!ticket) {
            callback({
                ok : false,
                msg: 'Ya no hay tickets pendientes'
            })
        }
        else{
            callback({
                ok : true,
                ticket //Mandamos ticket
            })
        }
    });
};



module.exports = {
    socketController
};

