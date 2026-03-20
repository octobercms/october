export class CompleterBase {
    intellisense;

    constructor(intellisense) {
        this.intellisense = intellisense;
    }

    get alphaNumCharacters() {
        return [
            'a',
            'b',
            'c',
            'd',
            'e',
            'f',
            'g',
            'h',
            'i',
            'j',
            'k',
            'l',
            'm',
            'n',
            'o',
            'p',
            'q',
            'r',
            's',
            't',
            'u',
            'v',
            'w',
            'x',
            'y',
            'z',
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '0'
        ];
    }

    get utils() {
        return this.intellisense.utils;
    }

    provideCompletionItems(model, position) {}
}
