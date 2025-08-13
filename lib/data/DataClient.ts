export interface DataClient {
  saveDraft(data: any): Promise<void>;
  loadDraft(): Promise<any | null>;
  submit(data: any): Promise<{ reference: string }>;
  lookupPin(pincode: string): Promise<{ state: string; district: string } | null>;
  lookupIfsc(ifscCode: string): Promise<{ bank: string; branch: string } | null>;
}