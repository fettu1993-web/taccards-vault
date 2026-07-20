export interface ScanResult {
    cardId: string | null;
    card: any | null;
    confidence: number;
    provider: 'cardsight' | 'manual_search';
    rawResponse?: any;
}
export declare function identifyCardFromImage(imageBase64: string, userId: string): Promise<ScanResult>;
export declare function confirmScan(scanLogId: string, confirmedCardId: string): Promise<void>;
