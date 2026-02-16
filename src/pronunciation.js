async function loadUrlList() {
    const resp = await fetch("/recordUrls.json");
    return await resp.json();
}
const urlListPromise = loadUrlList();

const urlKeys = {
	"a": "https://s3.amazonaws.com/audio.vocabulary.com/1.0/us/",
	"cb": "https://dictionary.cambridge.org/us/media/english/uk_pron/",
	"ca": "https://dictionary.cambridge.org/us/media/english/us_pron/",
	"oa": "https://www.onelook.com/pronounce/macmillan/US/",
	"ob": "https://www.onelook.com/pronounce/macmillan/UK/"
};

async function getVerifiedRecords(expression) {
    const urlList = await urlListPromise;
    const compactUrls = urlList[expression];
    if (!compactUrls) return [];

    const re = [];
    for (const url of compactUrls) {
        const [a, b] = url.split("*");
        re.push({
            url: `${urlKeys[a]}${b}`,
            type: "verified",
            
        });
    }

    return re;
}

const ttsUrl = import.meta.env.VITE_TTS_URL;
function getSynthRecords(expression, limit = 6) {
    const re = [];
    for (let i = 1; i <= limit; i++) {
        re.push({
            url: `${ttsUrl}/${expression}/${i}.mp3?mode=temp`,
            type: 'synth',
            code: `synth-${i}`
        });
    }
    return re;
}

async function getRecords(expression) {
    const verified = await getVerifiedRecords(expression);
    if (verified.length > 2) return verified;
    if (verified.length > 0) return [...verified, ...getSynthRecords(expression, 2)];
    return getSynthRecords(expression);
}

let actualExp = "";
let trackList = null;
const audio = new Audio();
// audio.addEventListener('error', () => playNext());

let trackI = 0;
function playNext() {
    trackI = (trackI + 1) % trackList.length;

    console.log(trackI);
    console.log(trackList[trackI]);

    audio.src = trackList[trackI].url;
    audio.play();
}

export default async function speak(expression) {
    if(actualExp !== expression) {
        actualExp = expression;
        trackList = await getRecords(expression);
    }

    playNext();
}