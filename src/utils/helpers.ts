export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


export function toSentenceCase(str) {
    var rg = /(^\w{1}|\.\s*\w{1})/gi;
    return str.toLowerCase().replace(rg, s => s.toUpperCase());
}

