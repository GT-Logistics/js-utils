import ejs from "ejs";
import {PageOptions, PageOrientation, PageSize, PrintOptions} from "./interfaces.js";
import {InvalidSize, isValidSize} from "./size.js";
import {InvalidOrientation, isValidOrientation} from "./orientations.js";

interface ResolvedPageOptions {
    orientation?: PageOrientation,
    size?: PageSize | string,
    margin?: string,
}

function resolveOptions(
    pageOptions: PageOptions,
    templateOptions: DOMStringMap
): ResolvedPageOptions {
    let size = pageOptions.size || templateOptions.pageSize;
    const orientation = pageOptions.orientation || templateOptions.pageOrientation;
    const margin = pageOptions.margin || templateOptions.pageMargin;

    if (typeof size === 'string' && !isValidSize(size)) {
        throw new InvalidSize(size);
    }
    if (typeof size === 'object') {
        size = `${size.width} ${size.height}`;
    }

    if (typeof orientation === 'string' && !isValidOrientation(orientation)) {
        throw new InvalidOrientation(orientation);
    }

    return {
        size,
        orientation,
        margin,
    }
}

function compile(
    template: HTMLScriptElement,
    data: Record<string, unknown>,
    helpers: Record<string, unknown>
): void {
    const fragment = document.createElement('div');

    fragment.innerHTML = ejs.render(template.textContent, { ...data, ...helpers });
    fragment.id = template.id;
    fragment.className = template.className;
    fragment.style.cssText = template.style.cssText;

    template.replaceWith(fragment);
}

function setPage(pageOptions: ResolvedPageOptions): void {
    const style = document.createElement('style');
    let size = pageOptions.size;
    let orientation = pageOptions.orientation;
    let margin = pageOptions.margin;

    style.innerHTML = `@page {size: ${size} ${orientation}; margin: ${margin};}`;
    document.head.append(style);
}

export function print(data: Record<string, unknown>, options: PrintOptions = {}) {
    const templateId = options.template;
    let templateSelector = 'script[type="application/x-ejs"]';
    if (templateId) {
        templateSelector += '#' + CSS.escape(templateId);
    }

    if (!options.page) {
        options.page = {};
    }
    if (!options.page.orientation) {
        options.page.orientation = 'portrait';
    }
    if (!options.page.size) {
        options.page.size = 'letter';
    }
    if (!options.page.margin) {
        options.page.margin = '1in';
    }

    const template = document.querySelector<HTMLScriptElement>(templateSelector);
    const pageOptions = resolveOptions(options.page, template.dataset);

    // The page options takes priority
    // over the default data-* properties on the <script> template
    setPage(pageOptions);
    compile(template, data, {});

    document.title = options.title || 'print';
    window.print();
}
