const healthBarText = document.getElementById("healthBarText");
const healthBarInner = document.getElementById("healthBarInner");

let healthBarState = {
  healthBarSectionGap: 4,
  maxHealth: 3,
  currentHealth: 3
};
renderHealthBar(healthBarState);

function renderHealthBar(healthBarState) {
  renderHealthBarSections(healthBarState);
  renderHealthBarText(healthBarState);
}

function renderHealthBarSections(healthBarState) {
  var percentage = 100 / healthBarState.maxHealth;
  healthBarInner.innerHTML = "";
  const sectionTemplate = `<path class="health-bar__section" d="M0 0" fill="#fff" style="transform: rotate(10deg)" />`;
  const radius = 100;
  const angle = (percentage / 100) * 360 - healthBarState.healthBarSectionGap;
  const radians = (angle - 180) * (Math.PI / 180);
  const x = radius * Math.cos(radians);
  const y = radius * Math.sin(radians);
  const largeArc = percentage > 50 ? 1 : 0;
  const d = `M0 0 -100 0 A${radius} ${radius} 0 ${largeArc} 1 ${x} ${y} Z`;

  for (let i = 0; i < healthBarState.currentHealth; i++) {
    const healthBarSection = createHealthBarSectionElement(i);
    healthBarSection.setAttribute("d", d);
    healthBarInner.appendChild(healthBarSection);
  }
}

function createHealthBarSectionElement(index) {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("class", "health-bar__section");
  path.setAttribute("fill", "#fff");
  path.setAttribute("transform", `rotate(${getSectionRotation(index)}, 0, 0)`);

  return path;
}

function getSectionRotation(index) {
  return (360 / healthBarState.maxHealth) * index;
}

function renderHealthBarText(healthBarState) {
  healthBarText.innerHTML = healthBarState.currentHealth;
}