export const history = {
    data: [],
    get lastItem() {
        return this.data[this.data.length - 1];
    },
    append(item) {
        if(item === this.lastItem) return;
        this.data.push(item);
        console.log(this.data);
        localStorage.setItem('EngDicHistory', JSON.stringify(this.data));
    },
    get last20() {
        return this.data.slice(2);
    },
    restoreHistory() {
        const json = localStorage.getItem('EngDicHistory');
        if(json) this.data = JSON.parse(json);
        console.log('history:', this.data);
    }
}

history.restoreHistory();

export default history;