/**
 * DOM manipulation utility helpers.
 * @module utils/dom
 */

/**
 * querySelector shorthand.
 * @param {string} selector - CSS selector
 * @param {ParentNode} [context=document] - Context to query within
 * @returns {HTMLElement|null}
 */
export function $(selector, context = document) {
  return context.querySelector(selector);
}

/**
 * querySelectorAll shorthand.
 * @param {string} selector - CSS selector
 * @param {ParentNode} [context=document] - Context to query within
 * @returns {NodeListOf<HTMLElement>}
 */
export function $$(selector, context = document) {
  return context.querySelectorAll(selector);
}

/**
 * Create an element with attributes and children.
 * @param {string} tag - HTML tag name
 * @param {Object} [attrs={}] - Attributes ({ class, id, dataset, text, html, onClick })
 * @param {Array<HTMLElement|string>} [children=[]] - Child elements or text
 * @returns {HTMLElement}
 */
export function createElement(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);

  for (const [key, value] of Object.entries(attrs)) {
    if (key === 'text') {
      el.textContent = value;
    } else if (key === 'html') {
      el.innerHTML = value;
    } else if (key === 'dataset') {
      Object.assign(el.dataset, value);
    } else if (key.startsWith('on') && typeof value === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (value === true) {
      el.setAttribute(key, '');
    } else if (value !== false && value != null) {
      el.setAttribute(key, value);
    }
  }

  for (const child of children) {
    if (child instanceof Node) {
      el.appendChild(child);
    } else {
      el.appendChild(document.createTextNode(String(child)));
    }
  }

  return el;
}

/**
 * Remove all children of an element.
 * @param {HTMLElement} el - Target element
 * @returns {void}
 */
export function clearElement(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

/**
 * Safely insert HTML via insertAdjacentHTML.
 * @param {HTMLElement} el - Target element
 * @param {string} position - 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend'
 * @param {string} html - HTML string
 * @returns {void}
 */
export function insertHTML(el, position, html) {
  el.insertAdjacentHTML(position, html);
}
