const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');
//UI
const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

let editando;

class Citas {
    constructor() {
        this.citas = [];
    }
    agregarCitas(cita){
    this.citas= [...this.citas,cita];
    } 
    eliminarCita(id){
        this.citas = this.citas.filter(cita => cita.id !== id)
    }
    editarCita(citaActualizada){
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita)
        

    }
    
}

class UI {

    imprimirAlerta(mensaje,tipo){
        //crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center','alert','d-block','col-12')

        //Agregar clase en base al tipo de error
        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        }else{
            divMensaje.classList.add('alert-success')
        }
        //Mensaje de Error
        divMensaje.textContent = mensaje;

        //Agregar al DOM
        document.querySelector('#contenido').insertBefore(divMensaje,document.querySelector('.agregar-cita'))
        //Se elimina el mensajes(26.4)
        setTimeout(() =>{
            divMensaje.remove();
          },5000);
    }

    imprimirCitas({citas}){
        this.limìarHTML();
        citas.forEach( cita =>{
            const {mascota, propietario,telefono,fecha,hora,sintomas,id} = cita;
            
        const divCita = document.createElement('div');
        divCita.classList.add('cita','p-3');
        divCita.dataset.id = id;

        const mascotaParrafo = document.createElement('h2');
        mascotaParrafo.classList.add('card-title','font-weight-bolder');
        mascotaParrafo.textContent = mascota;

        const propietarioParrafo = document.createElement('p');
        propietarioParrafo.innerHTML = `
          <span class = "font-weight-bolder">Propietario: </span>${propietario}
        `;
        
        const telefonoParrafo = document.createElement('p');
        telefonoParrafo.innerHTML = `
          <span class = "font-weight-bolder">Telefono: </span>${telefono}
        `;
        
        const fechaParrafo = document.createElement('p');
        fechaParrafo.innerHTML = `
          <span class = "font-weight-bolder">Fecha: </span>${fecha}
        `;
        
        const horaParrafo = document.createElement('p');
        horaParrafo.innerHTML = `
          <span class = "font-weight-bolder">Hora: </span>${hora}
        `;
        
        const sintomasParrafo = document.createElement('p');
        sintomasParrafo.innerHTML = `
          <span class = "font-weight-bolder">Sintomas: </span>${sintomas}
        `;


        //boton eliminar
        const btnEliminar = document.createElement('button');
        btnEliminar.classList.add('btn','btn-danger','mr-2');
        btnEliminar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>
`;

            btnEliminar.onclick = () => eliminarCita(id);

//boton editar
            
        const btnEditar = document.createElement('button');
        btnEditar.classList.add('btn','btn-info');
        btnEditar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
</svg>
`;
            btnEditar.onclick = () => cargarEdicion(cita);



        divCita.appendChild(mascotaParrafo);
        divCita.appendChild(propietarioParrafo);
        divCita.appendChild(telefonoParrafo);
        divCita.appendChild(fechaParrafo);
        divCita.appendChild(horaParrafo);
        divCita.appendChild(sintomasParrafo);
        divCita.appendChild(btnEliminar);
        divCita.appendChild(btnEditar);
        
        contenedorCitas.appendChild(divCita);
        })

    }

    limìarHTML(){
        while(contenedorCitas.firstChild){
            contenedorCitas.removeChild(contenedorCitas.firstChild)
        }
    }
}

const ui = new UI();
const administrarCitas = new Citas();
//Registras eventos
eventListeners();
function eventListeners(){
    mascotaInput.addEventListener('input',datosCita);
    propietarioInput.addEventListener('input',datosCita);
    telefonoInput.addEventListener('input',datosCita);
    fechaInput.addEventListener('input',datosCita);
    horaInput.addEventListener('input',datosCita);
    sintomasInput.addEventListener('input',datosCita);

    formulario.addEventListener('submit', nuevaCita);
}
//Objeto con informacion de la cita
const citaObj= {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}

function datosCita(e){
   citaObj[e.target.name] = e.target.value;
    
}


//Validacion y agrega una nueva cita a la clase de citas
function nuevaCita(e){
    e.preventDefault();

    //Extraer la informacion del objeto de cita
    const {mascota, propietario,telefono,fecha,hora,sintomas} = citaObj;

    //Validar 
    if(mascota === '' ||propietario === '' ||telefono === '' ||fecha === '' ||hora === '' ||sintomas === '' ) {
        
        ui.imprimirAlerta('todos los campos son obligatorios','error');

        return;
    }

    if(editando){
        ui.imprimirAlerta('Editado correctamente')

        //pasar el objeto de la cita en la edicion
        administrarCitas.editarCita({...citaObj})

        //regresar el texto del boton al estado original
        formulario.querySelector('button[type="submit"]').textContent = "Crear cita";
        //quitando el modo edicion

        editando = false;


    }else{
        //generar un id unico
        citaObj.id = Date.now();

        //creando una nueva cita
        administrarCitas.agregarCitas({...citaObj});

        //mensaje de agregado correctamente
        ui.imprimirAlerta('Se agrego correctamente')
    }
    console.log(citaObj);
    

    //reinicia el formulario
    formulario.reset();

    //mostrar el HTML de las citas

    ui.imprimirCitas(administrarCitas);

};

 //reinicia el objeto
function reiniciarObjeto(){
    citaObj.mascota= '';
    citaObj.propietario= '';
    citaObj.telefono= '';
    citaObj.fecha= '';
    citaObj.hora= '';
    citaObj.sintomas= '';
}


function eliminarCita(id){
   //ekiminar cita
   administrarCitas.eliminarCita(id);
   //mandar un mensaje
   ui.imprimirAlerta('todos los campos son obligatorios');

   //refrescar html
   ui.imprimirCitas(administrarCitas);
}

//carga datos y modo edicion
function cargarEdicion(cita){
    const {mascota, propietario,telefono,fecha,hora,sintomas,id} = cita;
    //llenar los inputs
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    //rellenar el obj

    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    //cambuiar eltexto del boton

    formulario.querySelector('button[type="submit"]').textContent = "Guardar Cambios";

    editando = true;
}