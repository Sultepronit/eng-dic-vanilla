import './style.css';
import getArticle from './src/getArticle.js';
import { play } from './src/pronunciation.js';
// import openWindow from './src/openWindow.js';
import history from './src/history.js';

// data
const theInput = document.getElementById('the-input');
// const historyList = document.getElementById('history');

const tabs = {
    main: document.getElementById('main-tab'),
    auxilary: document.getElementById('auxilary-tab'),
    // google: document.getElementById('google-tab'),
    translate: document.getElementById('translate-tab'),
    uk: document.getElementById('uk-tab'),
};

const articles = {
    main: document.getElementById('main-article'),
    auxilary: document.getElementById('auxilary-article'),
    translate: document.getElementById('translate-article'),
    uk: document.getElementById('uk-article'),
    // gtranslate: document.getElementById('aux-gtranslate'),
    // glosbe: document.getElementById('glosbe-article'),
    // google: document.getElementById('google-article'),
};

// actions
const displaying = { main: '', auxilary: '', google: '' };
let selected = '';
let translateOn = false;

async function displayArticle(input, articleName, loadName = articleName) {
    articles[articleName].innerHTML = '<i>Loading...</i>';
    articles[articleName].innerHTML = await getArticle(loadName, input);
}

async function setDic(toBeSelected) {
    // if(displaying[selected] === theInput.value) return;

    if (selected !== toBeSelected) {
        tabs[selected]?.classList.remove('selectedTab');
        articles[selected]?.classList.add('hidden');

        selected = toBeSelected;

        tabs[selected].classList.add('selectedTab');
        articles[selected].classList.remove('hidden');

        translateOn = selected === 'translate';
    }

    if(displaying[selected] === theInput.value) return;

    displaying[selected] = theInput.value;
    if (selected === 'main') {
        await displayArticle(theInput.value, 'main', 'e2u');
    } else if (selected === 'auxilary') {
        // displayArticle(theInput.value, 'gtranslate');
        // displayArticle(theInput.value, 'glosbe');
        displayArticle(theInput.value, 'auxilary', 'gem-en');
    } else if (selected === 'translate') {
        displayArticle(theInput.value, 'translate', 'gtranslate');
    } else {
        displayArticle(theInput.value, 'uk', 'ua-ua');
    }
}

tabs.main.addEventListener('click', () => setDic('main'));
tabs.auxilary.addEventListener('click', () => setDic('auxilary'));
// tabs.google.addEventListener('click', () => selectDic('google'));
tabs.translate.addEventListener('click', () => setDic('translate'));
tabs.uk.addEventListener('click', () => setDic('uk'));

function updateHistory(expression) {
    history.append(expression);

    // const newItem = document.createElement('option');
    // newItem.value = expression;
    // historyList.prepend(newItem);
}

let lastExpression = '';
async function submitExpression(expression) {
    console.log('submit!');
    // if(/[a-zA-z]/.test(expression)) {
    //     // play(expression);
    // }

    if(expression === lastExpression) return;
    lastExpression = expression;

    updateHistory(expression);

    console.log(expression);

    theInput.select();

    if (translateOn) {
        setDic('translate');
        return;
    }

    await setDic('main');
    
    if(articles.main.innerHTML === '...') {
        setDic('auxilary');
    }
}

function adjustHeight() {
    theInput.style.height = 'auto';
    theInput.style.height = theInput.scrollHeight + 2 + 'px';  
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

    // we are here -- the Enter was pressed!
    theInput.value = breakRemoved;
    adjustHeight();
    submitExpression(theInput.value);
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'Escape') {
        theInput.select();
    } else if (e.key === 'Enter') {
        const text = window.getSelection().toString().trim().replace('||', '');
        // console.log(text);
        if (!text) return;

        theInput.value = text;
        adjustHeight();
        submitExpression(text);
    }
});

document.getElementById('speaker').addEventListener('click', () => play(theInput.value));

// document.getElementById('google-window').addEventListener('click', () => {
//     openWindow('google', theInput.value);
// });