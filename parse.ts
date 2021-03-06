import {css, root, rules, matchedRoot, computedRoot} from './db.ts'

interface Declaration {
  [k: string]: string;
}
interface Rule {
  selector: string;
  declarations: Declaration[];
}

function getRules(css: string): Rule[] {
  let s = '',
    selector = '';
  const rules = [];
  let declarations = [];
  for (let i = 0; i < css.length; i++) {
    if (css[i] === ' ' || css[i] === '\n') continue;
    if (css[i] === '{') {
      selector = s;
      s = '';
      continue;
    }
    if (css[i] === ';') {
      const [k, v] = s.split(':');
      declarations.push({ [k]: v });
      s = '';
      continue;
    }
    if (css[i] === '}') {
      rules.push({
        selector,
        declarations
      });
      declarations = [];
      continue;
    }
    s += css[i];
  }
  return rules;
}

function equal(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}


console.assert(equal(getRules(css), rules));

// 如何使用？

// 现实中 selector 会更复杂
function getMatchedRules(node, rules: Rule[], path) {
  // 根据 root 上的 attributes 信息以及 path，判断是否匹配

  // 实际的浏览器会建立多个哈希映射加快速度
  const matchedRules = [];
  for (const rule of rules) {
    if (
      rule.selector[0] === '.' &&
      node.classNames &&
      node.classNames.includes(rule.selector.slice(1))
    ) {
      matchedRules.push(rule);
    } else if (
      rule.selector[0] === '#' &&
      node.id &&
      node.id.includes(rule.selector.slice(1))
    ) {
      matchedRules.push(rule);
    } else if (rule.selector === node.tag) {
      matchedRules.push(rule);
    }
  }
  return matchedRules;
}
function traverse(root, path) {
  // 简单起见，DOM 上原地操作，不新建 render tree 了
  root.matchedRules = getMatchedRules(root, rules, path);
  for (const child of root.children) {
    path.push(root);
    traverse(child, path);
    path.pop();
  }
}

traverse(root, []);

console.assert(equal(root, matchedRoot));

// inline-style? important? complex selector ?

function _getComputedStyle(root) {
  const sortedRules = root.matchedRules.sort((a, b) => {
    const weights = ['.', '#'];
    return weights.indexOf(a[0]) - weights.indexOf(b[0]);
  });

  for (const child of root.children) {
    _getComputedStyle(child);
  }

  root.computedStyle = sortedRules.reduce((acc, cur) => {
    for (const declaration of cur.declarations) {
      acc = {
        ...acc,
        ...declaration
      };
    }
    return acc;
  }, {});
}
_getComputedStyle(root);
console.log(equal(root, computedRoot));
