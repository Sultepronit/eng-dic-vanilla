const apiUrl = import.meta.env.VITE_API_URL;

async function fetchArticle(dic, query) {
    // const url = `${apiUrl}?dic=${dic}&word=${encodeURIComponent(query)}`;
    const url = `${apiUrl}/${dic}?request=${encodeURIComponent(query)}&v=2`

    try {
        const resp = await fetch(url);
        const data = await resp.text();
        if(data === '') {
            return '...';
        }
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export default fetchArticle;