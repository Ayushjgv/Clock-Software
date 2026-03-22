const progressCircle = document.querySelector('.progress');
const text = document.querySelector('.text');

function setProgress(percent) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  const offset = circumference - (percent / 100) * circumference;
  progressCircle.style.strokeDashoffset = offset;

  text.textContent = percent + "%";
}

// Example
setProgress(1);

const allTimeZones = Intl.supportedValuesOf('timeZone');
console.log(allTimeZones);