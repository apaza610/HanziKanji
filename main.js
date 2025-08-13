let 物 = new XMLHttpRequest();

function process(operacion){
    let img = new Image();
    let hanzi = document.getElementById("clave").value;
    
    document.querySelectorAll('#cuento span').forEach(span => { //span vacios salen cortados en database
        if (span.textContent.trim() === ''){
            span.remove();
        }
    });
    let cuento = document.getElementById("cuento").innerHTML;
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
            document.getElementById("cuento").innerHTML = message;
        }else{
            alert("algo ha fallado");
        }
    }
}

window.setTimeout(()=>{
    let params = new URLSearchParams(window.location.search);
    document.getElementById("clave").value = params.get("cosa");
}, 500);

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

// function mayusculas(){
//     const selection = window.getSelection();
//     if (!selection.rangeCount) return;

//     const range = selection.getRangeAt(0);
//     const selectedText = selection.toString();
//     const upperText = selectedText.toUpperCase();

//     // Replace the selected text with the uppercase version
//     range.deleteContents();
//     range.insertNode(document.createTextNode(upperText));
// }