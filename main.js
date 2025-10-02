let 物 = new XMLHttpRequest();
let glifo, hanziHK, kanjiJP, hanziCN;
let trad1, trad2, trad3, rads1, rads2, rads3;
let puedeCopiar = true;         // de glyph a clave1 o 2 o 3
let iEsimo = 1;

function process(operacion, indice){
    iEsimo = indice;
    let img = new Image();
    
    glifo = document.getElementById("glifo").value.trim();      // ya sea hanzi o kanji 
    hanziHK = document.getElementById("clave1").value.trim();
    kanjiJP = document.getElementById("clave2").value.trim();
    hanziCN = document.getElementById("clave3").value.trim();

    trad1 = document.getElementById("trad1").value;
    trad2 = document.getElementById("trad2").value;
    trad3 = document.getElementById("trad3").value;
    rads1 = document.getElementById("rads1").value;
    rads2 = document.getElementById("rads2").value;
    rads3 = document.getElementById("rads3").value;

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
        switch (iEsimo) {
            case 1:
                物.open("GET", `conexionDB.php?glifo=${hanziHK}&operacion=${operacion}&cuento=${cuento}&trad=${trad1}&radi=${rads1}`, true);
                break;
            case 2:
                物.open("GET", `conexionDB.php?glifo=${kanjiJP}&operacion=${operacion}&cuento=${cuento}&trad=${trad2}&radi=${rads2}`, true);
                break;
            case 3:
                物.open("GET", `conexionDB.php?glifo=${hanziCN}&operacion=${operacion}&cuento=${cuento}&trad=${trad3}&radi=${rads3}`, true);
                break;
        }
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
            let partes = message.split('|');
            
            switch (iEsimo) {
                case 1:
                    document.getElementById('trad1').value = partes[0];
                    document.getElementById('rads1').value = partes[1];
                    break;
                case 2:
                    document.getElementById('trad2').value = partes[0];
                    document.getElementById('rads2').value = partes[1];
                    break;
                case 3:
                    document.getElementById('trad3').value = partes[0];
                    document.getElementById('rads3').value = partes[1];
                    break;
                default:
                    break;
            }
            document.getElementById("cuento").innerHTML = partes[2];
            updateAnclas();

            // if(glifo === hanziHK){
            // }else if(glifo === kanjiJP){
            //     document.getElementById("cuento").innerHTML = message === undefined ? ".." : partes[5];
            // }else{
            //     document.getElementById("cuento").innerHTML = message === undefined ? ".." : partes[8];
            // }
        }else{
            alert("algo ha fallado");
        }
    }
}

window.setTimeout(()=>{
    let params = new URLSearchParams(window.location.search);
    document.getElementById("glifo").value = params.get("cosa");
    document.getElementById("clave3").value = params.get("cosa");
}, 500);

// window.setTimeout(()=>{         // si vienes de ANKI busqueda sera automatica
//     document.getElementById("btnLeer").click();
// }, 600);

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
    const cadena = hanziHK + kanjiJP + hanziCN;
    document.getElementById("firefox").href = `media/svgEditor.html?valor=${cadena}`;
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
    document.getElementById("trad1").value = "";
    document.getElementById("trad2").value = "";
    document.getElementById("trad3").value = "";
    document.getElementById("rads1").value = "";
    document.getElementById("rads2").value = "";
    document.getElementById("rads3").value = "";
    updateAnclas();
    puedeCopiar = true;
}

function refrescar(){
    document.getElementById("principal").data = `media/${glifo}.svg?t=${Date.now()}`;
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
    if (puedeCopiar) {
        document.getElementById("clave1").value = '';
        document.getElementById("clave2").value = '';
        document.getElementById("clave3").value = '';
        elemento.value = document.getElementById("glifo").value;
    }
    puedeCopiar = false;
}

function averiguarFormas() {
    const c1 = document.getElementById('clave1');
    const c2 = document.getElementById('clave2');
    const c3 = document.getElementById('clave3');

    let v1, v2, v3;

    // Use if-else-if to prevent overwriting values.
    // The first non-empty field determines the values for the others.
    if (c1.value !== '') {
        v1 = c1.value;
        v2 = fromTradToJapn(c1.value);
        v3 = fromTradToSimp(c1.value);
    } else if (c2.value !== '') {
        v1 = fromJapnToTrad(c2.value);
        v2 = c2.value;
        v3 = fromJapnToSimp(c2.value);
    } else if (c3.value !== '') {
        v1 = fromSimpToTrad(c3.value);
        v2 = fromSimpToJapn(c3.value);
        v3 = c3.value;
    } else {
        return; // All fields are empty.
    }

    // Use a Set to track seen glyphs and avoid duplicates.
    const seenGlyphs = new Set();

    c1.value = v1;
    seenGlyphs.add(v1);

    if (seenGlyphs.has(v2)) {
        c2.value = '';
    } else {
        c2.value = v2;
        seenGlyphs.add(v2);
    }

    if (seenGlyphs.has(v3)) {
        c3.value = '';
    } else {
        c3.value = v3;
        seenGlyphs.add(v3);
    }

    // The old alert logic is no longer valid as we are removing duplicates.
}

// function llenarTextInputs(){
//     // console.log(fromJapnToTrad('遅'));       //迟遅遲
//     // console.log(fromJapnToSimp('遅'));
// }

function updateAnclas() {
    updateAncla('rads1', 'ancla1');
    updateAncla('rads2', 'ancla2');
    updateAncla('rads3', 'ancla3');
}

function updateAncla(radId, anclaId) {
    const radInput = document.getElementById(radId);
    const anclaTd = document.getElementById(anclaId);

    if (radInput && anclaTd) {
        const radValue = radInput.value;
        let newContent = '';
        for (const char of radValue) {
            newContent += `.<a href="media/${char}.svg" target="principal">${char}</a>.`;
        }
        anclaTd.innerHTML = newContent;
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('rads1').addEventListener('input', () => updateAncla('rads1', 'ancla1'));
    document.getElementById('rads2').addEventListener('input', () => updateAncla('rads2', 'ancla2'));
    document.getElementById('rads3').addEventListener('input', () => updateAncla('rads3', 'ancla3'));
});