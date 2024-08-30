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

let currentIndex = 0;

function playNext() {
    console.log(currentIndex);
    console.log(currentExpressionUrls[currentIndex]);

    audio.src = currentExpressionUrls[currentIndex];
    audio.play();

    currentIndex++;
    if(currentIndex >= currentExpressionUrls.length) currentIndex = 0; 
}

async function findAudio(expression) {
    if(!urlList) {
        setTimeout(async () => await findAudio(expression), 200);
        return;
    }
    
    const compactUrls = urlList[expression];
    if(!compactUrls) {
        currentExpressionUrls = null;
        return;
    }

    currentExpressionUrls = compactUrls.map(compactUrl => {
        const [encoded, query] = compactUrl.split('*');
        return urlKeys[encoded] + query;
    });

    console.log(currentExpressionUrls);
}

async function play(expression) {
    if(currentExpression !== expression) {
        currentExpression = expression;
        await findAudio(expression);
    }

    if(currentExpressionUrls) {
        playNext();
    } else {
        if(!urlsForExpression) return;
        currentExpressionUrls = urlsForExpression(currentExpression, true);
        console.log(currentExpressionUrls);
        playNext();
    }
}

export { play };