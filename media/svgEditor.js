const target = document.getElementById("target");
const editor = document.getElementById("editor");
const applyBtn = document.getElementById("applyBtn");
const hiddenSvgCode = document.getElementById("hiddenSvgCode");

// Get the "glifo" parameter from the URL
const params = new URLSearchParams(window.location.search);
const glifos = params.get("valor");          // 遲遅迟
let glifo = glifos.split('')[0];

if (glifo) {
const filePath = `${glifo}.svg`;

document.getElementById("glifos").value = glifos;

fetch(filePath)
    .then(response => {
    if (!response.ok) throw new Error("SVG not found");
    return response.text();
    })
    .then(svgText => {
    document.getElementById("target").innerHTML = svgText;
    })
    .catch(err => {
    document.getElementById("target").textContent = "⚠️ Error loading SVG: " + err.message;
    });
} else {
document.getElementById("target").textContent = "⚠️ No 'valor' parameter found in URL.";
}


// Load 0.svg into textarea on startup
fetch(`${glifo}.svg`)
.then(res => res.text())
.then(svgText => {
    editor.value = svgText;
    renderToTarget(svgText);
})
.catch(err => editor.value = `<!-- Falla al cargar svg: ${err} -->`);

// Render function
function renderToTarget(code) {
    target.innerHTML = "";
    const parser = new DOMParser();
    const doc = parser.parseFromString(code, "image/svg+xml");
    const svgEl = doc.documentElement;
    if (!svgEl) return;
    // Copy attributes
    for (const attr of svgEl.attributes) target.setAttribute(attr.name, attr.value);
    // Copy children
    while (svgEl.firstChild) target.appendChild(svgEl.firstChild);
}

// Apply button updates preview
applyBtn.addEventListener("click", () => {
    renderToTarget(editor.value);
});

// Before form submit → copy textarea value into hidden field
document.getElementById("editorForm").addEventListener("submit", () => {
hiddenSvgCode.value = editor.value;
});

const element = document.getElementById('target');
const selector = document.getElementById('box-selector');
document.addEventListener( 'click', (e)=>{
    // console.log(`x: ${e.clientX} y: ${e.clientY}`);
    if (element.contains(e.target)) {
        const textArea = document.getElementById('editor');
        const text = textArea.value;
        // const newText = text.replace(/rect id="a1" x="\d+" y="\d+" width=/g, `rect id="${selector.value}" x="${e.offsetX}" y="${e.offsetY}" width=`);
        const idValue = selector.value; // Replace with your variable
        const regex = new RegExp(`circle id="${idValue}" cx="\\d+" cy="\\d+"`, 'g');
        const newText = text.replace(regex, `circle id="${selector.value}" cx="${e.offsetX}" cy="${e.offsetY}"`);
        textArea.value = newText;
        // console.log(selected);
        renderToTarget(newText);
    } 
} );

function duplicarHiperlink(){
    const text = editor.value;
    const glifo = document.getElementById("glyph").value.trim();
    // const line = `<a href="爱.svg" target="_blank"><rect id="${selector.value}" x="500" y="420" width="50" height="80" fill="#4CAF50" opacity="0.2"/></a>`;
    // editor.value = text + '\n' + line;
    const line = `<a href="${glifo}.svg" target="_blank"><circle id="${selector.value}" cx="200" cy="200" r="20"/></a>`;
    const newText = text.replace('</svg>', `${line}\n</svg>`);
    editor.value = newText;
}