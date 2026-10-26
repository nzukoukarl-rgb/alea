export function canUseSpeechSynthesis(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}
export function speakFallback(text: string, lang = "fr-FR"): boolean {
  if (!canUseSpeechSynthesis() || !text.trim()) return false;
  const synthesis = window.speechSynthesis;
  synthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text.slice(0, 2400));
  utterance.lang = lang;
  utterance.rate = 0.96;
  const voices = synthesis.getVoices();
  const voice = voices.find((candidate) => candidate.lang.toLowerCase().startsWith("fr"));
  if (voice) utterance.voice = voice;
  synthesis.speak(utterance);
  return true;
}
