export type PageSize = typeof validSizes[number];

export const validSizes = ['A5', 'A4', 'A3', 'B5', 'B4', 'JIS-B5', 'JIS-B4', 'letter', 'legal', 'ledger'] as const;

export function isValidSize(size: string): size is PageSize {
    return (validSizes as readonly string[]).includes(size);
}

export class InvalidSize extends Error {
    constructor(size: string, options?: ErrorOptions) {
        super(`Invalid size ${size}, must be one of ${validSizes.join(', ')}`, options);
    }
}
