export class UsernameUtils {
  public static generateUsername(): string {
    const adjectives = ["Swift", "Epic", "Phantom", "Shadow", "Quantum", "Stealth"];
    const nouns = ["Coder", "Dev", "Hacker", "Ninja", "Wizard", "Architect"];
    const randomNumber = Math.floor(100 + Math.random() * 900); // 3-digit random number

    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

    return `${randomAdjective}${randomNoun}_${randomNumber}`;
  }
}
