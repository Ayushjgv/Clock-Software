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
    }
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
    }else{
        display.innerHTML = '';
        if (clockInterval) {
            clearInterval(clockInterval);
            clockInterval = null;
        }
    }

    updateTopbar();
}
