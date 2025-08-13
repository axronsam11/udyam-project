import { DataClient } from "./DataClient";
import { generateReferenceNumber } from "../utils/referenceGenerator";
import { delay } from "../utils/delay";

export class MockDataClient implements DataClient {
  private readonly STORAGE_KEY = "udyam_draft";

  async saveDraft(data: any): Promise<void> {
    await delay(500); // Simulate network delay
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
      data,
      timestamp: new Date().toISOString()
    }));
  }

  async loadDraft(): Promise<any | null> {
    await delay(200);
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const { data } = JSON.parse(stored);
      return data;
    }
    return null;
  }

  async submit(data: any): Promise<{ reference: string }> {
    await delay(2000); // Simulate longer submission process
    
    // Clear draft after successful submission
    localStorage.removeItem(this.STORAGE_KEY);
    
    return {
      reference: generateReferenceNumber()
    };
  }

  async lookupPin(pincode: string): Promise<{ state: string; district: string } | null> {
    await delay(800);
    
    // Mock PIN code database
    const pinDatabase: Record<string, { state: string; district: string }> = {
      "110001": { state: "Delhi", district: "Central Delhi" },
      "400001": { state: "Maharashtra", district: "Mumbai City" },
      "560001": { state: "Karnataka", district: "Bengaluru Urban" },
      "600001": { state: "Tamil Nadu", district: "Chennai" },
      "700001": { state: "West Bengal", district: "Kolkata" },
      "500001": { state: "Telangana", district: "Hyderabad" },
      "411001": { state: "Maharashtra", district: "Pune" },
      "302001": { state: "Rajasthan", district: "Jaipur" },
      "380001": { state: "Gujarat", district: "Ahmedabad" },
      "201001": { state: "Uttar Pradesh", district: "Ghaziabad" },
      "122001": { state: "Haryana", district: "Gurgaon" },
      "201301": { state: "Uttar Pradesh", district: "Gautam Buddha Nagar" },
      "226001": { state: "Uttar Pradesh", district: "Lucknow" },
      "282001": { state: "Uttar Pradesh", district: "Agra" },
      "324001": { state: "Rajasthan", district: "Kota" }
    };

    return pinDatabase[pincode] || null;
  }

  async lookupIfsc(ifscCode: string): Promise<{ bank: string; branch: string } | null> {
    await delay(1000);
    
    // Mock IFSC database
    const ifscDatabase: Record<string, { bank: string; branch: string }> = {
      "SBIN0000001": { bank: "State Bank of India", branch: "New Delhi Main Branch" },
      "HDFC0000001": { bank: "HDFC Bank", branch: "Mumbai Main Branch" },
      "ICIC0000001": { bank: "ICICI Bank", branch: "Mumbai Main Branch" },
      "AXIS0000001": { bank: "Axis Bank", branch: "Ahmedabad Main Branch" },
      "PUNB0000001": { bank: "Punjab National Bank", branch: "New Delhi Branch" },
      "BKID0000001": { bank: "Bank of India", branch: "Mumbai Fort Branch" },
      "CNRB0000001": { bank: "Canara Bank", branch: "Bengaluru Main Branch" },
      "UBIN0000001": { bank: "Union Bank of India", branch: "Mumbai Main Branch" },
      "IDIB0000001": { bank: "Indian Bank", branch: "Chennai Main Branch" },
      "IOBA0000001": { bank: "Indian Overseas Bank", branch: "Chennai Branch" },
      "CBIN0000001": { bank: "Central Bank of India", branch: "Mumbai Central Branch" },
      "YESB0000001": { bank: "Yes Bank", branch: "Mumbai Branch" },
      "KKBK0000001": { bank: "Kotak Mahindra Bank", branch: "Mumbai BKC Branch" },
      "INDB0000001": { bank: "IndusInd Bank", branch: "Mumbai Branch" },
      "FDRL0000001": { bank: "Federal Bank", branch: "Kochi Main Branch" }
    };

    return ifscDatabase[ifscCode] || null;
  }
}