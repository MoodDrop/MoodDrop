const adjectives = [
  "Quiet", "Gentle", "Soft", "Serene", "Peaceful", "Calm", "Still", 
  "Silent", "Tender", "Kind", "Warm", "Light", "Bright", "Pure",
  "Sweet", "Mild", "Cool", "Clear", "Fresh", "Steady"
];

const nouns = [
  "Bloom", "Breeze", "Cloud", "Dawn", "Dusk", "Echo", "Ember",
  "Leaf", "Mist", "Moon", "Ocean", "Petal", "Rain", "River",
  "Sky", "Star", "Stone", "Sun", "Wave", "Wind"
];

export function generateCalmName(): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 100);
  return `${adjective}${noun}${number}`;
}
