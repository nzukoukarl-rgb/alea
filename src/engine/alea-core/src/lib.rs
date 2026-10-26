use wasm_bindgen::prelude::*;

// Table de poids issue du registre pays embarqué et versionnée avec la simulation.
// Le front enrichit les indicateurs économiques par le snapshot World Bank/OWID.
const COUNTRIES: &[(&str, f64)] = &[
    ("Inde", 23200.0), ("Chine", 9020.0), ("Nigéria", 7540.0), ("Pakistan", 6500.0), ("Indonésie", 4450.0),
    ("République démocratique du Congo", 4100.0), ("Éthiopie", 3800.0), ("États-Unis", 3660.0), ("Bangladesh", 3100.0), ("Brésil", 2750.0),
    ("Égypte", 2400.0), ("Tanzanie", 2300.0), ("Mexique", 1900.0), ("Philippines", 1750.0), ("Ouganda", 1650.0), ("Soudan", 1550.0),
    ("Kenya", 1500.0), ("Afghanistan", 1400.0), ("Viêt Nam", 1400.0), ("Angola", 1300.0), ("Russie", 1260.0), ("Mozambique", 1200.0),
    ("Niger", 1100.0), ("Irak", 1100.0), ("Afrique du Sud", 1100.0), ("Iran", 1050.0), ("Côte d'Ivoire", 950.0), ("Turquie", 950.0),
    ("Cameroun", 900.0), ("Ghana", 900.0), ("Yémen", 900.0), ("Myanmar", 900.0), ("Algérie", 900.0), ("Madagascar", 850.0),
    ("Mali", 850.0), ("Burkina Faso", 800.0), ("Japon", 730.0), ("Allemagne", 690.0), ("France", 680.0), ("Royaume-Uni", 670.0),
    ("Maroc", 650.0), ("Colombie", 650.0), ("Népal", 560.0), ("Arabie saoudite", 550.0), ("Sénégal", 550.0), ("Argentine", 520.0),
    ("Pérou", 520.0), ("Thaïlande", 500.0), ("Italie", 390.0), ("Canada", 360.0), ("Espagne", 330.0), ("Australie", 300.0),
    ("Ukraine", 280.0), ("Pologne", 270.0), ("Corée du Sud", 230.0),
];

fn unit(seed: u64) -> f64 {
    let mut x = seed.wrapping_add(0x9e3779b97f4a7c15);
    x = (x ^ (x >> 30)).wrapping_mul(0xbf58476d1ce4e5b9);
    x = (x ^ (x >> 27)).wrapping_mul(0x94d049bb133111eb);
    ((x ^ (x >> 31)) >> 11) as f64 / 9007199254740992.0
}

#[wasm_bindgen]
pub fn tirage_pays_pondere(seed: u64) -> String {
    let total: f64 = COUNTRIES.iter().map(|(_, weight)| weight).sum();
    let mut cursor = unit(seed) * total;
    for (country, weight) in COUNTRIES { cursor -= weight; if cursor <= 0.0 { return (*country).to_string(); } }
    COUNTRIES.last().unwrap().0.to_string()
}

#[wasm_bindgen]
pub fn tirage_sexe(pays: &str) -> f64 { unit(pays.bytes().map(u64::from).sum::<u64>() ^ 0x51) }

#[wasm_bindgen]
pub fn tirage_prenom(pays: &str, sexe: &str) -> String {
    let feminine = ["Amina", "Lina", "Nour", "Maya", "Hana", "Amira"];
    let masculine = ["Adam", "Noah", "Omar", "Arjun", "Ren", "Yacine"];
    let names = if sexe == "f" { &feminine } else { &masculine };
    names[(pays.bytes().map(usize::from).sum::<usize>() % names.len())].to_string()
}

#[wasm_bindgen]
pub fn tirage_revenu(pays: &str) -> (u8, f64) {
    let quintile = (unit(pays.bytes().map(u64::from).sum::<u64>() ^ 0x9a) * 5.0).floor() + 1.0;
    (quintile as u8, 1000.0 * (0.35 + quintile * 0.22))
}

#[wasm_bindgen]
pub fn calcul_esperance(_pays: &str, sexe: &str, decile: u8) -> f64 {
    72.0 + if sexe == "f" { 2.5 } else { -2.5 } - if decile < 2 { 5.0 } else { 0.0 }
}

#[wasm_bindgen]
pub fn birth_probability(weights: &[f64], index: usize) -> f64 {
    if weights.is_empty() || index >= weights.len() { return 0.0; }
    let total: f64 = weights.iter().map(|v| v.max(0.0)).sum();
    if total <= 0.0 { return 0.0; }
    weights[index].max(0.0) / total
}

#[wasm_bindgen]
pub fn weighted_pick(weights: &[f64], ticket: f64) -> usize {
    if weights.is_empty() { return 0; }
    let total: f64 = weights.iter().map(|v| v.max(0.0)).sum();
    if total <= 0.0 { return 0; }
    let target = ticket.clamp(0.0, 0.999999) * total;
    let mut cursor = 0.0;
    for (index, weight) in weights.iter().enumerate() { cursor += weight.max(0.0); if target < cursor { return index; } }
    weights.len() - 1
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test] fn seed_is_stable() { assert_eq!(tirage_pays_pondere(42), tirage_pays_pondere(42)); }
    #[test] fn probabilities_sum_to_one() { let values = [1.0, 2.0, 7.0]; let sum: f64 = (0..values.len()).map(|i| birth_probability(&values, i)).sum(); assert!((sum - 1.0).abs() < 1e-9); }
    #[test] fn negative_weights_are_ignored() { assert_eq!(birth_probability(&[-2.0, 2.0], 0), 0.0); assert_eq!(birth_probability(&[-2.0, 2.0], 1), 1.0); }
    #[test] fn picker_is_bounded() { assert_eq!(weighted_pick(&[0.0, 3.0], 0.0), 1); assert_eq!(weighted_pick(&[1.0, 0.0], 0.99), 0); }
}
