const target = document.getElementById("target");
const editor = document.getElementById("editor");
const applyBtn = document.getElementById("applyBtn");
const hiddenSvgCode = document.getElementById("hiddenSvgCode");

// Get the "valor" parameter from the URL
const params = new URLSearchParams(window.location.search);
const valor = params.get("valor");

if (valor) {
const filePath = `${valor}.svg`;

document.getElementById("valor").value = valor;

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
fetch(`${valor}.svg`)
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
document.addEventListener( 'click', (e)=>{
    // console.log(`x: ${e.clientX} y: ${e.clientY}`);
    if (element.contains(e.target)) {
        document.getElementById("coordenadas").innerText = `x="${e.offsetX}" y="${e.offsetY}"`;
        // console.log(`X: ${e.offsetX}, Y: ${e.offsetY}`);

        const selector = document.getElementById('box-selector');
        // const selected = selector.value;
        const textArea = document.getElementById('editor');
        const text = textArea.value;
        // const newText = text.replace(/rect id="a1" x="\d+" y="\d+" width=/g, `rect id="${selector.value}" x="${e.offsetX}" y="${e.offsetY}" width=`);
        const idValue = selector.value; // Replace with your variable
        const regex = new RegExp(`rect id="${idValue}" x="\\d+" y="\\d+" width=`, 'g');
        const newText = text.replace(regex, `rect id="${selector.value}" x="${e.offsetX}" y="${e.offsetY}" width=`);
        textArea.value = newText;
        // console.log(selected);
    } 
} );

// document.querySelectorAll('a').forEach((link) => {
//   link.addEventListener('click', (e) => {
//     e.preventDefault();
//     const child = link.children[0];
//     if (child && child.id) {
//       console.log(child.id);
//     }
//   });
// });