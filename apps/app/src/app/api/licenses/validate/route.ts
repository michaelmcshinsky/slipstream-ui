export const dynamic = 'force-dynamic';

// Legacy path kept for existing CLI/MCP integrations; delegates to the v1
// handler so schema, rate limit, and envelope stay single-sourced.
export { POST } from '../../v1/licenses/validate/route';
