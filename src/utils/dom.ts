export const $create = (tag: string) => document.createElement(tag);
export const $id = document.getElementById.bind(document);
export const $class = document.getElementsByClassName.bind(document);
