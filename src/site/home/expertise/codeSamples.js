/** Syntax colours for the editor mockup, by token kind. */
export const TOKEN_CLASSES = {
  k: 'text-sage-300', // keyword
  f: 'text-ink-50', // function / identifier
  s: 'text-gold-300', // string
  p: 'text-ink-200', // punctuation
  v: 'text-ink-100', // variable
  c: 'italic text-ink-300', // comment
  n: '', // indentation
};

/** Files the editor mockup types out. Each line is a list of [kind, text] tokens. */
export const CODE_FILES = [
  {
    file: 'solution.ts',
    lang: 'TypeScript',
    lines: [
      [['c', '// analyze → build → ship']],
      [
        ['k', 'const '],
        ['f', 'APV_Solution'],
        ['p', ' = '],
        ['k', 'async '],
        ['p', '() => {'],
      ],
      [
        ['n', '  '],
        ['k', 'await '],
        ['f', 'analyzeRequirements'],
        ['p', '();'],
      ],
      [
        ['n', '  '],
        ['k', 'const '],
        ['v', 'app'],
        ['p', ' = '],
        ['k', 'await '],
        ['f', 'build'],
        ['p', '('],
        ['v', 'stack'],
        ['p', ');'],
      ],
      [
        ['n', '  '],
        ['k', 'await '],
        ['v', 'app'],
        ['p', '.'],
        ['f', 'deploy'],
        ['p', '();'],
      ],
      [
        ['n', '  '],
        ['k', 'return '],
        ['s', '"Success"'],
        ['p', ';'],
      ],
      [['p', '}']],
    ],
  },
  {
    file: 'sync_leads.py',
    lang: 'Python',
    lines: [
      [['c', '# form → crm → whatsapp']],
      [
        ['k', 'def '],
        ['f', 'sync_leads'],
        ['p', '('],
        ['v', 'form'],
        ['p', '):'],
      ],
      [
        ['n', '    '],
        ['v', 'lead'],
        ['p', ' = '],
        ['v', 'crm'],
        ['p', '.'],
        ['f', 'find'],
        ['p', '('],
        ['v', 'form'],
        ['p', '.'],
        ['v', 'email'],
        ['p', ')'],
      ],
      [
        ['n', '    '],
        ['k', 'if not '],
        ['v', 'lead'],
        ['p', ':'],
      ],
      [
        ['n', '        '],
        ['v', 'lead'],
        ['p', ' = '],
        ['v', 'crm'],
        ['p', '.'],
        ['f', 'create'],
        ['p', '('],
        ['v', 'form'],
        ['p', ')'],
      ],
      [
        ['n', '    '],
        ['v', 'whatsapp'],
        ['p', '.'],
        ['f', 'notify'],
        ['p', '('],
        ['v', 'lead'],
        ['p', ')'],
      ],
      [
        ['n', '    '],
        ['k', 'return '],
        ['s', '"Success"'],
      ],
    ],
  },
];

/** Number of characters in a line of tokens. */
export const lineLength = (tokens) => tokens.reduce((sum, [, text]) => sum + text.length, 0);

/** Characters to type per file (each line break counts as one). */
export const FILE_LENGTHS = CODE_FILES.map(
  (file) => file.lines.reduce((sum, line) => sum + lineLength(line), 0) + file.lines.length - 1,
);

/** Rows the editor always shows, so switching files doesn't change its height. */
export const MAX_LINES = Math.max(...CODE_FILES.map((file) => file.lines.length));

/** Line and column of the caret after `count` typed characters. */
export function caretAt(lines, count) {
  let left = count;
  for (let line = 0; line < lines.length; line++) {
    const length = lineLength(lines[line]);
    if (left <= length) return { line, col: left };
    left -= length + 1;
  }
  const last = lines.length - 1;
  return { line: last, col: lineLength(lines[last]) };
}

/** MAX_LINES rows, each with its tokens (if any) and how many of its characters are typed so far. */
export function visibleRows(lines, count) {
  let left = count;
  return Array.from({ length: MAX_LINES }, (_, i) => {
    const line = lines[i];
    if (!line) return { line: undefined, take: 0 };
    const length = lineLength(line);
    const take = Math.max(0, Math.min(length, left));
    left -= length + 1;
    return { line, take };
  });
}
