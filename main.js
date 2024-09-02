import './style.css';
import getArticle from './src/getArticle.js';
import { play } from './src/pronunciation.js';
import openWindow from './src/openWindow.js';
import history from './src/history.js';

// data
const dicNames = ['e2u', 'glosbe'];
const theInput = document.getElementById('the-input');
const historyList = document.getElementById('history');

const tabs = {
    e2u: document.getElementById('e2u-tab'),
    glosbe: document.getElementById('glosbe-tab')
};

const articles = {
    e2u: document.getElementById('e2u-article'),
    glosbe: document.getElementById('glosbe-article')
};

// actions
async function selectDic(toBeSelected) {
    for(const name of dicNames) {
        if (name !== toBeSelected) {
            tabs[name]?.classList.remove('selectedTab');
            articles[name]?.classList.add('hidden');
        }
    }
    tabs[toBeSelected].classList.add('selectedTab');
    articles[toBeSelected]?.classList.remove('hidden');

    if(!articles[toBeSelected].innerHTML) {
        articles[toBeSelected].innerHTML = '<i>Loading...</i>';
        articles[toBeSelected].innerHTML = await getArticle(toBeSelected, theInput.value);
    }
}

function updateHistory(expression) {
    history.append(expression);

    const newItem = document.createElement('option');
    newItem.value = expression;
    historyList.prepend(newItem);
}

let lastExpression = '';
function submitExpression(expression) {
    if(/[a-zA-z]/.test(expression)) {
        play(expression);
    }

    if(expression === lastExpression) return;
    lastExpression = expression;

    updateHistory(expression);

    console.log(expression);

    theInput.select();

    articles.e2u.innerHTML = '';
    articles.glosbe.innerHTML = '';
    selectDic('e2u');
}

// execute
window.resizeTo(500, 1200);
window.moveTo(1700, 0);

(() => {
    if(!history.lastItem) return;

    theInput.value = history.lastItem;
    submitExpression(history.lastItem);

    let optionList = '';
    for(const item of history.last20) {
        optionList += `<option value="${item}">`;
    }
    historyList.innerHTML = optionList;
}) ();

// listen
document.getElementById('the-form').addEventListener('submit', (e) => {
    e.preventDefault();

    submitExpression(theInput.value);
});

document.getElementById('speaker').addEventListener('click', () => play(theInput.value));

tabs.e2u.addEventListener('click', () => selectDic('e2u'));
tabs.glosbe.addEventListener('click', () => selectDic('glosbe'));

document.getElementById('google-window').addEventListener('click', () => {
    openWindow('google', theInput.value);
});