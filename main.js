    //Variables:
    //get elements from DOM
    const actionBtn = document.querySelector('.pomodoro-action-btn');
    const pomodoroProgress = document.querySelector('.pomodoro svg circle');
    const timeEl = document.querySelector('.time');
    const pomodoroTimesBtn = document.querySelector('.pomodoro-times');
    const settingsBtn = document.querySelector('.pomodoro-settings-btn');
    const closeSettingsBtn = document.querySelector('.close-pomodoro-settings');
    const pomodoroSettingsModal = document.querySelector('.pomodoro-settings-modal');
    const pomodoroApplyBtn = document.querySelector('.pomodoro-apply-btn');
    const pomodoroFontItems = document.querySelector('.pomodoro-font-items');
    const pomodoroColorItems = document.querySelector('.pomodoro-color-items');
    //daj naziv
    let mainTime = 25 * 60 // 3min or 180sec (default)
    let basicTime = mainTime;
    let shortTime = 5 * 60 // 5min or 300sec
    let longTime = 15 * 60 // 15min or 960sec
    let leftTime;
    let pomodoroInt;
    let font = 'font-1';
    let color = 'theme-1';
    let isBasic = true;
    let isShort = false;
    let isLong = false;

    //Function: Inital Pomodoro
    function initialPomodoro() {
        //add value for stroke dasharray style
        pomodoroProgress.style.strokeDasharray = 340;
        //add value for stroke dashoffset style
        pomodoroProgress.style.strokeDashoffset = 340;
        //set value for main time
        timeEl.innerText = `${ formateTime(mainTime / 60) }:00`;
        //set value for action btn
        actionBtn.textContent = 'Start';
        //left time equal main time
        leftTime = mainTime;
        //clear interval
        clearInterval(pomodoroInt);
        //set default font
        document.querySelector('html').className = `${ color } ${ font }`;
    }

    //Function: Action Pomodoro
    function actionPomodoro(e) {
        const element = e.target;
        if (element.textContent === 'Start') {
            pomodoroInt = setInterval(startPomodoro, 1000);
            element.textContent = 'Pause';
        } else if (element.textContent === 'Pause') {
            element.textContent = 'Start';
            clearInterval(pomodoroInt);
        } else if (element.textContent === 'Restart') {
            restartPomodoro();
            element.textContent = 'Pause';
        }
    }
    
    //Function: Start Pomodoro
    function startPomodoro() {
        //get pomodoro progress stroke dasharray
        const strokeDasharray = pomodoroProgress.style.strokeDasharray;
        //get pomodoro progress stroke dashoffset
        let strokeDashoffset = pomodoroProgress.style.strokeDashoffset;
        //calculate offset per one sec
        const offsetPerSec = strokeDasharray / mainTime;
        //
        leftTime -= 1;
        //if stroke dashoffset smaller or equal zero
        if (leftTime === 0) {
            pomodoroProgress.style.strokeDashoffset = 0;
            actionBtn.textContent = 'Restart';
            timeEl.innerText = '00:00';
            clearInterval(pomodoroInt);
        } else {
            const minutes = Math.floor(leftTime / 60);
            const seconds = Math.floor(leftTime % 60);
            timeEl.innerText = `${ formateTime(minutes) }:${ formateTime(seconds) }`;

            //every second take value offsetpersec from stroke dashoffset
            pomodoroProgress.style.strokeDashoffset = strokeDashoffset - offsetPerSec;
        }

    }

    //Function: Restart Pomodoro
    function restartPomodoro() {
        //reset value for pomodoro
        initialPomodoro();
        pomodoroInt = setInterval(startPomodoro, 1000);
    }

    //Function: Formate Time
    function formateTime(value) {
        if (value < 10) {
            return `0${ value }`;
        }
        return value;
    }

    //Function: Choose Pomodoro Interval
    function choosePomodoroInterval(e) {
        const element = e.target;
        //remove class active from all btns
        [...element.parentElement.children].forEach(btn => btn.classList.remove('active'));
        if (element.classList.contains('pomodoro-btn')) {
            element.classList.add('active');
            mainTime = basicTime;
            isBasic = true;
            isShort = false;
            isLong = false;
            initialPomodoro();
        } else if (element.classList.contains('pomodoro-short-btn')) {
            element.classList.add('active');
            mainTime = shortTime;
            isBasic = false;
            isShort = true;
            isLong = false;
            initialPomodoro();
        } else if (element.classList.contains('pomodoro-long-btn')) {
            element.classList.add('active');
            mainTime = longTime;
            isBasic = false;
            isShort = false;
            isLong = true;
            initialPomodoro();
        }
    }

    //Function: Open Pomodoro Settings
    function openSettings() {
        pomodoroSettingsModal.classList.remove('hide-modal');
        document.querySelector('body').style.overflowY = 'hidden';
        setTimeout(() => pomodoroSettingsModal.style.opacity = 1, 0);
    }

    //Function: Close Pomodoro Settings
    function closeSettings() {
        pomodoroSettingsModal.classList.add('hide-modal');
        document.querySelector('body').style.overflowY = 'unset';
        pomodoroSettingsModal.style.opacity = 0;
    }

    //Function: Submit Pomodoro Settings
    function submitPomodoroSettings() {
        //get pomodoro basic time
        const basicTimeInput = document.querySelector('.pomodoro-main-input').value; 
        //get pomodoro short time
        const shortTimeInput = document.querySelector('.pomodoro-short-input').value; 
        //get pomodoro long time
        const longTimeInput = document.querySelector('.pomodoro-long-input').value;

        if (basicTimeInput !== '' && basicTimeInput > 0 &&
            shortTimeInput !== '' && shortTimeInput > 0 &&
            longTimeInput !== '' && longTimeInput > 0) {
                basicTime = basicTimeInput * 60;
                shortTime = shortTimeInput * 60;
                longTime = longTimeInput * 60;
                if (isBasic) mainTime = basicTime;
                if (isShort) mainTime = shortTime;
                if (isLong) mainTime = longTime;
                initialPomodoro();
                closeSettings();
            } else {
                showAlertMessage('The value for time interval musn\'t be zero or negative number!')
            }
    }

    //Function: Show Alert Message
    function showAlertMessage(message) {
        const div = document.createElement('div');
        div.classList.add('pomodoro-settings-alert');
        div.appendChild(document.createTextNode(message));
        const pomodoroSettingsEl = document.querySelector('.pomodoro-settings');
        pomodoroSettingsModal.insertBefore(div, pomodoroSettingsEl);

        setTimeout(() => pomodoroSettingsModal.removeChild(div), 3000);
    }

    //Function: Choose Font
    function chooseFont(e) {
        const element = e.target;
        if (element.classList.contains('pomodoro-font-item')) {
            const elementFont = element.dataset.font;
            [...element.parentElement.children].forEach(item => item.classList.remove('active'));
            element.classList.add('active')
            font = elementFont;
        }
    }

    //Function: Choose Theme
    function chooseColor(e) {
        const element = e.target;
        if (element.classList.contains('pomodoro-color-item')) {
            const elementColor = element.dataset.color;
            [...element.parentElement.children].forEach(item => item.classList.remove('active'));
            element.classList.add('active')
            color = elementColor;
        }
    }

    //Event: DOM Content Loaded
    document.addEventListener('DOMContentLoaded', () => {
        initialPomodoro();
    });

    //Event: Action Pomodoro
    actionBtn.addEventListener('click', actionPomodoro);

    //Event: Choose Pomodoro Time Interval
    pomodoroTimesBtn.addEventListener('click', choosePomodoroInterval);

    //Event: Open Pomodoro Settings
    settingsBtn.addEventListener('click', openSettings);
    //Event: Close Pomodoro Settings
    closeSettingsBtn.addEventListener('click', closeSettings);

    //Event: Submit Pomodoro Settings
    pomodoroApplyBtn.addEventListener('click', submitPomodoroSettings);

    //Event: Choose Font
    pomodoroFontItems.addEventListener('click', chooseFont);
    //Event: Choose Color
    pomodoroColorItems.addEventListener('click', chooseColor);