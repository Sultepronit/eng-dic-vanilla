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
            })
            .join("");

        return `
            <h2 class="result-title">${data.word}</h2>
            <div>${phonetics}</div>
            <div>${meanings}</div>
            <div class="result-item"><a href="${data.sourceUrls[0]}" target="_blank">Source</a></div>
        `;
    } catch (error) {
        console.warn(error);
    }
}