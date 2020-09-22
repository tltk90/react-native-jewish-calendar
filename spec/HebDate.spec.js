const { getHebDate } = require('../dist/index');

describe('getHebDate testing', () => {

    it('should be 24 to teshri and parashat bereshit', () => {
        const date = new Date('2020-10-12');
        const hebDay = getHebDate(date);
        expect(hebDay.hebDay).toBe(24);
        expect(hebDay.hebMonth).toBe(1);
        expect(hebDay.parasha).toBe('בראשית');
    });

    it('should be pesah', () => {
        const date = new Date('2021-03-29');
        const hebDay = getHebDate(date);
        expect(hebDay.hebDay).toBe(16);
        expect(hebDay.hebMonth).toBe(8);
        expect(hebDay.parasha).toBe('פסח');
    });

    it('week before rosh hashana', () => {
        const date = new Date('2021-09-02');
        const hebDay = getHebDate(date);
        expect(hebDay.hebDay).toBe(25);
        expect(hebDay.hebMonth).toBe(13);
    });

    it('should be socot', () => {
        const date = new Date('2021-09-19');
        const hebDay = getHebDate(date);
        expect(hebDay.parasha).toBe('סוכות');
    });

    it('shavout', () => {
        const date = new Date('2028-05-31');
        const hebDay = getHebDate(date);
        expect(hebDay.hebDay).toBe(6);
        expect(hebDay.hebMonth).toBe(10);
    });
});
