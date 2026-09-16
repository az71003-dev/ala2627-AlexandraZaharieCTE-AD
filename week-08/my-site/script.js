const bottle = document.querySelector('#bottle');
const bottleName = document.querySelector('#bottle-name');
const designStatus = document.querySelector('#design-status');

const designs = {
  classic: {
    name: 'Classic',
    body: '#dfeafc',
    accent: '#1d3160',
    cap: '#f5c842',
    label: '#ffffff',
    handle: 'rgba(12, 20, 35, 0.45)'
  },
  sunset: {
    name: 'Sunset',
    body: '#f7b39c',
    accent: '#9c2d42',
    cap: '#f7d776',
    label: '#fff6ea',
    handle: 'rgba(130, 50, 40, 0.55)'
  },
  forest: {
    name: 'Forest',
    body: '#a7d3b3',
    accent: '#1d4d3e',
    cap: '#d6ba7c',
    label: '#edf8f0',
    handle: 'rgba(12, 52, 42, 0.55)'
  }
};

const lidStyles = {
  carry: 'Carry lid',
  sip: 'Sip lid',
  straw: 'Straw lid'
};

const sizeMap = {
  18: '18 oz',
  24: '24 oz',
  32: '32 oz'
};

let activeDesign = 'classic';
let activeLid = 'straw';
let activeSize = '24';

function updateBottle() {
  const design = designs[activeDesign];

  bottle.style.setProperty('--body-color', design.body);
  bottle.style.setProperty('--brand-color', design.accent);
  bottle.style.setProperty('--cap-color', design.cap);
  bottle.style.setProperty('--label-color', design.label);
  bottle.style.setProperty('--handle-color', design.handle);

  bottle.dataset.lid = activeLid;
  bottle.dataset.size = activeSize;
  bottleName.textContent = design.name;

  designStatus.textContent = `${design.name} design • ${lidStyles[activeLid]} • ${sizeMap[activeSize]}`;
}

document.querySelectorAll('[data-design]').forEach((button) => {
  button.addEventListener('click', () => {
    activeDesign = button.dataset.design;
    document.querySelectorAll('[data-design]').forEach((item) => item.classList.toggle('active', item === button));
    updateBottle();
  });
});

document.querySelectorAll('[data-lid]').forEach((button) => {
  button.addEventListener('click', () => {
    activeLid = button.dataset.lid;
    document.querySelectorAll('[data-lid]').forEach((item) => item.classList.toggle('active', item === button));
    updateBottle();
  });
});

document.querySelectorAll('[data-size]').forEach((button) => {
  button.addEventListener('click', () => {
    activeSize = button.dataset.size;
    document.querySelectorAll('[data-size]').forEach((item) => item.classList.toggle('active', item === button));
    updateBottle();
  });
});

updateBottle();

