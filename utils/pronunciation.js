let urlsForExpression = null;
const moduleUrl = import.meta.env.VITE_MY_SYNTH_FN;
import(/* @vite-ignore */ moduleUrl).then(module => urlsForExpression = module.default);

let urlList = null;

// async function fetchAudioUrls() {
//     const resp = await fetch('/recordUrls.json');
//     urlList = await resp.json();
// }
// fetchAudioUrls();

(async () => {
    const resp = await fetch('/recordUrls.json');
    urlList = await resp.json();
}) ();

let currentWord = '';
let currentWordUrls = null;
const audio = new Audio();

const urlKeys = {
	"a": "https://s3.amazonaws.com/audio.vocabulary.com/1.0/us/",
	"cb": "https://dictionary.cambridge.org/us/media/english/uk_pron/",
	"ca": "https://dictionary.cambridge.org/us/media/english/us_pron/",
	"oa": "https://www.onelook.com/pronounce/macmillan/US/",
	"ob": "https://www.onelook.com/pronounce/macmillan/UK/"
};

let currentIndex = 0;

function playNext() {
    console.log(currentIndex);
    console.log(currentWordUrls[currentIndex]);

    audio.src = currentWordUrls[currentIndex];
    audio.play();

    currentIndex++;
    if(currentIndex >= currentWordUrls.length) currentIndex = 0; 
}

async function findAudio(word) {
    if(!urlList) {
        setTimeout(async () => await findAudio(word), 200);
        return;
    }

    currentWord = word;

    const compactUrls = urlList[word];
    if(!compactUrls) {
        currentWordUrls = null;
        return;
    }

    currentWordUrls = compactUrls.map(compactUrl => {
        const [encoded, query] = compactUrl.split('*');
        return urlKeys[encoded] + query;
    });

    console.log(currentWordUrls);
}

function play() {
    if(currentWordUrls) {
        playNext();
    } else {
        currentWordUrls = urlsForExpression(currentWord, true);
        console.log(currentWordUrls);
        playNext();
    }
}

export { findAudio, play };