function miFuncion(){
    let clave = document.getElementById("clave");
    let nombre = clave.value;
    let img = new Image();

    img.onload = function(){
        document.getElementById("principal").data = `media/${nombre}.svg`;
    }
    img.onerror = function(){
        document.getElementById("principal").data = "media/0.svg";
    }
    img.src = `media/${nombre}.svg`;
    
    // document.getElementById("bolivia").scrollIntoView({ behavior: "smooth" });
    // document.getElementById("principal").src = "media/" + decodeURIComponent(nombre2);
    // document.getElementById("principal").src = "media/" + nombre + ".svg";
    

}