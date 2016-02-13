import virtualDomH from 'virtual-dom/h';

export default function virtualDomSpreadH(tagName, properties, ...children) {
  // Dirty fix, see https://github.com/Matt-Esch/virtual-dom/pull/297 and https://phabricator.babeljs.io/T2034
  return Object.prototype.toString.call(children[0]) === '[object Array]'
    ? virtualDomH(tagName, properties, children[0])
    : virtualDomH(tagName, properties, children);
}
