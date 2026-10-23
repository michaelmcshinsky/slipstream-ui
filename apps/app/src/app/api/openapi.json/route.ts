import { NextResponse } from 'next/server';
import { PLANS } from '@/lib/plans';

/**
 * Machine-readable OpenAPI 3.1 description of the public API surface.
 * Served as a static-ish document; regenerated on deploy.
 */
const spec = {
  openapi: '3.1.0',
  info: {
    title: 'Slipstream UI API',
    version: '1.0.0',
    description:
      'License validation, teams, billing, and account APIs for Slipstream UI. Authenticate with either a session cookie (dashboard) or an API key (Authorization: Bearer <key>).',
  },
  servers: [{ url: process.env.APP_URL ?? 'http://localhost:3002' }],
  components: {
    securitySchemes: {
      ApiKeyAuth: { type: 'http', scheme: 'bearer', description: 'API key created in the dashboard.' },
      SessionCookie: { type: 'apiKey', in: 'cookie', name: 'slipstream_session' },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'object',
            properties: { code: { type: 'string' }, message: { type: 'string' }, details: {} },
            required: ['code', 'message'],
          },
          meta: { type: 'object', properties: { requestId: { type: 'string' } } },
        },
      },
      LicenseValidation: {
        type: 'object',
        properties: {
          valid: { type: 'boolean' },
          reason: { type: 'string' },
          plan: { type: 'string', enum: PLANS.map((plan) => plan.id) },
        },
        required: ['valid'],
      },
    },
  },
  paths: {
    '/api/v1/me': {
      get: {
        summary: 'Authenticated principal and teams',
        security: [{ ApiKeyAuth: [] }, { SessionCookie: [] }],
        responses: { '200': { description: 'OK' }, '401': { description: 'Unauthenticated' } },
      },
    },
    '/api/v1/teams': {
      get: {
        summary: 'List your teams (cursor paginated)',
        parameters: [
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20, maximum: 100 } },
          { name: 'cursor', in: 'query', schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'OK' } },
      },
      post: {
        summary: 'Create a team',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', required: ['name'], properties: { name: { type: 'string', maxLength: 60 } } } } },
        },
        responses: { '201': { description: 'Created' }, '400': { description: 'Validation failed' } },
      },
    },
    '/api/v1/licenses': {
      get: {
        summary: "List your license keys",
        security: [{ ApiKeyAuth: [] }, { SessionCookie: [] }],
        responses: { '200': { description: 'OK' } },
      },
    },
    '/api/v1/licenses/validate': {
      post: {
        summary: 'Validate a license key + machine id (used by CLI/MCP)',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['key', 'machineId'],
                properties: { key: { type: 'string' }, machineId: { type: 'string' } },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Validation result', content: { 'application/json': { schema: { $ref: '#/components/schemas/LicenseValidation' } } } },
          '429': { description: 'Rate limited (30/min per IP)' },
        },
      },
    },
    '/api/v1/payments': {
      get: {
        summary: 'Payments across your teams (cursor paginated)',
        parameters: [
          { name: 'teamId', in: 'query', schema: { type: 'string' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
          { name: 'cursor', in: 'query', schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'OK' } },
      },
    },
    '/api/v1/subscription': {
      get: {
        summary: 'Current subscription for a team',
        parameters: [{ name: 'teamId', in: 'query', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'OK' }, '404': { description: 'Team not found' } },
      },
    },
  },
};

export async function GET() {
  return NextResponse.json(spec);
}
