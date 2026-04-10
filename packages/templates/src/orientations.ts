export type PageOrientation = typeof validOrientations[number];

export const validOrientations = ['portrait', 'landscape', 'auto'] as const;

export function isValidOrientation(orientation: string): orientation is PageOrientation {
    return (validOrientations as readonly string[]).includes(orientation);
}

export class InvalidOrientation extends Error {
    constructor(orientation: string, options?: ErrorOptions) {
        super(`Invalid orientation ${orientation}, must be one of ${validOrientations.join(', ')}`, options);
    }
}
