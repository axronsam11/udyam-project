export function generateReferenceNumber(): string {
  const prefix = "UR";
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
  
  return `${prefix}${year}${randomNum}`;
}