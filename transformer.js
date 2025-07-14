const obfuscatingTransformer = require("react-native-obfuscating-transformer")

module.exports = obfuscatingTransformer({
    stringArray: true, // Moves string literals (like API URLs) into arrays
    stringArrayEncoding: ['base64'],
    stringArrayRotate: true,
    splitStrings: true, // Splits long strings into smaller chunks
    renameGlobals: true,
    selfDefending: true, // Makes the code harder to reverse-engineer
    identifierNamesGenerator: 'hexadecimal',
    disbaleConsoleOutput: true, 
})