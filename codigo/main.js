let 物 = new XMLHttpRequest();

function process(operacion){
    let img = new Image();
    let hanzi = document.getElementById("clave").value;
    let cuento = document.getElementById("cuento").innerText;

    img.onload = function(){
        document.getElementById("principal").data = `media/${hanzi}.svg`;
    }
    img.onerror = function(){
        document.getElementById("principal").data = "media/0.svg";
    }
    img.src = `media/${hanzi}.svg`;

    // --------------------------DataBase--------------------------------------
    if(物.readyState == 0 || 物.readyState == 4){
        車 = encodeURIComponent(document.getElementById("cuento").innerText);
        物.open("GET", `codigo/conexionDB.php?kanji=${hanzi}&operacion=${operacion}&cuento=${cuento}`, true);
        物.onreadystatechange = handleServerResponse;
        物.send(null);
    }
}

function handleServerResponse(){
    if(物.readyState == 4){
        if(物.status == 200){      // comunicacion session is OK
            xmlResponse = 物.responseXML;
            xmlDocumentElement = xmlResponse.documentElement;
            message = xmlDocumentElement.firstChild.data;
            document.getElementById("cuento").innerHTML = message;
        }else{
            alert("algo ha fallado");
        }
    }
}