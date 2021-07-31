export const css = `
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

export const root = {
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

export const matchedRoot = {
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
  }

export const computedRoot = {
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
  }
