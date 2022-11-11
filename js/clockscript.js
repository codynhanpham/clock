let ShowLog = false;

// A message from me to you...
console.log("%c Hi, nerd ;)", "font-size: 36px; font-weight: bold; color: #574F75;");
console.log("\nCONTROLS AND STUFF (You probably won't see this...):\n \n1. Press F or Double-click to toggle Fullscreen.\n2. Press Spacebar or Right-click to toggle showing Date. The Time will always stay on, that's the point .-.\n3. Use the Up ↑ and Down ↓ arrow keys or the mouse's Scollwheel to change the opacity/brightness of the page.\n ");

console.log("\nYou can set `ShowLog = true` to see a bunch of shits poppin' in the console if you want, for whatever reason.\n ");
console.log("Here, copy paste and run the line below");
console.log("%cShowLog = true", "font-size: 24px; font-weight: bold; color: #F67D42;");
console.log("%c \nOh and if you see something like\n \n| NotAllowedError, Failed to execute 'request' on 'WakeLock': The requesting page is not visible |\n \nThat is probably cuz' you opened this page in a new tab or idk the page was not in focus when loaded. It is fixed the moment you switch to see this tab so just ignore that warning.\n ", "font-size: 12px; font-weight: bold; color: #4A4FB6;");

// HUGE CONTROL INFO
console.log("%c CONTROLS AND STUFF:", "font-size: 28px; font-weight: bold;");
console.log("%c 1. Press F or Double-click to toggle Fullscreen.", "font-size: 16px; font-weight: bold;");
console.log("%c 2. Press Spacebar or Right-click to toggle showing Date. The Time will always stay on, that's the point.", "font-size: 16px; font-weight: bold;");
console.log("%c 3. Use the Up ↑ and Down ↓ arrow keys or the mouse's Scollwheel to change the opacity/brightness of the page.", "font-size: 16px; font-weight: bold;");
console.log("The brightness range is 5% - 100%. Each keypress or scrollwheel tick will change the brightness by 5%.");

function Log(logString) {
    if (ShowLog) {
        console.log(logString);
    }
}


// Main clock code by Jason Lee Wilson @ https://codepen.io/jasonleewilson/pen/gPrxwX
Number.prototype.pad = function(n) {
    for (var r = this.toString(); r.length < n; r = 0 + r);
    return r;
};

function updateClock() {
    var now = new Date();
    var milli = now.getMilliseconds(),
        second = now.getSeconds(),
        minute = now.getMinutes(),
        hour = now.getHours(),
        month = now.getMonth(),
        day = now.getDate(),
        year = now.getFullYear();
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var tags = ["month", "day", "year", "hour", "minute", "second", "ms"],
        corr = [months[month], day, year, hour.pad(2), minute.pad(2), second.pad(2), milli.pad(3)];
    for (var i = 0; i < tags.length; i++) {
        document.getElementById(tags[i]).firstChild.nodeValue = corr[i];

    }
    setTimeout(updateClock, 1);
}


function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        Log("Enter fullscreen");
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen(); 
            Log("Exit fullscreen");
        }
    }
}

function toggleDate() {
    let dateLine = document.getElementById("date");

    if (dateLine.classList.contains('hidden')) {
        dateLine.classList.remove('hidden');
        setTimeout(function () {
            dateLine.classList.remove('visuallyhidden');
        }, 50);
        Log("Date is shown");
    } else {
        dateLine.classList.add('visuallyhidden');    
        dateLine.addEventListener('transitionend', function(e) {
        dateLine.classList.add('hidden');
        }, {
            capture: false,
            once: true,
            passive: false
        });
        Log("Date is hidden");
    }
}

// Change screen opacity on mousewheel
function scaleOpacity(event) {
    event.preventDefault();
    scale += event.deltaY/125 * -0.05;

    // Restrict scale
    scale = Math.min(Math.max(0.05, scale), 1);
    Log(`Screen opacity: ${Math.round(scale*100)}%`);

    // Apply opacity
    page.style.opacity = scale;
}

let scale = 1;
const page = document.querySelector('#viewport-center');
page.onwheel = scaleOpacity;

document.addEventListener('dblclick', toggleFullScreen);

document.addEventListener('keyup', function(event) {
    // Spacebar toggle #date
    if (event.code === 'Space') {
        toggleDate();
    }
    // F to toggle fullscreen
    if (event.code === 'KeyF') {
        toggleFullScreen();
    }
});
// On right click, also toggle #date
document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
    toggleDate();
});

document.addEventListener('keydown', function(event) {
    // Use keydown to allow the hold acceleration thing to spam through the opacity
    // Arrow key up or down to change opacity
    if (event.code === 'ArrowUp') {
        scale += 0.05;
        scale = Math.min(Math.max(0.05, scale), 1);
        Log(`Screen opacity: ${Math.round(scale*100)}%`);
        page.style.opacity = scale;
    }
    if (event.code === 'ArrowDown') {
        scale -= 0.05;
        scale = Math.min(Math.max(0.05, scale), 1);
        Log(`Screen opacity: ${Math.round(scale*100)}%`);
        page.style.opacity = scale;
    }
});


// Mouse idle 1s on viewport-center, hide cursor
let viewportCenter = document.getElementById("viewport-center");
let cursorHidden = false;
let cursorTimeout;

function hideCursor() {
    viewportCenter.style.cursor = "none";
    cursorHidden = true;
    Log("Mouse idle: Cursor is hidden");
}

function showCursor() {
    viewportCenter.style.cursor = "default";
    cursorHidden = false;
    Log("Wiggle squiggle: Cursor is shown");
}

viewportCenter.addEventListener('mousemove', function(event) {
    if (cursorHidden) {
        showCursor();
    }
    clearTimeout(cursorTimeout);
    cursorTimeout = setTimeout(hideCursor, 2000);
});

// Swipe up/down to change opacity
// Swipe gesture code by kirupa @ https://www.kirupa.com/html5/detecting_touch_swipe_gestures.htm
viewportCenter.addEventListener("touchstart", startTouch, false);
viewportCenter.addEventListener("touchmove", moveTouch, false);

// Swipe Up / Down / Left / Right
let initialX = null;
let initialY = null;
 
function startTouch(e) {
    initialX = e.touches[0].clientX;
    initialY = e.touches[0].clientY;
};
 
function moveTouch(e) {
    if (initialX === null) {
        return;
    }
    
    if (initialY === null) {
        return;
    }
    
    let currentX = e.touches[0].clientX;
    let currentY = e.touches[0].clientY;
    
    let diffX = initialX - currentX;
    let diffY = initialY - currentY;

    // get screen size
    const screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;

    // normalize to 1
    diffX /= screenWidth;
    diffY /= screenHeight;

    Log(`Normalized Swipe Distance (x,y) : (${diffX.toFixed(4)}, ${diffY.toFixed(4)})`);
    
    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Normalized diff * rate of change cuz touchmove fires based on how fast you move. Rate of change is just a made up number that feels about right
        scale -= diffX * 0.05;
        scale = Math.min(Math.max(0.05, scale), 1);
        Log(`Screen opacity: ${Math.round(scale*100)}%`);
        page.style.opacity = scale;
    } else {
        // Normalized diff * rate of change cuz touchmove fires based on how fast you move. Rate of change is just a made up number that feels about right
        scale += diffY * 0.05;
        scale = Math.min(Math.max(0.05, scale), 1);
        Log(`Screen opacity: ${Math.round(scale*100)}%`);
        page.style.opacity = scale;
    }

    e.preventDefault();
};


// Force screen to stay on, https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API
// This API is not fully supported yet (no Safari, no Firefox)
let wakeLock = null;
const requestWakeLock = async () => {
    try {
        wakeLock = await navigator.wakeLock.request('screen');
    } catch (err) {
        // The wake lock request fails - usually system-related, such as low battery.
        console.log(`${err.name}, ${err.message}`);
    }
    Log(wakeLock);
    if (wakeLock == null) {
        Log('You probably opened this page in a new tab and never switch/focus to it. Well, or maybe the browser that you are on does not support the Wake Lock API.');
    }
    else if (wakeLock.released) {
        Log("Wake-lock released, screen won't be keep on.");
    } else {
        Log("Wake-lock acquired, screen will be kept on (until you minimize the window or switch to another tab).");
    }
    
}
requestWakeLock();

// Screen Wake Lock automatically turns off when the page is hidden (change tab, minimize window, etc.)
// Re-request it when the page is shown again
document.addEventListener('visibilitychange', async () => {
    if (wakeLock !== null && document.visibilityState === 'visible') {
        requestWakeLock();
    }
    Log(wakeLock);
    if (wakeLock == null) {
        Log('You probably opened this page in a new tab and never switch/focus to it. Well, or maybe the browser that you are on does not support the Wake Lock API.');
    }
    else if (wakeLock.released) {
        Log("Wake-lock released, aka Screen won't be keep on.");
    } else {
        Log("Wake-lock acquired, the Screen will be kept on (until you minimize the window or switch to another tab).");
    }
});

// onLoad --> function
window.onload = function() {
    updateClock();
    console.log("Clock initialized");
}

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
    navigator.serviceWorker
        .register("../clock/PWAserviceWorker.js")
        .then(res => console.log("PWA service worker registered"))
        .catch(err => console.log("PWA service worker not registered", err))
    })
}