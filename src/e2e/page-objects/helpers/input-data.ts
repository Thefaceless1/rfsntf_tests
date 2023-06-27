import {randomInt} from "crypto";

export class InputData {
    /**
     * Get current date
     */
    public static currentDate  : string = new Date().toLocaleDateString();
    /**
     * Current module version
     */
    public static moduleVersion : string = "10.1.1.1";
    /**
     * Random set of letters
     */
    public static get randomWord() : string {
        const alphabet: string = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
        let randomWord: string = "автотест|";
        while (randomWord.length < 20) {
            randomWord += alphabet[randomInt(0, alphabet.length)];

        }
        return randomWord;
    }
}