const path = require('path');
const fs   = require('fs');

//CLASE estructurar ticket
class Ticket{
    constructor(numero, escritorio) {
        this.numero     = numero;
        this.escritorio = escritorio;
    }
}


class TicketControl {
    constructor(){
        this.ultimo   = 0;                     //Ultimo ticket ingresado
        this.hoy      = new Date().getDate();  // Solo el numero del dia  
        this.tickets  = [];
        this.ultimos4 = [];

        this.init();
        
    }

    //GET para llamar a la indtruccion y llamar al archivo
    get toJson() {
        return {
            ultimo  : this.ultimo,
            hoy     : this.hoy,
            tickets : this.tickets,
            ultimos4: this.ultimos4
        };
    };

    //METODO para guardar en la BD
    guardarDB() {
        const dbPath = path.join(__dirname, '../db/data.json');
        fs.writeFileSync(dbPath, JSON.stringify(this.toJson));
    }
    
    init(){
        //LEEMOS el archivo y inicializamos los datos
        const {ultimo, hoy, tickets, ultimos4 } = require('../db/data.json');
        if (hoy === this.hoy) {
           //TABAJANDO en el mismo dia, y no han cambiado los datos
           this.ultimo   = ultimo;
           this.tickets  = tickets;
           this.ultimos4 = ultimos4;
        }
        else{
            //TRABAJANDO en otro dia, necesitamos guardar los datos en la BD
            this.guardarDB();
        }
    }

    //METODO pasar de ticket
    siguiente(){
        this.ultimo += 1; 
        const ticket = new Ticket(this.ultimo, null);
        console.log(ticket.numero)

        //INSERTAMOS el nuevo ticket en el arreglo de ticket
        this.tickets.push(ticket);
        
        //GUARDAMOS en la BD
        this.guardarDB();
        return 'Ticket ' + ticket.numero;
    }

    atenderTicket(escritorio){
        // No tenemos tickets
        if (this.tickets.length === 0) {
            return null;
        }
        
        const ticket = this.tickets.shift(); //TOMAMOS el primer ticket, se elimina y se retorna
        
        /* 
            El ticket ya no esta asociado al array de tickets ya que fue sacado
            por lo cual ahora el escritorio queda libre y se le debe adociar algo
        */
       ticket.escritorio = escritorio;

       //INGRESAMOS en la primera posicion el ticket que se esta atendiendo
       this.ultimos4.unshift( ticket ); 

       if (this.ultimos4.length > 4 ) {
        //ELIMIAMOS EL ULTIMO
        this.ultimos4.splice(-1, 1); //TOMA el ultimo (-1) y elimina solo uno (1)
       }

       //ACTUALIZAMOS BD
       this.guardarDB();

       return ticket; 
    }

}

module.exports = TicketControl;