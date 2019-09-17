use std::collections::HashMap;

use std::process;

fn text_to_stat(file_name: &str) -> std::io::Result<HashMap<char, usize>> {
    use std::io::BufReader;
    use std::io::BufRead;
    use std::fs::File;

    let mut frequencies = HashMap::new();

    let file = File::open(&file_name)?;
    let reader = BufReader::new(file);

    for line in reader.lines() {
        let chars = line?;

        for (_, character) in chars.chars().enumerate() {
            *frequencies.entry(character.clone()).or_insert(0) += 1;
        }
    }

    return Ok(frequencies);
}


fn main() {
    use std::env;
    const DEFAULT_SIZE: &'static str = "20";

    println!("Salve, usator! Cifra Homomorphica te salutat.");

    let args: Vec<String> = env::args().collect();

    let (file_name, table_width, table_height): (&str, &str, &str) = match args.len() {
        0 | 1 => {
            println!("Necesse est dare (ut argumentum primum) nomen eius ducumenti quod basis calculationis frequentiae litterarum sit.");
            process::exit(100);
        },

        2 => (&args[1], &DEFAULT_SIZE, &DEFAULT_SIZE),
        3 => (&args[1], &args[2], &args[2]),
        4 | _ => (&args[1], &args[2], &args[3]),
    };

    let frequencies = text_to_stat(&file_name);

    match frequencies {
        Ok(freqs) => println!("Frequentia littararum: {:?}", freqs),
        Err(error) => println!("Frequenciam littararum calculare non possum, quia {}", error)
    }
}
