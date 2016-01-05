import RouteTrie from 'route-trie';

export default class Trie {
  constructor() {
    this.__routeTrie = new RouteTrie();
  }

  define(pattern) {
    let routeTrieNode = this.__routeTrie.define(pattern);
    return new Node(this, routeTrieNode);
  }

  match(path) {
    let routeTrieMatch = this.__routeTrie.match(path);
    return routeTrieMatch !== null
      ? new Match(this, routeTrieMatch)
      : null;
  }

  is(firstNode, secondNone) {
    return firstNode.__routeTrieNode === secondNone.__routeTrieNode;
  }
}

class Node {
  constructor(trie, routeTrieNode) {
    this.__trie = trie;
    this.__routeTrieNode = routeTrieNode;
  }

  get pattern() {
    return this.__routeTrieNode._nodeState.pattern;
  }
}

class Match {
  constructor(trie, routeTrieMatch) {
    this.__trie = trie;
    this.__routeTrieMatch = routeTrieMatch;
  }

  get params() {
    return this.__routeTrieMatch.params;
  }

  get node() {
    return new Node(this.__trie, this.__routeTrieMatch.node);
  }
}
