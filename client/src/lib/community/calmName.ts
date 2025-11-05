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

// Reserved owner Vibe ID - never generate this
const RESERVED_OWNER_ID = "Charae 💧";

export function generateCalmName(): string {
  let attempt = 0;
  let generated: string;
  
  // Keep generating until we get a name that's not the reserved owner ID
  do {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const number = Math.floor(Math.random() * 100);
    generated = `${adjective}${noun}${number}`;
    attempt++;
    
    // Safety: prevent infinite loop (extremely unlikely but safe)
    if (attempt > 10) break;
  } while (generated === RESERVED_OWNER_ID);
  
  return generated;
}
