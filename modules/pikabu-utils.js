// "pb" is for pikabu
class UtilsCls {
    constructor () {
        this.zeroDateTs = new Date(Date.UTC(2008, 0, 1)).getTime();
        this.dayMs = 1000 * 60 * 60 * 24;
    }

    getPbToday () {
        let today = new Date();
        let todayUTC = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 0, 0, 0);
        return this.getPbDayByDate(todayUTC);
    }

    /**
     * @param {Number} ts timesamp
     * @return {Number} day number to use in query string
     */
    getPbDayByDate (ts) {
        let diffDays = (ts - this.zeroDateTs) / this.dayMs;
        return diffDays
    }
}

module.exports = new UtilsCls();