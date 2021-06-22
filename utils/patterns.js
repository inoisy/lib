// const hex = /^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/;
// const hexa = /^#[0-9a-fA-F]{4}([0-9a-fA-F]{4})?$/;
// const hexOrHexa = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
// const rgb = /^rgb\(((0|[1-9][\d]?|1[\d]{0,2}|2[\d]?|2[0-4][\d]|25[0-5]),){2}(0|[1-9][\d]?|1[\d]{0,2}|2[\d]?|2[0-4][\d]|25[0-5])\)$/;
// const rgba = /^rgba\(((0|[1-9][\d]?|1[\d]{0,2}|2[\d]?|2[0-4][\d]|25[0-5]),){2}(0|[1-9][\d]?|1[\d]{0,2}|2[\d]?|2[0-4][\d]|25[0-5]),(0|0\.[0-9]+[1-9]|0\.[1-9]+|1)\)$/;

// export const testPatterns = {
// date: v => /^-?[\d]+\/[0-1]\d\/[0-3]\d$/.test(v),
// time: v => /^([0-1]?\d|2[0-3]):[0-5]\d$/.test(v),
// fulltime: v => /^([0-1]?\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(v),
// timeOrFulltime: v => /^([0-1]?\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(v),

// hexColor: v => hex.test(v),
// hexaColor: v => hexa.test(v),
// hexOrHexaColor: v => hexOrHexa.test(v),

// rgbColor: v => rgb.test(v),
// rgbaColor: v => rgba.test(v),
// rgbOrRgbaColor: v => rgb.test(v) || rgba.test(v),

// hexOrRgbColor: v => hex.test(v) || rgb.test(v),
// hexaOrRgbaColor: v => hexa.test(v) || rgba.test(v),
// anyColor: v => hexOrHexa.test(v) || rgb.test(v) || rgba.test(v),
//     cyrillicAlpha: v => /^([а-яА-ЯЁё]*?)$/.test(v),
//     passportNum: v => /^([0-9]{2}\s[0-9]{2}\s{1}[0-9]{6})?$/.test(v),
//     birthDate: v => /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/.test(v),
// };
export const cyrillicAlpha = v => /^([а-яА-ЯЁё]*?)$/.test(v);
export const passportNum = v => /^([0-9]{2}\s[0-9]{2}\s{1}[0-9]{6})?$/.test(v);
export const birthDate = v => /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/.test(v);
export const phone = v => v && !(v.replace(/[^0-9]/g, '').length < 11);

// export default {
//     ...testPatterns,
// };
