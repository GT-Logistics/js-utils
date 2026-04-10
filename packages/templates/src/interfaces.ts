import type { PageOrientation } from "./orientations.js";
import type { PageSize } from "./size.js";

export type { PageOrientation, PageSize };

export interface CustomPageSize {
    width: string,
    height: string,
}

export interface PageOptions {
    orientation?: PageOrientation,
    size?: PageSize | CustomPageSize,
    margin?: string,
}

export interface PrintOptions {
    template?: string,
    title?: string
    page?: PageOptions,
}
