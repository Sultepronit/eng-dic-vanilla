import setPause from "./setPause";

let urlsForExpression = null;
const moduleUrl = import.meta.env.VITE_MY_SYNTH_FN;
import(/* @vite-ignore */ moduleUrl).then(module => urlsForExpression = module.default);

let urlList = null;
(async () => {
    const resp = await fetch('/recordUrls.json');
    urlList = await resp.json();
}) ();

let currentExpression = '';
let currentExpressionUrls = null;
const audio = new Audio();

const urlKeys = {
	"a": "https://s3.amazonaws.com/audio.vocabulary.com/1.0/us/",
	"cb": "https://dictionary.cambridge.org/us/media/english/uk_pron/",
	"ca": "https://dictionary.cambridge.org/us/media/english/us_pron/",
	"oa": "https://www.onelook.com/pronounce/macmillan/US/",
	"ob": "https://www.onelook.com/pronounce/macmillan/UK/"
};

async function findAudio(expression) {
    if(!urlList || !urlsForExpression) {
        await setPause(400);
        return findAudio(expression);
    }

    const compactUrls = urlList[expression];

    if(compactUrls) {
        currentExpressionUrls = compactUrls.map(compactUrl => {
            const [encoded, query] = compactUrl.split('*');
            return urlKeys[encoded] + query;
        });
    } else {
        currentExpressionUrls = urlsForExpression(currentExpression, true);
    }

    console.log(currentExpressionUrls);
}

let currentIndex = 0;
function playNext() {
    if(currentIndex >= currentExpressionUrls.length) currentIndex = 0; 

    console.log(currentIndex);
    console.log(currentExpressionUrls[currentIndex]);

    audio.src = currentExpressionUrls[currentIndex++];
    audio.play();
}

async function play(expression) {
    if(currentExpression !== expression) {
        currentExpression = expression;
        await findAudio(expression);
    }

    playNext();
}

export { play };