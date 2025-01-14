import { readConfig, ConfigLoaderError } from '@web/config-loader';
import fs from 'fs';
import path from 'path';
import commandLineArgs from 'command-line-args';
import { has } from './index.js';

const IGNORE = [
  '!node_modules/**/*.*', 
  '!bower_components/**/*.*', 
  '!**/*.test.{js,ts}', 
  '!**/*.suite.{js,ts}', 
  '!**/*.config.{js,ts}'
];

export function mergeGlobsAndExcludes(userConfig, cliConfig) {
  const hasProvidedCliGlobs = cliConfig?.globs?.[0] !== '**/*.{js,ts,tsx}' || has(userConfig?.globs);

  if(hasProvidedCliGlobs) {
    cliConfig.globs = cliConfig?.globs?.filter(glob => glob !== '**/*.{js,ts,tsx}');
  }

  const merged = [
    ...(userConfig?.globs || []),
    ...(cliConfig?.globs || []),
    ...(userConfig?.exclude?.map((i) => `!${i}`) || []),
    ...(cliConfig?.exclude?.map((i) => `!${i}`) || []),
    ...IGNORE,
  ];

  return merged;
}

export async function getUserConfig() {
  let userConfig = {};
  try {
    userConfig = await readConfig('custom-elements-manifest.config');
  } catch (error) {
    if (error instanceof ConfigLoaderError) {
      console.error(error.message);
      return;
    }
    console.error(error);
    return;
  }
  return userConfig || {};
}

export function getCliConfig(argv) {
  const optionDefinitions = [
    { name: 'globs', type: String, multiple: true, defaultValue: ['**/*.{js,ts,tsx}'] },
    { name: 'exclude', type: String, multiple: true },
    { name: 'outdir', type: String, defaultValue: '' },
    { name: 'dev', type: Boolean, defaultValue: false },
    { name: 'watch', type: Boolean, defaultValue: false },
    { name: 'litelement', type: Boolean, defaultValue: false },
    { name: 'stencil', type: Boolean, defaultValue: false },
    { name: 'fast', type: Boolean, defaultValue: false },
    { name: 'catalyst', type: Boolean, defaultValue: false },
  ];
  
  return commandLineArgs(optionDefinitions, { argv });
}

export async function addFrameworkPlugins(mergedOptions) {
  let plugins = [];
  if(mergedOptions?.litelement) {
    const { litPlugin } = await import('../features/framework-plugins/lit/lit.js');
    plugins = [...(litPlugin() || [])]
  }

  if(mergedOptions?.fast) {
    const { fastPlugin } = await import('../features/framework-plugins/fast/fast.js');
    plugins = [...(fastPlugin() || [])]
  }

  if(mergedOptions?.stencil) {
    const { stencilPlugin } = await import('../features/framework-plugins/stencil/stencil.js');
    plugins.push(stencilPlugin());
  }

  if(mergedOptions?.catalyst) {
    const { catalystPlugin } = await import('../features/framework-plugins/catalyst/catalyst.js');
    plugins = [...(catalystPlugin() || [])]
  }

  return plugins;
}

export function timestamp() {
  const date = new Date();
  return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds() }`;
}

export function addCustomElementsPropertyToPackageJson(outdir) {
  const packageJsonPath = `${process.cwd()}${path.sep}package.json`;
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath).toString());

  if(packageJson?.customElements) {
    if(packageJson?.customElements !== path.join(outdir, 'custom-elements.json')) {
      packageJson.customElements = path.join(outdir, 'custom-elements.json');
      fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
    }
    return;
  } else {
    packageJson.customElements = path.join(outdir, 'custom-elements.json');
    fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
  }
}

export const MENU = `
@custom-elements-manifest/analyzer

Available commands:
    | Command/option   | Type       | Description                                                 | Example               |
    | ---------------- | ---------- | ----------------------------------------------------------- | --------------------- |
    | analyze          |            | Analyze your components                                     |                       |
    | --globs          | string[]   | Globs to analyze                                            | \`--globs "foo.js"\`    |
    | --exclude        | string[]   | Globs to exclude                                            | \`--exclude "foo.js"\`  |
    | --outdir         | string     | Directory to output the Manifest to                         | \`--outdir dist\`       |
    | --watch          | boolean    | Enables watch mode, generates a new manifest on file change | \`--watch\`             |
    | --dev            | boolean    | Enables extra logging for debugging                         | \`--dev\`               |
    | --litelement     | boolean    | Enable special handling for LitElement syntax               | \`--litelement\`        |
    | --fast           | boolean    | Enable special handling for FASTElement syntax              | \`--fast\`              |
    | --stencil        | boolean    | Enable special handling for Stencil syntax                  | \`--stencil\`           |
    | --catalyst       | boolean    | Enable special handling for Catalyst syntax                 | \`--catalyst\`          |

Example:
    custom-elements-manifest analyze --litelement --globs "**/*.js" --exclude "foo.js" "bar.js"
`