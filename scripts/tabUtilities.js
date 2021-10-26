const AudioContext = window.AudioContext || window.webkitAudioContext;

function generateRange(tabId) {
    let tabVolume = document.createElement('input');
    tabVolume.setAttribute('type', 'range');
    tabVolume.setAttribute('min', "0");
    tabVolume.setAttribute('max', "500");
    tabVolume.setAttribute('id', tabId);
    tabVolume.classList.add("form-range");
    return tabVolume;
}

function getFullRow(index, tabName, tabId) {
    let trE = document.createElement('tr');
    let thE = document.createElement('th');
    thE.setAttribute('scope', 'row');
    thE.textContent = index;
    let td1 = document.createElement('td');
    td1.textContent = tabName;
    let td2 = document.createElement('td');
    let tabVolume = generateRange(tabId);

    td2.appendChild(tabVolume);
    trE.appendChild(thE);
    trE.appendChild(td1);
    trE.appendChild(td2);

    return trE;
}

function changeVolume(tabElement, tabId) {
    let target = document.querySelector('[audioSource="${tabId}"]');
    let audioCtx = new AudioContext();
    let media = audioCtx.createMediaElementSource(target);
    let gainNode = audioCtx.createGain();

    gainNode.gain.value = document.querySelector(tabId);

}

function listTabs() {

    getCurrentWindowTabs().then((tabs) => {
        let tabsList = document.getElementById('tabs-list');
        let currentTabs = document.createDocumentFragment();
        let limit = 20;
        let counter = 0;

        console.log(tabs);
        for (let tab of tabs) {
            if (!tab.active && counter <= limit) {
                //let gain = tab.AudioContext.createGain();
                console.log(tab.title + tab.id);
                let tabElement = getFullRow(counter + 1, tab.title, tab.id);
                for (const audioSource of document.querySelectorAll('audio', 'video')) {
                    if (!audioSource.hasAttribute('audioSource')) audioSource.setAttribute('audioSource', tab.id);
                }
                track.connect(gainNode).connect(panner).connect(audioCtx.destination);
                tabElement.addEventListener('change', changeVolume(tabElement, tab.id));
                currentTabs.appendChild(tabElement);

            }
            counter += 1;
        }
        tabsList.appendChild(currentTabs);

    });
}

document.addEventListener("DOMContentLoaded", listTabs);

function getCurrentWindowTabs() {
    return browser.tabs.query({ currentWindow: true, audible: true });
}