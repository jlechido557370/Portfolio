const canvas = document.getElementById("canvasdonut2");
const ctx = canvas.getContext("2d");

/* =========================
   State
   ========================= */
let A = 1;
let B = 1;
let mode = "donut"; // "donut" | "cube"

/* =========================
   Resize
   ========================= */
function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

/* =========================
   Logo Click Toggle
   ========================= */
const logo = document.querySelector(".navbar-logo");

logo.addEventListener("click", (e) => {
  e.preventDefault();

  // 1️⃣ Scroll back to the top / welcome section
  document.getElementById("welcome").scrollIntoView({
    behavior: "smooth"
  });

  // 2️⃣ Toggle background shape
  mode = mode === "donut" ? "cube" : "donut";

  // 3️⃣ Reset rotation so it feels fresh
  A = 1;
  B = 1;
});


/* =========================
   Render Loop
   ========================= */
function render() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  A += 0.006;
  B += 0.008;

  if (mode === "donut") {
    drawDonut();
  } else {
    drawCube();
  }

  requestAnimationFrame(render);
}

/* =========================
   DONUT
   ========================= */
function drawDonut() {
  const cA = Math.cos(A), sA = Math.sin(A);
  const cB = Math.cos(B), sB = Math.sin(B);

  for (let j = 0; j < Math.PI * 2; j += 0.3) {
    const ct = Math.cos(j), st = Math.sin(j);

    for (let i = 0; i < Math.PI * 2; i += 0.1) {
      const sp = Math.sin(i), cp = Math.cos(i);

      const ox = 2 + ct;
      const oy = st;

      const x = ox * (cB * cp + sA * sB * sp) - oy * cA * sB;
      const y = ox * (sB * cp - sA * cB * sp) + oy * cA * cB;
      const ooz = 1 / (5 + cA * ox * sp + sA * oy);

      const xp = canvas.width / 2 + 1600 * ooz * x;
      const yp = canvas.height / 2 - 1200 * ooz * y;

      const L =
        0.9 *
        (cp * ct * sB -
          cA * ct * sp -
          sA * st +
          cB * (cA * st - ct * sA * sp));

      if (L > 0) {
        ctx.fillStyle = `rgba(255,255,255,${L})`;
        ctx.fillRect(xp, yp, 4, 4);
      }
    }
  }
}

/* =========================
   CUBE
   ========================= */
function drawCube() {
  const cA = Math.cos(A), sA = Math.sin(A);
  const cB = Math.cos(B), sB = Math.sin(B);
  const size = 1.5;

  for (let x = -size; x <= size; x += 0.2) {
    for (let y = -size; y <= size; y += 0.2) {
      drawPoint(x, y, size);
      drawPoint(x, y, -size);
      drawPoint(x, size, y);
      drawPoint(x, -size, y);
      drawPoint(size, x, y);
      drawPoint(-size, x, y);
    }
  }

  function drawPoint(x, y, z) {
    let dx = x * cB + z * sB;
    let dz = -x * sB + z * cB;

    let dy = y * cA - dz * sA;
    dz = y * sA + dz * cA;

    const ooz = 1 / (4 + dz);
    const xp = canvas.width / 2 + 1400 * ooz * dx;
    const yp = canvas.height / 2 - 1100 * ooz * dy;

    if (ooz > 0) {
      ctx.fillStyle = `rgba(255,255,255,${ooz * 1.5})`;
      ctx.fillRect(xp, yp, 4, 4);
    }
  }
}

render();
