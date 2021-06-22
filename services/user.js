import { capitalizeFirstLetter, initial } from '../utils/text-utils';
import { cleanPhone } from '../utils/common';


export function unformatUserPersonal({ birth_date = '', email, name, patronymic, surname, passport_series= '', passport_number= '' }) {
    const birthDate = birth_date
        ? birth_date.split('-').reverse()
            .join('/')
        : '';
    const passport = passport_series && passport_number ? `${passport_series.slice(0, 2)} ${passport_series.slice(2, 4)} ${passport_number}` : '';
    return {
        birthDate,
        // phone: phone || '',
        email: email||'',
        name: name||'',
        passport,
        patronymic: patronymic||'',
        surname: surname||'',
    };
}

export function formatUserPersonal({ phone= '', birthDate='', email='', name='', patronymic='', surname='', passport='' }) {
    const passportTrimmed = passport.replace(/\s/g, '');
    let passport_series = '';
    let passport_number = '';
    if (passportTrimmed.length) {
        passport_series = passportTrimmed.slice(0, 4);
        passport_number = passportTrimmed.slice(4);
    }

    return {
        birth_date: birthDate.split('/').reverse()
            .join('-'),
        name,
        email,
        phone: phone ? cleanPhone(phone) : '',
        surname,
        patronymic,
        passport_series,
        passport_number,
    };
}

const USER_FIELDS = [
    'name',
    'patronymic',
    'surname',
    'passport',
    'email',
    'birthDate',
];
class UserUpdateError {
    constructor(error) {
        let errorReason = 'unknown';
        let errorMessage = 'Ошибка при обновлении данных';
        if (Boolean(error?.response?.data) && typeof error.response.data === 'object' && Boolean(Object.keys(error.response.data).length)) {
            const { reason, message } = error?.response?.data;
            const field = USER_FIELDS.reduce((acc, val) => {
                if (reason.includes(val)) {
                    acc=val;
                }
                return acc;
            }, '');
            if (reason) {
                errorReason = field;
            }
            if (message) {
                errorMessage = message;
            }
        }
        this.ok = false;
        this.reason = errorReason;
        this.message = errorMessage;
    }
}

export async function updateUser(payload) {
    try {
        const values = formatUserPersonal(payload);
        const patchUser = await this.$axios.$patch('/api/users/partial_update', values);
        await this.$auth.setUser(patchUser);
        return {
            ok: true,
            message: 'Данные успешно сохранены',
        };
    } catch (error) {
        return new UserUpdateError(error);
    }
}

export function getMeFromStore() {
    return unformatUserPersonal(this.$store.state.auth.user);
}

export function userNameWithInitialsFormatted() {
    const { surname, name, patronymic } = this.$store.state.auth.user;
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
