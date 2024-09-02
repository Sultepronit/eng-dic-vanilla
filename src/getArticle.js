const apiUrl = import.meta.env.VITE_API_URL;

async function getArticle(dic, query) {
    const url = `${apiUrl}?dic=${dic}&word=${encodeURIComponent(query)}`;

    try {
        const resp = await fetch(url);
        const data = await resp.text();
        if(data === '' || data === '<table class=main><tbody></table></tbody><table class=other><tbody></table></tbody><table class=context><tbody></table></tbody>') {
            return '...';
        }
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export default getArticle;