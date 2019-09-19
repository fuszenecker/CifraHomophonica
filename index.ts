import { createReadStream } from "fs";

console.log("Salve, usator! Cifra Homomorphica te salutat.")

const keys = [
    "0", "1", "2", "3", "4", "5",
    "6", "7", "8", "9", "A", "B",
    "C", "D", "E", "F", "G", "H",
    "I", "J", "K", "L", "M", "N",
    "O", "P", "Q", "R", "S", "T",
    "U", "V", "W", "X", "Y", "Z",
]

const charsToSkip = ["\n", "\r", "\t", "\"", "{", "}", "@", "[", "]", "(", ")", "/"]

function parse_args(args: string[]) {
    const DEFAULT_TABLE_SIZE = 10

    let fileName: string;
    let tableWidth = DEFAULT_TABLE_SIZE
    let tableHeight = DEFAULT_TABLE_SIZE
    
    switch (process.argv.length) {
        case 0:
        case 1:
        case 2:
            console.error("Necesse est dare (ut argumentum primum) nomen eius ducumenti quod basis calculationis frequentiae litterarum sit.")
            process.exit(100)
            break;
        case 3:
            fileName = args[2]
            tableWidth = tableHeight = DEFAULT_TABLE_SIZE
            break;
        case 4:
            fileName = args[2]
            tableWidth = tableHeight = Number.parseInt(args[3])
            break;
        default:
            fileName = args[2]
            tableWidth = Number.parseInt(args[3])
            tableHeight = Number.parseInt(args[4])
            break;
    }

    if (tableWidth > keys.length || tableHeight > keys.length) {
        console.error(`Dimensio tabulae est maior quam ${keys.length}."`)
        process.exit(200)
    }

    return { fileName, tableWidth, tableHeight };
}

function textToStat(fileName: string, onDoneCallback) {
    const stream = createReadStream(fileName)
    stream.setEncoding("utf-8")

    const frequencies = new Map<string, number>()

    stream.on("open", listener => {
        console.debug(`Apertum est documentum processandum cuius nomen est ${fileName}`)
    })

    stream.on("data", (data: string) => {
        for (let char of data) {
            let upperCaseChar = char.toUpperCase()

            if (!charsToSkip.includes(upperCaseChar)) {
                frequencies.set(upperCaseChar, (frequencies.has(upperCaseChar) ? frequencies.get(upperCaseChar) : 0) + 1)
            }

        }
    })

    stream.on("close", () => { onDoneCallback(frequencies) })
}

function scaleFrequencies(frequencies: Map<string, number>, tableWidth, tableHeight) {
    let numberOfChars = 0

    frequencies.forEach((value, key) => {
        numberOfChars += value
    })

    const numberOfCells = tableWidth * tableHeight
    const scaledFrequencies = new Map<string, number>();

    let totalCellsRequired = 0;
    let factor = 1.0

    do {
        totalCellsRequired = 0;

        frequencies.forEach((value, key) => {
            let cellsRequired = Math.floor(numberOfCells * value / numberOfChars * factor)
            let newValue = (cellsRequired < 1) ? 1 : cellsRequired
            scaledFrequencies.set(key, newValue)

            totalCellsRequired += cellsRequired
        })

        factor -= 0.001
    } while (totalCellsRequired > numberOfCells)

    return { scaledFrequencies, totalCellsRequired }
}

function createRandomizerVector({ scaledFrequencies, totalCellsRequired }) {
    const randomizerVector = new Array<string>()

    scaledFrequencies.forEach((value, key) => {
        for (let c = 0; c < value; c++) {
            randomizerVector.push(key)
        }
    })

    return randomizerVector
}

function coordsToString(x: number, y?: number): string {
    return (y === undefined) ? keys[x] : `${keys[y]}${keys[x]}`
}

function createEncryptionTables(randomizerVector: Array<string>, tableWidth: number, tableHeight: number, expectedNumberOfCharacters: number) {
    let decryptionTable: Array<Array<string>> = null;
    let encryptionTable: Map<string, Array<string>> = null;

    do {
        encryptionTable = new Map<string, Array<string>>()
        decryptionTable = Array<Array<string>>()

        for (let y = 0; y < tableHeight; y++) {
            const row = new Array<string>()
            decryptionTable.push(row)

            for (let x = 0; x < tableWidth; x++) {
                const char = randomizerVector[Math.floor(Math.random() * randomizerVector.length)];
                row.push(char)

                if (encryptionTable.has(char)) {
                    encryptionTable.get(char).push(coordsToString(x, y))
                } else {
                    var array = new Array<string>()
                    array.push(coordsToString(x, y))
                    encryptionTable.set(char, array)
                }
            }
        }
    } while (encryptionTable.size != expectedNumberOfCharacters)

    return { encryptionTable, decryptionTable }
}

function printHorizontalLine(tableWidth: number) {
    let line = "+---+"
    for (let i = 0; i < tableWidth; i++) {
        line += "---+"
    }
    console.log(line)
}

function printTables(encryptionTable: Map<string, Array<string>>, decryptionTable: Array<Array<string>>, tableWidth, tableHeight) {
    console.log()
    console.log("Tabula ad litteras cifrandas")
    console.log("----------------------------")
    console.log()

    for (let key of [...encryptionTable.keys()].sort()) {
        console.log(`${key} | ${encryptionTable.get(key)}`)
    }

    console.log()
    console.log("Tabula ad litteras decifrandas")
    console.log("------------------------------")
    console.log()

    printHorizontalLine(tableWidth)

    let line = "|   |"
    for (let i = 0; i < tableWidth; i++) {
        line += ` ${coordsToString(i)} |`
    }
    console.log(line)

    printHorizontalLine(tableWidth)

    for (let y = 0; y < tableHeight; y++) {
        line = `| ${coordsToString(y)} |`
        for (let x = 0; x < tableWidth; x++) {
            line += ` ${decryptionTable[y][x]} |`
        }

        console.log(line)
    }

    printHorizontalLine(tableWidth)
}

function generateTables(frequencies: Map<string, number>, {fileName, tableWidth, tableHeight}) {
    const result = scaleFrequencies(frequencies, tableWidth, tableHeight)
    const randomizerVector = createRandomizerVector(result)
    const tables = createEncryptionTables(randomizerVector, tableWidth, tableHeight, result.scaledFrequencies.size)

    if (tables.encryptionTable.size != result.scaledFrequencies.size) {
        console.error(`Creare tabalam ad cifrandum decifrandumque non possum. Numerus litterae: in tabula cifrandi sunt ${tables.encryptionTable.size}, in tabula frequentiae sunt ${result.scaledFrequencies.size}`)
        process.exit(300)
    } else {
        printTables(tables.encryptionTable, tables.decryptionTable, tableWidth, tableHeight)
    }
}

let configuration = parse_args(process.argv)
textToStat(configuration.fileName, frequencies => generateTables(frequencies, configuration))
