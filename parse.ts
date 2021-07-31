const css = `
.class {
  color: red;
  font-size: 14px;
}
#id {
  color: blue;
  font-size: 12px;
}
body {
  color: yellow;
  font-size: 16px;
}
`;
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
const rules = [
  {
    selector: '.class',
    declarations: [{ color: 'red' }, { 'font-size': '14px' }]
  },
  {
    selector: '#id',
    declarations: [{ color: 'blue' }, { 'font-size': '12px' }]
  },
  {
    selector: 'body',
    declarations: [{ color: 'yellow' }, { 'font-size': '16px' }]
  }
];

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
const root = {
  tag: 'body',
  classNames: ['.class'],
  id: 'k1',
  children: [
    {
      tag: 'p',
      classNames: ['class'],
      children: [
        {
          tag: 'span',
          id: 'id',
          classNames: ['class'],
          children: []
        }
      ]
    },
    {
      tag: 'span',
      classNames: [],
      children: []
    }
  ]
};
traverse(root, []);

console.assert(
  equal(root, {
    tag: 'body',
    classNames: ['.class'],
    id: 'k1',
    children: [
      {
        tag: 'p',
        classNames: ['class'],
        children: [
          {
            tag: 'span',
            id: 'id',
            classNames: ['class'],
            children: [],
            matchedRules: [
              {
                selector: '.class',
                declarations: [{ color: 'red' }, { 'font-size': '14px' }]
              },
              {
                selector: '#id',
                declarations: [{ color: 'blue' }, { 'font-size': '12px' }]
              }
            ]
          }
        ],
        matchedRules: [
          {
            selector: '.class',
            declarations: [{ color: 'red' }, { 'font-size': '14px' }]
          }
        ]
      },
      { tag: 'span', classNames: [], children: [], matchedRules: [] }
    ],
    matchedRules: [
      {
        selector: 'body',
        declarations: [{ color: 'yellow' }, { 'font-size': '16px' }]
      }
    ]
  })
);

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
console.log(
  equal(root, {
    tag: 'body',
    classNames: ['.class'],
    id: 'k1',
    children: [
      {
        tag: 'p',
        classNames: ['class'],
        children: [
          {
            tag: 'span',
            id: 'id',
            classNames: ['class'],
            children: [],
            matchedRules: [
              {
                selector: '.class',
                declarations: [{ color: 'red' }, { 'font-size': '14px' }]
              },
              {
                selector: '#id',
                declarations: [{ color: 'blue' }, { 'font-size': '12px' }]
              }
            ],
            computedStyle: { color: 'blue', 'font-size': '12px' }
          }
        ],
        matchedRules: [
          {
            selector: '.class',
            declarations: [{ color: 'red' }, { 'font-size': '14px' }]
          }
        ],
        computedStyle: { color: 'red', 'font-size': '14px' }
      },
      {
        tag: 'span',
        classNames: [],
        children: [],
        matchedRules: [],
        computedStyle: {}
      }
    ],
    matchedRules: [
      {
        selector: 'body',
        declarations: [{ color: 'yellow' }, { 'font-size': '16px' }]
      }
    ],
    computedStyle: { color: 'yellow', 'font-size': '16px' }
  })
);
