

const display = document.querySelector('.display');
const topbar = document.querySelector('.topbar');
const options = document.querySelector('.options');
const selected = document.querySelector('.selected');
const sidebar = document.querySelector('.sidebar');
const sidebarbtns = document.querySelectorAll('.sidebarbtn');


let selectedOption = 'clock';
let clockInterval=null;
let clockHtml='';
let isampm=true;
let region='Asia/Kolkata';
let alarmInterval=null;



let alarms=[];

//load alarms

async function loadAlarms(){
    alarms = await window.api.getAlarms();
    console.log(alarms);
}

loadAlarms();


// console.log(window.api);


//sidebar


sidebarbtns[0].classList.add('active');
checkslected();
sidebarbtns.forEach(btn => {
    btn.addEventListener('click', () => {
        sidebarbtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedOption = btn.id;
        checkslected();
    });
});


//alarm modal
function createAlarmModal() {
    // prevent duplicate modal
    if (document.getElementById('alarm-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'alarm-modal';
    modal.className = 'modal';

    modal.innerHTML = `
        <div class="modal-box">
            <p class="modal-title">⏰ TIME'S UP!</p>
            <p class="modal-subtitle">Your timer has finished.</p>
            <button id="alarm-ok-btn" class="modal-btn">OK, STOP</button>
        </div>
    `;

    document.body.appendChild(modal);
}


//alarm modal

createAlarmModal();

//clock


function updateClock() {
    let time = new Date();
    let now = new Date(time.toLocaleString('en-US', { timeZone: region }));
    let hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    let timeString='';

    if(isampm){
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        timeString = `${hours}:${minutes}:${seconds} ${ampm}`;
        
    }else{
        timeString = `${String(hours).padStart(2, '0')}:${minutes}:${seconds}`;
    }

    display.innerHTML =
        `<div class='clock'>
            <div class='day'> Day : ${days[now.getDay()]}</div>
            <div class='date'> Date:${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}</div>
            <div class='time'> Time: ${timeString}</div>
            <button class='am-pm'>${isampm ? 'Switch to 24H' : 'Switch to 12H'}</button>
        </div>`;

    const ampmbtn = document.querySelector('.am-pm');
 

    ampmbtn.addEventListener('click', () => {
        isampm = !isampm;
        updateClock();
    });

}



//topbar


function updateTopbar(){
    if(selectedOption=='clock'){
        selected.textContent='CLOCK';
        options.innerHTML=`
            <input type="text" placeholder="Search Timezones..." id="search">
            <select name="Options" id="options"></select>
            `;
        switchregion();
        handlesearch();

    }else if(selectedOption=='timer'){
        selected.textContent='TIMER';
        options.innerHTML=`
            <button class ='topbarbtn'>+ ADD TIMER</button>
            `;
    }else if(selectedOption=='stopwatch'){
        selected.textContent='STOPWATCH';
        options.innerHTML=`
            <button class ='topbarbtn'>+ ADD STOPWATCH</button>
            `;
    }else if(selectedOption=='alarm'){
        selected.textContent='ALARM';
        options.innerHTML=`
            <button class ='topbarbtn'>+ ADD ALARM</button>
            `;
        handleAlarm();
    }
}



/* ================= TIMER ================= */

let timerInterval = null;
let timerSeconds = 0;
let timerMax = 0;
let timerRunning = false;

function rendertimers() {
  display.innerHTML = `
    <h1>⏱ Timer</h1>

    <div class="inputs">
      <input type="number" id="t-min" placeholder="Min" min="0">
      <input type="number" id="t-sec" placeholder="Sec" min="0">
    </div>

    <div class="buttons">
      <button onclick="startTimer()">Start</button>
      <button onclick="pauseTimer()">Pause</button>
      <button onclick="resetTimer()">Reset</button>
    </div>

    <div class="circletimer">
      <svg width="200" height="200">
        <circle cx="100" cy="100" r="90" class="bg"></circle>
        <circle cx="100" cy="100" r="90" class="progress" id="timerCircle"></circle>
      </svg>
      <div class="time-display" id="timerDisplay">00:00</div>
    </div>
  `;

  updateTimerDisplay();
}

function updateTimerDisplay() {
  const min = Math.floor(timerSeconds / 60);
  const sec = timerSeconds % 60;

  document.querySelector("#timerDisplay").innerText =
    String(min).padStart(2, "0") + ":" +
    String(sec).padStart(2, "0");
}

function startTimer() {
  if (timerRunning) return;

  const min = parseInt(document.querySelector("#t-min").value) || 0;
  const sec = parseInt(document.querySelector("#t-sec").value) || 0;

  if (timerSeconds === 0) {
    timerSeconds = min * 60 + sec;
    timerMax = timerSeconds;
  }

  if (timerSeconds <= 0) return;

  timerRunning = true;

  timerInterval = setInterval(() => {
        if (timerSeconds > 0) {
            timerSeconds--;
            updateTimerDisplay();
            updateTimerCircle();
        } else {
            clearInterval(timerInterval);
            timerRunning = false;
            // alert("Time's up!");
            showAlarmModal();
        }
    }, 1000);

}

// function showAlarmModal() {
//     createAlarmModal();

//     const modal = document.getElementById('alarm-modal');

//     modal.classList.add('show');

//     triggerAlarm();

//     if (alarmInterval) clearInterval(alarmInterval);

//     alarmInterval = setInterval(() => {
//         triggerAlarm();
//     }, 1000);

//     const okBtn = document.getElementById('alarm-ok-btn');

//     okBtn.onclick = () => {
//         clearInterval(alarmInterval);
//         alarmInterval = null;

//         stopAlarm?.(); // safe call

//         modal.classList.remove('show'); // 👈 THIS WILL WORK NOW
//     };
// }

function showAlarmModal(alarm) {
    createAlarmModal();

    const modal = document.getElementById('alarm-modal');
    const okBtn = document.getElementById('alarm-ok-btn');

    modal.classList.add('show');

    // 🔊 start continuous alarm
    triggerAlarm();

    // ✅ STOP BUTTON
    okBtn.onclick = () => {
        stopAlarm(); // stop sound

        modal.classList.remove('show');

        // 🔄 allow alarm to trigger again in future
        if (alarm) {
            alarm.triggered = false;
        }
    };
}


function pauseTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
}

function resetTimer() {
  clearInterval(timerInterval);
  timerSeconds = 0;
  timerMax = 0;
  timerRunning = false;
  updateTimerDisplay();

  const circle = document.querySelector("#timerCircle");
  if (circle) circle.style.strokeDashoffset = 565;
}

function updateTimerCircle() {
  const circle = document.querySelector("#timerCircle");
  if (!circle || timerMax === 0) return;

  const circumference = 2 * Math.PI * 90;

  let progress = timerSeconds / timerMax;
  let offset = circumference * (1 - progress);

  circle.style.strokeDasharray = circumference;
  circle.style.strokeDashoffset = offset;
}


/* ================= STOPWATCH ================= */

let swInterval = null;
let swMs = 0;
let swRunning = false;

function renderstopwatch() {
  display.innerHTML = `
    <h1>⏱ Stopwatch</h1>

    <div class="circlestopwatch">
      <svg width="220" height="220">
        <circle cx="110" cy="110" r="100" class="bg"></circle>
        <circle cx="110" cy="110" r="100" class="progress" id="swCircle"></circle>
      </svg>
      <div class="time-display" id="swDisplay">00:00:00</div>
    </div>

    <div class="buttons">
      <button onclick="startSW()">Start</button>
      <button onclick="pauseSW()">Pause</button>
      <button onclick="resetSW()">Reset</button>
    </div>
  `;

  updateSWDisplay();
}

function updateSWDisplay() {
  const ms = swMs % 100;
  const totalSec = Math.floor(swMs / 100);
  const sec = totalSec % 60;
  const min = Math.floor(totalSec / 60);

  document.querySelector("#swDisplay").innerText =
    String(min).padStart(2, "0") + ":" +
    String(sec).padStart(2, "0") + ":" +
    String(ms).padStart(2, "0");

  updateSWCircle();
}

function startSW() {
  if (swRunning) return;

  swRunning = true;

  swInterval = setInterval(() => {
    swMs++;
    updateSWDisplay();
  }, 10);
}

function pauseSW() {
  clearInterval(swInterval);
  swRunning = false;
}

function resetSW() {
  clearInterval(swInterval);
  swRunning = false;
  swMs = 0;
  updateSWDisplay();

  const circle = document.querySelector("#swCircle");
  if (circle) circle.style.strokeDashoffset = 628;
}

function updateSWCircle() {
  const circle = document.querySelector("#swCircle");
  if (!circle) return;

  const circumference = 2 * Math.PI * 100;

  let progress = (swMs % 6000) / 6000;
  let offset = circumference * (1 - progress);

  circle.style.strokeDasharray = circumference;
  circle.style.strokeDashoffset = offset;
}
//buttons


function switchregion(){
    const optionsbtn = options.querySelector('#options');
    const allTimeZones = Intl.supportedValuesOf('timeZone');
    allTimeZones.forEach(zone => {
        const option = document.createElement('option');
        option.value = zone;
        option.textContent = zone;
        if(zone===region){
            option.selected=true;
        }
        optionsbtn.appendChild(option);
    });
    const option = document.createElement('option');
    option.value = 'Asia/Kolkata';
    option.textContent = 'Asia/Kolkata';

    optionsbtn.appendChild(option);

    optionsbtn.addEventListener('change', (e) => {
        region = e.target.value;
        updateClock();
    });
    optionsbtn.value=region;
    region = optionsbtn.value;
}

function handlesearch(){
    const searchInput = options.querySelector('#search');
    const optionsbtn = options.querySelector('#options');
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const allTimeZones = Intl.supportedValuesOf('timeZone');
        optionsbtn.innerHTML = '';
        allTimeZones.forEach(zone => {
            if (zone.toLowerCase().includes(searchTerm)) {
                const option = document.createElement('option');
                option.value = zone;
                option.textContent = zone;
                if(zone===region){
                    option.selected=true;
                }
                optionsbtn.appendChild(option);
            }
        });

        const option = document.createElement('option');
        option.value = 'Asia/Kolkata';
        option.textContent = 'Asia/Kolkata';
        if('Asia/Kolkata'.toLowerCase().includes(searchTerm)){
            option.selected=true;
        }
        optionsbtn.appendChild(option);
        region = optionsbtn.value;

    });
}

function handleAlarm() {
    const alarmbtn = options.querySelector('.topbarbtn');

    alarmbtn.onclick = async () => {

        const alarm ={
            time: "",
            active: false,
            triggered: false
        }

        alarms.push(alarm);
        renderAlarms();

        try {
            const res = await window.api.clearAlarms();
            // console.log(res);
            await window.api.addAlarm({...alarms});
        } catch (error) {
            console.log(error);
        }
    };

    if (!alarmInterval) {
        alarmInterval = setInterval(() => {
            const now = new Date();
            const currentTime = now.toTimeString().slice(0, 5); // HH:MM

            alarms.forEach(alarm => {
                if (alarm.active && alarm.time === currentTime && !alarm.triggered) {
                    alarm.triggered = true;

                    showAlarmModal();
                }

                if (alarm.time !== currentTime) {
                    alarm.triggered = false;
                }

            });

        }, 1000);
    }
}

async function renderAlarms() {
    const display = document.querySelector('.display');
    display.innerHTML = ""; // clear UI


    try {
        alarms = await window.api.getAlarms();
        console.log(alarms);
    } catch (error) {
        console.log(error);
    }


    alarms.forEach((alarm, index) => {
        const div = document.createElement('div');
        div.classList.add('alarm-item');

        div.innerHTML = `
            <input type="time" class="alarm-time" value="${alarm.time}">
            <input type="checkbox" class="alarmcheckbox" ${alarm.active ? "checked" : ""}> On/Off
            <button class="alarmbtn delete-alarm">Delete</button>
        `;

        const timeInput = div.querySelector('.alarm-time');
        const checkbox = div.querySelector('.alarmcheckbox');

        // update state
        timeInput.addEventListener('change', async () => {
            alarms[index].time = timeInput.value;
            const res = await window.api.clearAlarms();
            await window.api.addAlarm({...alarms});
        });

        checkbox.addEventListener('change', async () => {
            alarms[index].active = checkbox.checked;
            const res = await window.api.clearAlarms();
            await window.api.addAlarm({...alarms});
        });

        div.querySelector('.delete-alarm').addEventListener('click', async () => {
            alarms.splice(index, 1);
            renderAlarms();
            const res = await window.api.clearAlarms();
            await window.api.addAlarm({...alarms});
        });

        display.appendChild(div);
    });
}


let alarmAudio = new Audio("fahhhhh.mp3");

function triggerAlarm() {
    alarmAudio.loop = true;
    alarmAudio.play();
}

function stopAlarm() {
    alarmAudio.pause();
    alarmAudio.currentTime = 0;
}

//check selected

function checkslected() {
    if (selectedOption === 'clock') {
        if (clockInterval) {
            clearInterval(clockInterval);
            clockInterval = null;
        }
        display.innerHTML = '';
        updateClock();
        clockInterval=setInterval(() => { updateClock(); }, 1000);
    }else if(selectedOption === 'alarm'){
        clearInterval(clockInterval);
        clockInterval = null;
        renderAlarms();
    }else if(selectedOption === 'timer'){
        display.innerHTML = '';
        if (clockInterval) {
            clearInterval(clockInterval);
            clockInterval = null;
        }
        rendertimers();
    }
    else{
        display.innerHTML = '';
        if (clockInterval) {
            clearInterval(clockInterval);
            clockInterval = null;
        }
        renderstopwatch();
    }

    updateTopbar();
}


//database




