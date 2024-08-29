import './style.css';
import getArticle from './services/getArticle.js';
import { findAudio, play } from './utils/pronunciation.js';
import openWindow from './utils/openWindow.js';

const dicNames = ['e2u', 'glosbe'];
const theInput = document.getElementById('the-input');

const tabs = {
    e2u: document.getElementById('e2u-tab'),
    glosbe: document.getElementById('glosbe-tab')
};

const articles = {
    e2u: document.getElementById('e2u-article'),
    glosbe: document.getElementById('glosbe-article')
};

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

document.getElementById('the-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    console.log(theInput.value);

    findAudio(theInput.value);
    play();

    theInput.select();

    articles.e2u.innerHTML = '';
    articles.glosbe.innerHTML = '';
    selectDic('e2u');
});

document.getElementById('speaker').addEventListener('click', () => play());

tabs.e2u.addEventListener('click', () => selectDic('e2u'));
tabs.glosbe.addEventListener('click', () => selectDic('glosbe'));

document.getElementById('google-window').addEventListener('click', () => {
    openWindow('google', theInput.value);
});


