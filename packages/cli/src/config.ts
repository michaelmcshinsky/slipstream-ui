import path from 'node:path';
import fs from 'fs-extra';

export const DEFAULT_COMPONENTS_DIR = 'components/slipstream';

export type SlipstreamConfig = {
  componentsDir?: string;
  style?: string;
  packages?: string[];
  framework?: string;
};

export type ResolvedComponentsDir = {
  absolute: string;
  relative: string;
  configPath: string | null;
  config: SlipstreamConfig | null;
};

/**
 * Resolve the component destination from slipstream.config.json.
 *
 * The path must stay inside the project so a malformed config cannot make
 * `add` or `diff` write or read outside the repository.
 */
export function resolveComponentsDir(projectRoot: string): ResolvedComponentsDir {
  const configPath = path.join(projectRoot, 'slipstream.config.json');
  if (!fs.existsSync(configPath)) {
    return {
      absolute: path.resolve(projectRoot, DEFAULT_COMPONENTS_DIR),
      relative: DEFAULT_COMPONENTS_DIR,
      configPath: null,
      config: null,
    };
  }

  let config: SlipstreamConfig;
  try {
    config = fs.readJsonSync(configPath) as SlipstreamConfig;
  } catch (error) {
    throw new Error(
      `Could not parse ${path.basename(configPath)}: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  const configured = typeof config.componentsDir === 'string' ? config.componentsDir.trim() : '';
  const relative = configured || DEFAULT_COMPONENTS_DIR;
  if (path.isAbsolute(relative)) {
    throw new Error(`componentsDir must be relative to the project root: ${relative}`);
  }

  const absolute = path.resolve(projectRoot, relative);
  const inside = path.relative(projectRoot, absolute);
  if (inside === '' || inside.startsWith('..') || path.isAbsolute(inside)) {
    throw new Error(`componentsDir must stay inside the project root: ${relative}`);
  }

  return {
    absolute,
    relative: inside.split(path.sep).join('/'),
    configPath,
    config,
  };
}
