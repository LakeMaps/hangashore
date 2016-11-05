import {h, VNode} from '@cycle/dom';

/**
 * @see https://git.io/vX4LY
 */
type klasses = { [key: string]: boolean; };

const hyperx = require(`hyperx`);

/**
 * Returns a {@code VNode} tree representing the given HTML string.
 *
 * This is but a wrapper around hyperx to adjust its attrs for snabbdom, where snabbdom uses
 * various modules (`class`, `props`, `attrs`, and `style`) instead of a single attrs object.
 */
const html: (s: TemplateStringsArray, ...vals: any[]) => VNode = hyperx((tag: string, attrs: any, children: any[]) => {
    const klass: klasses = {};
    if (attrs.className && typeof attrs.className == `string`) {
        attrs.className.split(' ').map((className: string) => klass[className] = true);
        delete attrs.className;
    }
    return h(tag, {class: klass, attrs}, children);
});

export { html }
