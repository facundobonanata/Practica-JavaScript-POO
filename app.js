const formulario = document.querySelector("#formulario");
const cardsEstudiantes = document.querySelector("#cardsEstudiantes");
const cardsProfesores = document.querySelector("#cardsProfesores");
const templateEstudiante = document.querySelector(
  "#templateEstudiante"
).content;
const templateProfesor = document.querySelector("#templateProfesor").content;

//array para incorporar a los objetos(estudiantes)
const estudiantes = [];
const profesores = [];

//evento botones aporbado y des.
document.addEventListener("click", (e) => {
  if (e.target.dataset.nombre) {
    if (e.target.matches(".btn-success")) {
      estudiantes.map((item) => {
        // modificamos en caso de que sea true
        if (item.nombre === e.target.dataset.nombre) {
          item.setEstado = true;
        }
        // console.log(item);
        return item;
      });
    }
    if (e.target.matches(".btn-danger")) {
      estudiantes.map((item) => {
        if (item.nombre === e.target.dataset.nombre) {
          item.setEstado = false;
        }
        return item;
      });
    }
    Persona.pintarPersonaUI(estudiantes, "Estudiante");
  }
});

//clase generica persona
class Persona {
  constructor(nombre, edad) {
    this.nombre = nombre;
    this.edad = edad;
  }
  //metodo estatico, tipo estudiante y profesor
  static pintarPersonaUI(personas, tipo) {
    if (tipo === "Estudiante") {
      //limpiar text content
      cardsEstudiantes.textContent = "";
      //fragment para evitar reflow
      const fragment = document.createDocumentFragment();

      //hace el recorrido de personas
      personas.forEach((item) => {
        //appenchild empuje al item(un estudiante)tiene acceso a agregarNuev...
        //devuelve el clon que es nuestro template y lo va agregando a cada array
        // a traves del fragment
        fragment.appendChild(item.agregarNuevoEstudiante());
      });
      //fragment acumula esa informacion, una vez termine
      //manda las cards al DOM
      // se pinta
      cardsEstudiantes.appendChild(fragment);
    }

    if (tipo === "Profesor") {
      cardsProfesores.textContent = "";
      const fragment = document.createDocumentFragment();
      personas.forEach((item) => {
        fragment.appendChild(item.agregarNuevoProfesor());
      });
      cardsProfesores.appendChild(fragment);
    }
  }
}

//clase estudiante aprobar y desaprobar
class Estudiante extends Persona {
  //propiedades privadas, necesitamos set para modificarlas
  #estado = false;
  #estudiante = "Estudiante";

  set setEstado(estado) {
    this.#estado = estado;
  }

  get getEstudiante() {
    return this.#estudiante;
  }

  agregarNuevoEstudiante() {
    //capturar el template de estudiantes y modificarlo con los datos al momento de instanciar
    //con el clon podemso acceder a cada una de las propiedades dentro del template
    const clone = templateEstudiante.cloneNode(true);
    //nombre
    clone.querySelector("h5 .text-primary").textContent = this.nombre;
    clone.querySelector("h6").textContent = this.getEstudiante;
    clone.querySelector(".lead").textContent = this.edad;

    if (this.#estado) {
      //cambiar de verdadero a falso
      //class name remplaza las clases dentro del html
      clone.querySelector(".badge").className = "badge bg-success";
      clone.querySelector(".btn-success").disabled = true;
      clone.querySelector(".btn-danger").disabled = false;
    } else {
      clone.querySelector(".badge").className = "badge bg-danger";
      clone.querySelector(".btn-danger").disabled = true;
      clone.querySelector(".btn-success").disabled = false;
    }

    //si this.estado es verdadero, aprobado, sino desaprobado
    clone.querySelector(".badge").textContent = this.#estado
      ? "Aprobado"
      : "Desaprobado";

    clone.querySelector(".btn-success").dataset.nombre = this.nombre;
    clone.querySelector(".btn-danger").dataset.nombre = this.nombre;

    return clone;
  }
}

//clase profesor
class Profesor extends Persona {
  #profesor = "Profesor";

  agregarNuevoProfesor() {
    const clone = templateProfesor.cloneNode(true);
    clone.querySelector("h5").textContent = this.nombre;
    clone.querySelector("h6").textContent = this.#profesor;
    clone.querySelector(".lead").textContent = this.edad;

    return clone;
  }
}
//capturar datos del formulario, con el evento submit
formulario.addEventListener("submit", (e) => {
  e.preventDefault();

  //para capturar los datos del form
  const datos = new FormData(formulario);
  const [nombre, edad, opcion] = [...datos.values()];

  //Si la opcion es estudiante, hago la operacion
  if (opcion === "Estudiante") {
    const estudiante = new Estudiante(nombre, edad);
    //empujar estudiante(objeto) al array de estudiantes[], con push
    //se van agregando las instancias de cada estudiante
    estudiantes.push(estudiante);
    Persona.pintarPersonaUI(estudiantes, opcion);
  }

  if (opcion === "Profesor") {
    const profesor = new Profesor(nombre, edad);

    profesores.push(profesor);
    Persona.pintarPersonaUI(profesores, opcion);
  }
});
