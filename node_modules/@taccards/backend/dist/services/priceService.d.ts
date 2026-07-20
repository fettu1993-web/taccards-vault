export declare function fetchCardHedgePrice(externalId: string, gradeLabel?: string): Promise<{
    price: number;
    confidence: string;
    source: "cardhedge";
} | null>;
export declare function fetchCardHedgeSalesHistory(externalId: string, gradeLabel?: string, limit?: number): Promise<{
    price: number;
    date: string;
    platform: string;
}[]>;
export declare function syncCardPrices(cardId: string): Promise<void>;
export declare function fetchEbayPrices(query: string, marketId?: string): Promise<any>;
