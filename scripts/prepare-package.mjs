import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const repositoryRoot = resolve(import.meta.dirname, '..');
const packageDirectory = resolve(repositoryRoot, 'dist', 'novan-site-kit');
const packageMetadataPath = resolve(repositoryRoot, 'projects', 'novan-site-kit', 'package.json');
const packageMetadata = JSON.parse(await readFile(packageMetadataPath, 'utf8'));

await mkdir(packageDirectory, { recursive: true });
await cp(resolve(repositoryRoot, '.github', 'skills'), resolve(packageDirectory, 'skills'), {
  recursive: true,
});
await cp(resolve(repositoryRoot, 'src', 'styles'), resolve(packageDirectory, 'styles'), {
  recursive: true,
});
await cp(resolve(repositoryRoot, 'src', 'app'), resolve(packageDirectory, 'template', 'src', 'app'), {
  recursive: true,
});
await cp(resolve(repositoryRoot, 'src', 'main.ts'), resolve(packageDirectory, 'template', 'src', 'main.ts'));
await cp(resolve(repositoryRoot, 'src', 'index.html'), resolve(packageDirectory, 'template', 'src', 'index.html'));
await cp(resolve(repositoryRoot, 'angular.json'), resolve(packageDirectory, 'template', 'angular.json'));
await cp(resolve(repositoryRoot, 'tsconfig.json'), resolve(packageDirectory, 'template', 'tsconfig.json'));
await cp(resolve(repositoryRoot, 'tsconfig.app.json'), resolve(packageDirectory, 'template', 'tsconfig.app.json'));
await cp(resolve(repositoryRoot, 'tsconfig.spec.json'), resolve(packageDirectory, 'template', 'tsconfig.spec.json'));
await cp(resolve(repositoryRoot, 'public'), resolve(packageDirectory, 'public'), {
  recursive: true,
});
await cp(resolve(repositoryRoot, 'README.md'), resolve(packageDirectory, 'README.md'));
await writeFile(
  resolve(packageDirectory, 'package.json'),
  `${JSON.stringify({ ...packageMetadata, files: ['fesm2022', 'lib', 'skills', 'styles', 'public', 'template', 'README.md'] }, null, 2)}\n`,
);

console.log(`Prepared ${packageMetadata.name}@${packageMetadata.version} in ${packageDirectory}`);