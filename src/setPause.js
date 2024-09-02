export default async function setPause(timeout) {
    return new Promise((resolve) => {
        setTimeout(() => resolve('go'), timeout);
    })
}