export default async function fetchFreeDic(input) {
    const url = 'https://api.dictionaryapi.dev/api/v2/entries/en';
    try {
        const resp = await fetch(`${url}/${input}`);
        // if (!resp.ok) throw new Error('Not ok!');
        if (!resp.ok) return '...';
        const arr = await resp.json();
        const data = arr[0]
        console.log(data);

        const phonetics = data.phonetics
            .map(p => `<div class="result-item">${p.text}</div>`).join("");
        const meanings = data.meanings
            .map((meaning) => {
                const definitions = meaning.definitions
                    .map((def) => `<li>${def.definition}</li>`)
                    .join("");
                return `<div class="result-item"><strong>${meaning.partOfSpeech}</strong><ul>${definitions}</ul></div>`;
            }).join("");
        
        const mainParts = [];
        for (const meaning of data.meanings) {
            mainParts.push(`<hr><h4>${meaning.partOfSpeech}</h4>`);
            if (meaning.synonyms.length) {
                mainParts.push(`<p class="synonyms">${meaning.synonyms.join(', ')}</p>`);
            }
            if (meaning.antonyms.length) {
                mainParts.push(`<p class="antonyms">${meaning.antonyms.join(', ')}</p>`);
            }

            for (const def of meaning.definitions) {
                mainParts.push(`<p class="definition">${def.definition}</p>`); 
                if (def.synonyms.length) {
                    mainParts.push(`<p class="synonyms sub">${def.synonyms.join(', ')}</p>`);
                }
                if (def.antonyms.length) {
                    mainParts.push(`<p class="antonyms sub">${def.antonyms.join(', ')}</p>`);
                }
                if (def.example) {
                    mainParts.push(`<p class="example">${def.example}</p>`); 
                }
            }
        }

        //  <div>${meanings}</div>
        return `
            <div>${phonetics}</div>
            <div>${mainParts.join('')}</div>
        `;
    } catch (error) {
        console.warn(error);
    }
}