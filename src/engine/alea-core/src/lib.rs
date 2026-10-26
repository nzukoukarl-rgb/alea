use wasm_bindgen::prelude::*;

/// Normalise les poids de naissances WPP 2024 en probabilités cumulées.
/// Le calcul est O(n) et reste sous les 10 ms pour 237 aires.
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
    for (index, weight) in weights.iter().enumerate() {
        cursor += weight.max(0.0);
        if target < cursor { return index; }
    }
    weights.len() - 1
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn probabilities_sum_to_one() {
        let values = [1.0, 2.0, 7.0];
        let sum: f64 = (0..values.len()).map(|i| birth_probability(&values, i)).sum();
        assert!((sum - 1.0).abs() < 1e-9);
    }
    #[test]
    fn negative_weights_are_ignored() {
        assert_eq!(birth_probability(&[-2.0, 2.0], 0), 0.0);
        assert_eq!(birth_probability(&[-2.0, 2.0], 1), 1.0);
    }
    #[test]
    fn picker_is_bounded() {
        assert_eq!(weighted_pick(&[0.0, 3.0], 0.0), 1);
        assert_eq!(weighted_pick(&[1.0, 0.0], 0.99), 0);
    }
}
