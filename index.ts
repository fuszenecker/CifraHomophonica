console.log("Salve, usator! Cifra Homomorphica te salutat.")

function parse_args(args: string[]) {
    const DEFAULT_TABLE_SIZE = 10

    let fileName: string;
    let tableWidth = DEFAULT_TABLE_SIZE
    let tableHeight = DEFAULT_TABLE_SIZE
    
    switch (process.argv.length)
    {
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

    return { fileName, tableWidth, tableHeight };
}

let configuration = parse_args(process.argv)
