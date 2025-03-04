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
    glosbe: document.getElementById('glosbe-tab'),
    gtranslate: document.getElementById('google-tab')
};

const articles = {
    e2u: document.getElementById('e2u-article'),
    glosbe: document.getElementById('glosbe-article'),
    gtranslate: document.getElementById('google-article')
};

// actions
const displaying = { e2u: '', glosbe: '', gtranslate: '' };

async function selectDic(toBeSelected) {
    // for(const name of dicNames) {
    //     if (name !== toBeSelected) {
    //         tabs[name]?.classList.remove('selectedTab');
    //         articles[name]?.classList.add('hidden');
    //     }
    // }
    tabs[toBeSelected].classList.add('selectedTab');
    articles[toBeSelected]?.classList.remove('hidden');

    if(displaying[toBeSelected] !== theInput.value) {
        articles[toBeSelected].innerHTML = '<i>Loading...</i>';
        displaying[toBeSelected] = theInput.value;
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
async function submitExpression(expression) {
    // console.log('submit!');
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
    await selectDic('e2u');
    
    if(articles.e2u.innerHTML === '...') {
        selectDic('glosbe');
    }
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
tabs.e2u.addEventListener('click', () => selectDic('e2u'));
tabs.glosbe.addEventListener('click', () => selectDic('glosbe'));
tabs.gtranslate.addEventListener('click', () => selectDic('gtranslate'));

document.getElementById('the-form').addEventListener('submit', (e) => {
    e.preventDefault();
    // console.log('And here!');
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