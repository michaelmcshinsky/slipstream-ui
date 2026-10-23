import { Command } from 'commander';
import { initCommand } from './commands/init';
import { addCommand } from './commands/add';
import { listCommand } from './commands/list';
import { diffCommand } from './commands/diff';

declare const __APP_VERSION__: string;

const program = new Command();

program
  .name('slipstream-ui')
  .description('The AI-first React component library CLI')
  .version(__APP_VERSION__);

program.addCommand(initCommand);
program.addCommand(addCommand);
program.addCommand(listCommand);
program.addCommand(diffCommand);

program.parse();
