// import { glob } from 'glob';

// export async function loadFiles(dir: string): Promise<string[]> {
//   const isDev = __filename.endsWith('.ts');
//   const fullPath = `${process.cwd().replaceAll('\\', '/')}/${
//     isDev ? 'src' : 'dist'
//   }`;
//   const files = await glob(`${fullPath}/${dir}/**/*.${isDev ? 'ts' : 'js'}`);
//   files.forEach((file) => delete require.cache[require.resolve(file)]);
//   return files;
// }

import { promises as fs } from 'fs';
import path from 'path';

export async function loadFiles(dir: string): Promise<string[]> {
  const isDev = __filename.endsWith('.ts');
  const fullPath = path.resolve(process.cwd(), isDev ? 'src' : 'dist', dir);

  const files: string[] = [];

  const walkDir = async (currentPath: string) => {
    try {
      const entries = await fs.readdir(currentPath, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory()) {
          await walkDir(path.resolve(currentPath, entry.name));
        } else if (
          path.extname(entry.name).toLowerCase() === (isDev ? '.ts' : '.js')
        ) {
          const filePath = path.resolve(currentPath, entry.name);
          files.push(filePath);
          delete require.cache[require.resolve(filePath)];
        }
      }
    } catch (error) {
      console.error(`Error reading directory ${currentPath}:`, error);
    }
  };

  await walkDir(fullPath);

  return files;
}
