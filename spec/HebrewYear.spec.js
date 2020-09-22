const { createHebYear } = require('../dist/index');


describe('Hebrew Year Test', () => {
    beforeAll(() => {
        this.hebYear = createHebYear();
    });

    beforeEach( () => {
        this.keys = this.hebYear.days.keys();
    });


    it('should be rosh hashana', () => {
        let next = this.keys.next();
        const day = this.hebYear.getDay(next.value);
        expect(day.hebDay).toBe(1);
        expect(day.hebMonth).toBe(1);
    });

    it('should be parashat bereshit', () => {
        let next = this.keys.next();
        let day = this.hebYear.getDay(next.value);
        while( day.hebDay !== 23) {
            next = this.keys.next();
            day = this.hebYear.getDay(next.value);
        }

        expect(day.parasha).toBe('בראשית');
    });

    it('should create new year dynamically', () => {
        const now = new Date();
        const hebDayNow = this.hebYear.getDay(now.toDateString());
        const longTimeFromNow = new Date(now);
        longTimeFromNow.setDate(longTimeFromNow.getDate() + 500);
        const hebDayLongTimeFromNow = this.hebYear.getDay(longTimeFromNow.toDateString());
        expect(hebDayNow.year).not.toEqual(hebDayLongTimeFromNow.year);
    })
});
