let 物 = new XMLHttpRequest();
let glifo, hanziHK, kanjiJP, hanziCN;

function process(operacion){
    llenarTextInputs();
    let img = new Image();
    
    glifo = document.getElementById("glifo").value.trim();      // ya sea hanzi o kanji 
    hanziHK = document.getElementById("clave1").value.trim();
    kanjiJP = document.getElementById("clave2").value.trim();
    hanziCN = document.getElementById("clave3").value.trim();

    // if (hanzi === ""){
    //     alert("olvidaste hanzi/kanji input!!");
    //     return;
    // }
    
    document.querySelectorAll('#cuento span').forEach(span => { //span vacios salen cortados en database
        if (span.textContent.trim() === ''){ span.remove(); }
    });
    let cuento = document.getElementById("cuento").innerHTML.replace(/&nbsp;/g, ' ');    //limpiar string o saldra cortado en database
    // console.log(cuento);

    img.onload = function(){
        document.getElementById("principal").data = `media/${glifo}.svg`;
    }
    img.onerror = function(){
        document.getElementById("principal").data = "media/0.svg";
    }
    img.src = `media/${glifo}.svg`;

    // --------------------------DataBase--------------------------------------
    if(物.readyState == 0 || 物.readyState == 4){
        // 車 = encodeURIComponent(document.getElementById("cuento").innerHTML);
        物.open("GET", `conexionDB.php?glifo=${glifo}&hanziHK=${hanziHK}&kanjiJP=${kanjiJP}&hanziCN=${hanziCN}&operacion=${operacion}&cuento=${cuento}`, true);
        物.onreadystatechange = handleServerResponse;
        物.send(null);
    }
}

function llenarTextInputs(){
    // console.log(fromJapnToTrad('遅'));       //迟遅遲
    // console.log(fromJapnToSimp('遅'));
    if( document.getElementById('clave1').value !== '' ){
        document.getElementById('clave2').value = fromTradToJapn(document.getElementById('clave1').value);
        document.getElementById('clave3').value = fromTradToSimp(document.getElementById('clave1').value);
    }else if(document.getElementById('clave2').value !== ''){
        document.getElementById('clave1').value = fromJapnToTrad(document.getElementById('clave2').value);
        document.getElementById('clave3').value = fromJapnToSimp(document.getElementById('clave2').value);
    }else{
        document.getElementById('clave2').value = fromSimpToJapn(document.getElementById('clave3').value);
        document.getElementById('clave1').value = fromSimpToTrad(document.getElementById('clave3').value);
    }

    if(document.getElementById('clave1').value === document.getElementById('clave2').value){
        document.getElementById('clave2').value = '';
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
    document.getElementById("glifo").value = params.get("cosa");
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
    document.getElementById("firefox").href = `media/svgEditor.html?valor=${glifo}`;
}

function splitLines() {
    let container = document.getElementById("cuento");
    var range = document.createRange();
    range.setStart(container, start);
    range.setEnd(container, end);
    var selectedText = range.getClientRects();
    console.log(selectedText);
}

function limpiarGUI(){
    document.getElementById("clave1").value = "";
    document.getElementById("clave2").value = "";
    document.getElementById("clave3").value = "";
    document.getElementById("cuento").innerHTML = "..";
    document.getElementById("principal").data = "media/0.svg";
}

function refrescar(){
    document.getElementById("principal").data = `media/${hanzi}.svg?t=${Date.now()}`;
}

function copyDivContent() {
    document.getElementById("divContent").value = document.getElementById("cuento").innerHTML; // or .innerText if only text
    document.getElementById("clave2").value = document.getElementById("clave").value;
}

// Convert Traditional Chinese (Hong Kong) to Simplified Chinese (Mainland China)
const fromTradToSimp = OpenCC.Converter({ from: 'hk', to: 'cn' });
const fromTradToJapn = OpenCC.Converter({ from: 'hk', to: 'jp' });
const fromSimpToTrad = OpenCC.Converter({ from: 'cn', to: 'hk' });
const fromSimpToJapn = OpenCC.Converter({ from: 'cn', to: 'jp' });
const fromJapnToTrad = OpenCC.Converter({ from: 'jp', to: 'hk' });
const fromJapnToSimp = OpenCC.Converter({ from: 'jp', to: 'cn' });
// console.log(converter('漢語')); // output: 汉语

function copiarAqui(elemento){
    document.getElementById("clave1").value = '';
    document.getElementById("clave2").value = '';
    document.getElementById("clave3").value = '';
    elemento.value = document.getElementById("glifo").value;
}