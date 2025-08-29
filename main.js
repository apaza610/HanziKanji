let 物 = new XMLHttpRequest();
let hanzi;

function process(operacion){
    let img = new Image();
    
    switch(parseInt(
        document.querySelector('input[name="elector"]:checked').value
    )){
        case 0:
            hanzi = document.getElementById("clave1").value.trim();
            break;
        case 1:
            hanzi = document.getElementById("clave2").value.trim();
            break;
        case 2:
            hanzi = document.getElementById("clave3").value.trim();
            break;
    }

    if (hanzi === ""){
        alert("olvidaste hanzi/kanji input!!");
        return;
    }
    
    document.querySelectorAll('#cuento span').forEach(span => { //span vacios salen cortados en database
        if (span.textContent.trim() === ''){ span.remove(); }
    });
    let cuento = document.getElementById("cuento").innerHTML.replace(/&nbsp;/g, ' ');    //limpiar string o saldra cortado en database
    // console.log(cuento);

    img.onload = function(){
        document.getElementById("principal").data = `media/${hanzi}.svg`;
    }
    img.onerror = function(){
        document.getElementById("principal").data = "media/0.svg";
    }
    img.src = `media/${hanzi}.svg`;

    // --------------------------DataBase--------------------------------------
    if(物.readyState == 0 || 物.readyState == 4){
        // 車 = encodeURIComponent(document.getElementById("cuento").innerHTML);
        物.open("GET", `conexionDB.php?kanji=${hanzi}&operacion=${operacion}&cuento=${cuento}`, true);
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
            // document.getElementById("cuento").innerHTML = message;
            document.getElementById("cuento").innerHTML = message === undefined ? ".." : message;
        }else{
            alert("algo ha fallado");
        }
    }
}

window.setTimeout(()=>{
    let params = new URLSearchParams(window.location.search);
    document.getElementById("clave1").value = params.get("cosa");
}, 300);

window.setTimeout(()=>{         // si vienes de ANKI busqueda sera automatica
    document.getElementById("btnLeer").click();
}, 600);

function estilizar(claseDeseada){
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    if (selectedText.trim() === "") return;

    // Create the italic element
    // const italic = document.createElement("i");
    // italic.textContent = selectedText;

    // Create a span with the desired class
    const span = document.createElement("span");
    span.className = claseDeseada;
    span.textContent = selectedText;

    // Replace the selected text with the italic element
    range.deleteContents();
    range.insertNode(span);

    // Optional: clear the selection
    selection.removeAllRanges();
}

function mayusculas(){
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();
    const upperText = selectedText.toUpperCase();

    // Replace the selected text with the uppercase version
    range.deleteContents();
    range.insertNode(document.createTextNode(upperText));
    estilizar('f');
}

function abrirSVG(){
    document.getElementById("firefox").href = `media/${hanzi}.svg`;
}

function splitLines() {
    let container = document.getElementById("cuento");
    var range = document.createRange();
    range.setStart(container, start);
    range.setEnd(container, end);
    var selectedText = range.getClientRects();
    console.log(selectedText);
}