function filterUniq(array) {
    const uniq = new Set(array);
    console.log(uniq);
    return Array.from(uniq);
}

function gatherSynAnt(parent, isSyn, addClass = '') {
    const synAnt = isSyn ? 'synonyms' : 'antonyms';

    const re = [];
    if (parent[synAnt].length) {
        re.push(`<p class="${synAnt} ${addClass}">
            ${filterUniq(parent[synAnt]).join(', ')}
        </p>`);
    }
    return re;
}

export default async function fetchFreeDic(input) {
    const url = 'https://api.dictionaryapi.dev/api/v2/entries/en';
    try {
        const resp = await fetch(`${url}/${input}`);
        if (!resp.ok) return '...';
        const arr = await resp.json();
        const data = arr[0]
        console.log(data);

        const phonetics = filterUniq(data.phonetics.map(p => `${p.text}`))
            .join('<span class="space"></span>');
        
        const mainParts = [];
        for (const meaning of data.meanings) {
            mainParts.push(`<hr><h4>${meaning.partOfSpeech}</h4>`);
            mainParts.push(...gatherSynAnt(meaning, true));
            mainParts.push(...gatherSynAnt(meaning, false));

            for (const def of meaning.definitions) {
                mainParts.push(`<p class="definition">${def.definition}</p>`); 
                mainParts.push(...gatherSynAnt(def, true, 'sub'));
                mainParts.push(...gatherSynAnt(def, false, 'sub'));
                if (def.example) {
                    mainParts.push(`<p class="example">${def.example}</p>`); 
                }
            }
        }

        return `
            <div class="phonetics">${phonetics}</div>
            <div>${mainParts.join('')}</div>
        `;
    } catch (error) {
        console.warn(error);
    }
}