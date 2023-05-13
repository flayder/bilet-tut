export const RandomStringFunction = () => {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var result = '';
    for ( var i = 0; i < 3; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length)) + randomChars.charAt(Math.floor(Math.random() * randomChars.length))
    }
    return result;
}