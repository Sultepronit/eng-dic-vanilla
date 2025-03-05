import './style.css';
import getArticle from './src/getArticle.js';
import { play } from './src/pronunciation.js';
import openWindow from './src/openWindow.js';
import history from './src/history.js';

// data
const theInput = document.getElementById('the-input');
const historyList = document.getElementById('history');

const tabs = {
    main: document.getElementById('main-tab'),
    auxilary: document.getElementById('auxilary-tab'),
    google: document.getElementById('google-tab'),
};

const articles = {
    main: document.getElementById('main-article'),
    auxilary: document.getElementById('auxilary-article'),
    gtranslate: document.getElementById('aux-gtranslate'),
    glosbe: document.getElementById('glosbe-article'),
    google: document.getElementById('google-article'),
};

// actions
const displaying = { main: '', auxilary: '', google: '' };
let selected = '';
let googleOn = false;

async function displayArticle(input, articleName, loadName = articleName) {
    articles[articleName].innerHTML = '<i>Loading...</i>';
    articles[articleName].innerHTML = await getArticle(loadName, input);
}

async function selectDic(toBeSelected) {
    tabs[selected]?.classList.remove('selectedTab');
    articles[selected]?.classList.add('hidden');

    selected = toBeSelected;
    tabs[selected].classList.add('selectedTab');
    articles[selected].classList.remove('hidden');

    googleOn = selected === 'google';

    if(displaying[selected] !== theInput.value) {
        displaying[selected] = theInput.value;
        if (selected === 'main') {
            await displayArticle(theInput.value, 'main', 'e2u');
        } else if (selected === 'auxilary') {
            displayArticle(theInput.value, 'gtranslate');
            displayArticle(theInput.value, 'glosbe');
        } else {
            displayArticle(theInput.value, 'google', 'gtranslate');
        }
    }
}

tabs.main.addEventListener('click', () => selectDic('main'));
tabs.auxilary.addEventListener('click', () => selectDic('auxilary'));
tabs.google.addEventListener('click', () => selectDic('google'));

function updateHistory(expression) {
    history.append(expression);

    // const newItem = document.createElement('option');
    // newItem.value = expression;
    // historyList.prepend(newItem);
}

let lastExpression = '';
async function submitExpression(expression) {
    // console.log('submit!');
    if(/[a-zA-z]/.test(expression)) {
        // play(expression);
    }

    if(expression === lastExpression) return;
    lastExpression = expression;

    updateHistory(expression);

    console.log(expression);

    theInput.select();

    if (googleOn) {
        selectDic('google');
        return;
    }

    await selectDic('main');
    
    if(articles.main.innerHTML === '...') {
        selectDic('auxilary');
    }
}

function adjustHeight() {
    theInput.style.height = 'auto';
    theInput.style.height = theInput.scrollHeight + 5 + 'px';  
}

// execute
window.resizeTo(500, 1200);
window.moveTo(1700, 0);

(() => {
    if(!history.lastItem) return;

    theInput.value = history.lastItem;
    adjustHeight();
    submitExpression(history.lastItem);

    // let optionList = '';
    // for(const item of history.last20) {
    //     optionList += `<option value="${item}">`;
    // }
    // historyList.innerHTML = optionList;
}) ();

// listen

// document.getElementById('the-form').addEventListener('submit', (e) => {
//     e.preventDefault();
//     submitExpression(theInput.value);
// });

// theInput.addEventListener('change', () => {
//     theInput.value = theInput.value.replaceAll('\n', '');
//     console.log(theInput.value);
//     submitExpression(theInput.value);
// });

theInput.addEventListener('input', () => {
    const breakRemoved = theInput.value.replaceAll('\n', '');
    if (theInput.value === breakRemoved) return adjustHeight();

    theInput.value = breakRemoved;
    adjustHeight();

    submitExpression(theInput.value);
});

// document.querySelector('body').addEventListener('keyup', (e) => {
document.addEventListener('keyup', (e) => {
    if (e.code === 'Escape') {
        theInput.select();
    } /*else if (e.code === 'Enter') {
        console.log('here we go!');
        submitExpression(theInput.value);
    }*/
});

document.getElementById('speaker').addEventListener('click', () => play(theInput.value));

// document.getElementById('google-window').addEventListener('click', () => {
//     openWindow('google', theInput.value);
// });