#!/usr/bin/env node
const fs = require('fs');
const name = process.argv[2] || 'new-skill';

const scaffold = '# SKILL: ' + name + '\nDescription: À remplir.\n\n## Tools\n- `tool_name`: Description.\n';

fs.writeFileSync('/data/.openclaw/workspace-worker-foundry/' + name + '.md', scaffold);
console.log('Structure pour le skill ' + name + ' générée.');
