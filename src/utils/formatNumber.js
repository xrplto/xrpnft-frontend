import Decimal from 'decimal.js';
import numeral from 'numeral';

// ----------------------------------------------------------------------
/*function processBigNumber(number, language, currency = undefined) {
    const { num, unit } = formatLargeNumber(Number(number), 2);
    let numberString = unit ? `${num} ${unit}` : `${num}`;
    if (number.toString().includes('e')) {
        numberString = Number(number)
            .toExponential(2)
            .toString();
    }
    if (currency)
        return `${getLocalizedCurrencySymbol(language, currency)} ${numberString}`;
    return numberString;
}*/

export function fVolume(number) {
    return new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(number);
}

export function fNumber(number) {
    return new Intl.NumberFormat().format(number);
}

export function fCurrency(number) {
    return numeral(number).format(Number.isInteger(number) ? '0,0' : '0,0.00');
}

export function fCurrency3(number) {
    return numeral(number).format(Number.isInteger(number) ? '0,0' : '0,0.000');
}

const f = (v, threshold = .9999) => {
    let shift = 1;
    let part;
    
    do {
      shift *= 10;
      part = Math.floor(v * shift) / shift;
    } while (part / v < threshold);
    
    return part;
}

export function limitNumber(number) {
        const res = numeral(number).format(Number.isInteger(number) ? '0,0' : '0,0.00');
        if (res === 'NaN')
            return 0;
        return number;
}

export function fIntNumber(number) {
    return new Intl.NumberFormat().format(Math.round(number));
}

export function fCurrency5(number) {
    if (number < 1)
        return f(number);
    else {
        const res = numeral(number).format(Number.isInteger(number) ? '0,0' : '0,0.00');
        if (res === 'NaN') return 0;
        return res;
    }
}

const fp = (v, threshold = .99) => {
    let shift = 1;
    let part;
    
    do {
      shift *= 10;
      part = Math.floor(v * shift) / shift;
    } while (part / v < threshold);
    
    return part;
}

export function fPercent(number) {
    return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(number / 100);
}

export function fData(number) {
    return numeral(number).format('0.0 b');
}
