import { spawnSync } from 'node:child_process';
import { chmodSync, rmSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import process from 'node:process';

const root = new URL('../', import.meta.url);
const dist = new URL('dist/', root);
const require = createRequire(import.meta.url);

rmSync(dist, { recursive: true, force: true });

const result = spawnSync(process.execPath, [require.resolve('typescript/bin/tsc'), '-p', 'tsconfig.json'], {
  cwd: root,
  stdio: 'inherit'
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

const binary = new URL('bin/skillcheck.js', dist);
chmodSync(binary, statSync(binary).mode | 0o111);
