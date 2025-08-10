function miFuncion(){
    let clave = document.getElementById("clave");
    let nombre = clave.value;
    console.log("el valor: " + nombre);
    let nombre2 = nombre + ".svg";
    console.log("el valor2: " + nombre2);
    console.log("el valor2: " + encodeURIComponent(nombre));
    
    // document.getElementById("bolivia").scrollIntoView({ behavior: "smooth" });
    // document.getElementById("principal").src = "media/" + decodeURIComponent(nombre2);
    document.getElementById("principal").src = "media/" + nombre + ".svg";

}