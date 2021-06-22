export function plural(num, postfixes) {
    if (isNaN(num)) {
        return '';
    }

    const cases = [2, 0, 1, 1, 1, 2];
    return postfixes[num % 100 > 4 && num % 100 < 20 ? 2 : cases[Math.min(num % 10, 5)]];
}

export function capitalizeFirstLetter(string) {
    if (!string?.length) {
        return '';
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function initial(string) {
    if (!string?.length) {
        return '';
    }
    return string.charAt(0).toUpperCase();
}

export function replaceVariablesInTemplate(str, params) {
    return str.replace(/\{(\d+)\}/g, (match, index) => String(params[Number(index)]));
}

export function userNameWithInitialsFormatted(surname, name, patronymic) {
    // const { surname, name, patronymic } = this.$store.state.auth.user;
    const surnameCapitalized =capitalizeFirstLetter(surname);
    const nameInitial = initial(name);
    const patronymicInitial = initial(patronymic);
    let userName = '';
    if (surnameCapitalized) {
        userName += surnameCapitalized;
    }
    if (nameInitial) {
        userName += ` ${nameInitial}.`;
    }
    if (patronymicInitial) {
        userName += `${patronymicInitial}.`;
    }
    return userName;
}
