function gaussroshhashanacalculater(year) {
    const T = (33. + 14. / 24.)
    const L = ((1. + 485. / 1080.) / 24. / 19.)
    const K = ((29. + (12. + 793. / 1080.) / 24.) / 19.)

    const m0 = (T - 10. * K + L + 14.)
    const m1 = ((21. + 589. / 1080.) / 24.)
    const m2 = ((15. + 204. / 1080.) / 24.)

    const a = (12 * year + 17) % 19
    const b = year % 4
    let m = m0 + K * a + b / 4. - L * year
    if (m < 0) {
        m -= 1
    }
    let M = Math.floor(m)
    if (m < 0) {
        m += 1
    }
    m -= M
    let s = ((M + 3 * year + 5 * b + 5) % 7)
    if (s == 0){
        if(a >= 12 && m >= m1){
            M += 1
        }
    }
    else if (s == 1){
        if (a >= 7 && m >= m2){
            M += 2
        }
        else if (s == 2 || s == 4 || s == 6){
            M += 1
        }
    }
    M += ((year - 3760) / 100 - (year - 3760) / 400 - 2) + 163
    M -= ((4 * 31) + 2 * 30)
    return Math.floor(M)
}

console.log(gaussroshhashanacalculater(5778))