export const leadingZero = num => num < 10 ? `0${num}` : num;

export function splitThousands(val) {
    if (isNaN(val)) {
        return val;
    }

    val = Math.floor(Number(val));
    const prefix = val < 0 ? '-' : '';

    return prefix + val
        .toString()
        .replace(/\D/g, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function roundToMillions(num, accuracy = 1) {
    if (num === undefined || num === null) {
        return '';
    }

    return (Number(num) / 1000000).toFixed(accuracy);
}

export function onlyNumbers(val) {
    return val
        .toString()
        .replace(/\D/g, '');
}

export function onlyLetters(val) {
    return val
        .toString()
        .replace(/[^a-zA-Z ]+/g, '');
}

export function prettyPhone(rawPhoneNumber) {
    return onlyNumbers(rawPhoneNumber).replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '+$1 ($2) $3-$4-$5');
}

export function toRoman(num) {
    const romanNumbers = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
    let roman = '';
    for (const i in romanNumbers) {
        while (num >= romanNumbers[i]) {
            roman += i;
            num -= romanNumbers[i];
        }
    }
    return roman;
}

export function quaterToRoman(num) {
    if (!Number.isInteger(num)) {
        console.warn('[Utils/prettyQuarter] Аргумент "num" должен быть Number: ', num);
        return '';
    }

    switch (num) {
        case 1:
            return ' I';
        case 2:
            return ' II';
        case 3:
            return ' III';
        default:
            return 'IV';
    }
}

export function currency(value) {
    return value.toLocaleString('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
}

export function squareMeter(num) {
    if (typeof num !== 'number' && !Number.isNaN(num)) {
        console.warn('[Utils/squareMeter] Аргумент "num" должен быть Number: ', num);
        return '';
    }
    return `${num.toLocaleString('ru-RU', {
        maximumFractionDigits: 1,
    })} м<sup>2</sup>`;
}
export function rooms(num, ending = 'комн') {
    if (typeof num !== 'number' && !Number.isNaN(num)) {
        console.warn('[Utils/rooms] Аргумент "num" должен быть Number: ', num);
        return '';
    }
    return num === 0
        ? 'Студия'
        : `${num}-${ending}.`;
}
