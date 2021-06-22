export function getImageUrl(payload) {
    if (!payload) {
        return null;
    }
    if (typeof payload ==='object') {
        return payload.aws;
    }
    return payload;
}
