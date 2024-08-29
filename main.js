import './style.css';
import { findAudio, play } from './utils/pronunciation.js';
console.log('Here we go!');

const theForm = document.getElementById('the-form');
const theInput = document.getElementById('the-input');

theForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(theInput.value);
    findAudio(theInput.value);
    play();
});


// theInput.addEventListener('keyup', (e) => {
//     if(e.key !== 'Enter') return;
//     console.log(e.target.value);

// });
