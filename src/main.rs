use std::env;
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
    println!("Salve, usator! Cifra Homomorphica te salutat.");

    let args: Vec<String> = env::args().collect();

    if args.len() >= 2 {
        let filename = &args[1];
        let frequencies = text_to_stat(&filename);

        match frequencies {
            Ok(freqs) => println!("Frequentia littararum: {:?}", freqs),
            Err(error) => println!("Frequenciam littararum calculare non possum, quia {}", error)
        }
    } else {
        println!("Necesse est dare (ut argumentum primum) nomen eius ducumenti quod basis calculationis frequentiae litterarum sit.");
        process::exit(100);
    }
}
