const scene1 = document.getElementById("scene1");
const scene2 = document.getElementById("scene2");

const guyWrap = document.getElementById("guy-wrap");
const guy = document.getElementById("guy");
const hatWrap = document.getElementById("hat-wrap");
const doorWrap = document.getElementById("door-wrap");

const guy2Wrap = document.getElementById("guy2-wrap");
const carWrap = document.getElementById("car-wrap");
const car = document.getElementById("car");

// ---------- Scene 1 ----------

let hasHat = false;

hatWrap.addEventListener("click", () => {
  hasHat = true;
  guy.src = "assets/diatom-guy-with-hat.png";
  guy.classList.add("bob");
  hatWrap.classList.add("hidden");
  doorWrap.classList.remove("hidden");
  guyWrap.classList.add("draggable");
});

// Dragging the guy (mouse + touch via pointer events)
let drag = null;

guyWrap.addEventListener("pointerdown", (e) => {
  if (!hasHat) return;
  e.preventDefault();
  const rect = guyWrap.getBoundingClientRect();
  drag = {
    offsetX: e.clientX - rect.left,
    offsetY: e.clientY - rect.top,
    startLeft: rect.left,
    startTop: rect.top,
  };
  // Switch from bottom/left CSS anchoring to explicit pixel coordinates
  guyWrap.style.left = rect.left + "px";
  guyWrap.style.top = rect.top + "px";
  guyWrap.style.bottom = "auto";
  guyWrap.classList.add("dragging");
  guyWrap.setPointerCapture(e.pointerId);
});

guyWrap.addEventListener("pointermove", (e) => {
  if (!drag) return;
  guyWrap.style.left = e.clientX - drag.offsetX + "px";
  guyWrap.style.top = e.clientY - drag.offsetY + "px";
  doorWrap.classList.toggle("target", overlaps(guyWrap, doorWrap));
});

function endDrag() {
  if (!drag) return;
  const reachedDoor = overlaps(guyWrap, doorWrap);
  guyWrap.classList.remove("dragging");
  doorWrap.classList.remove("target");
  if (reachedDoor) {
    drag = null;
    startScene2();
    return;
  }
  // Not on the door: snap back to where the drag began
  guyWrap.style.left = drag.startLeft + "px";
  guyWrap.style.top = drag.startTop + "px";
  drag = null;
}

guyWrap.addEventListener("pointerup", endDrag);
guyWrap.addEventListener("pointercancel", endDrag);

function overlaps(a, b) {
  const r1 = a.getBoundingClientRect();
  const r2 = b.getBoundingClientRect();
  return !(
    r1.right < r2.left ||
    r1.left > r2.right ||
    r1.bottom < r2.top ||
    r1.top > r2.bottom
  );
}

// ---------- Scene 2 ----------

function startScene2() {
  scene1.classList.add("hidden");
  scene2.classList.remove("hidden");
}

let carClicked = false;

carWrap.addEventListener("click", () => {
  if (carClicked) return;
  carClicked = true;

  guy2Wrap.classList.add("hidden");
  car.src = "assets/car-with-driver.png";
  car.classList.add("shake");

  // After a second, the car drives off to the right
  setTimeout(() => {
    carWrap.classList.add("driving");
  }, 1000);
});
