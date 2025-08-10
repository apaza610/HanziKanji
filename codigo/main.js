function miFuncion(){
    let clave = document.getElementById("clave");
    let nombre = clave.value;
    
    // document.getElementById("bolivia").scrollIntoView({ behavior: "smooth" });
    // document.getElementById("principal").src = "media/" + decodeURIComponent(nombre2);
    // document.getElementById("principal").src = "media/" + nombre + ".svg";
    document.getElementById("principal").data = "media/" + nombre + ".svg";

}