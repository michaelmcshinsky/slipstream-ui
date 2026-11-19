/**
 * Script to create newsletter automations in OpenWork
 * Run with: pnpm tsx scripts/create-newsletter-automations.ts
 */

import { readFileSync } from 'fs';
import { join } from 'path';

async function createAutomation(config: any) {
  // This would use the OpenWork Cloud API to create the automation
  // For now, we'll output the configuration
  console.log('Creating automation:', config.name);
  console.log(JSON.stringify(config, null, 2));
  console.log('\n---\n');
}

async function main() {
  const dailyConfig = JSON.parse(
    readFileSync(join(process.cwd(), 'openwork-automations', 'newsletter-daily.json'), 'utf-8')
  );

  const weeklyConfig = JSON.parse(
    readFileSync(join(process.cwd(), 'openwork-automations', 'newsletter-weekly.json'), 'utf-8')
  );

  console.log('=== Newsletter Automation Configurations ===\n');

  await createAutomation(dailyConfig);
  await createAutomation(weeklyConfig);

  console.log('To create these automations in OpenWork:');
  console.log('1. Go to OpenWork Automations');
  console.log('2. Click "Create Automation"');
  console.log('3. Paste each configuration');
  console.log('4. Set the NEWSLETTER_CRON_SECRET environment variable');
  console.log('\nRequired environment variables:');
  console.log('- NEWSLETTER_CRON_SECRET: Shared secret for cron authentication');
  console.log('- GITHUB_TOKEN: GitHub personal access token (optional, for GitHub content)');
  console.log('- GITHUB_OWNER: GitHub repository owner');
  console.log('- GITHUB_REPO: GitHub repository name');
  console.log('- NEXT_PUBLIC_APP_URL: Your app URL for unsubscribe/preferences links');
}

main().catch(console.error);