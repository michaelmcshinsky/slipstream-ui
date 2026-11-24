'use client';

import { useEffect, useState } from 'react';
import { Card, CardTitle, Field, inputClass } from '@/components/ui';
import { extractData, extractErrorMessage } from '@/lib/api/envelope';

type TeamRef = { id: string; name: string; role: string };

type Member = {
  id: string;
  role: string;
  user: { id: string; email: string; name: string | null };
};

type Invite = {
  id: string;
  email: string;
  role: string;
  expiresAt: string;
};

type TeamDetail = {
  memberships?: Member[];
  invites?: Invite[];
};

export default function TeamPage() {
  const [teams, setTeams] = useState<TeamRef[]>([]);
  const [activeTeamId, setActiveTeamId] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activeRole = teams.find((team) => team.id === activeTeamId)?.role;
  const canAdmin = activeRole === 'OWNER' || activeRole === 'ADMIN';

  async function loadTeams() {
    setError(null);
    try {
      const response = await fetch('/api/teams');
      const data: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        setError(extractErrorMessage(data));
        return;
      }
      const payload = extractData<{ teams?: TeamRef[] }>(data);
      const nextTeams = payload?.teams ?? [];
      setTeams(nextTeams);
      setActiveTeamId((current) => current ?? nextTeams[0]?.id ?? null);
    } catch {
      setError('Something went wrong. Please try again.');
    }
  }

  async function loadTeam(teamId: string) {
    setError(null);
    try {
      const response = await fetch(`/api/teams/${teamId}`);
      const data: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        setError(extractErrorMessage(data));
        return;
      }
      const payload = extractData<{ team?: TeamDetail }>(data);
      setMembers(payload?.team?.memberships ?? []);
      setInvites(payload?.team?.invites ?? []);
    } catch {
      setError('Something went wrong. Please try again.');
    }
  }

  useEffect(() => {
    void loadTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!activeTeamId) return;
    void loadTeam(activeTeamId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTeamId]);

  async function invite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeTeamId) return;
    setError(null);
    setInviteUrl(null);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch(`/api/teams/${activeTeamId}/invites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.get('email'), role: form.get('role') }),
      });
      const data: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        setError(extractErrorMessage(data));
        return;
      }
      const payload = extractData<{ inviteUrl?: string }>(data);
      if (payload?.inviteUrl) {
        setInviteUrl(`${window.location.origin}${payload.inviteUrl}`);
      }
      event.currentTarget.reset();
      await loadTeam(activeTeamId);
    } catch {
      setError('Something went wrong. Please try again.');
    }
  }

  async function removeMember(memberId: string) {
    if (!activeTeamId) return;
    setError(null);
    try {
      const response = await fetch(`/api/teams/${activeTeamId}/members/${memberId}`, { method: 'DELETE' });
      const data: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        setError(extractErrorMessage(data));
        return;
      }
      await loadTeam(activeTeamId);
    } catch {
      setError('Something went wrong. Please try again.');
    }
  }

  async function changeRole(memberId: string, role: string) {
    if (!activeTeamId) return;
    setError(null);
    try {
      const response = await fetch(`/api/teams/${activeTeamId}/members/${memberId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      const data: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        setError(extractErrorMessage(data));
        return;
      }
      await loadTeam(activeTeamId);
    } catch {
      setError('Something went wrong. Please try again.');
    }
  }

  async function createTeam(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const name = new FormData(event.currentTarget).get('name') as string;
    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        setError(extractErrorMessage(data));
        return;
      }
      window.location.reload();
    } catch {
      setError('Something went wrong. Please try again.');
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight">Team</h1>
        {teams.length > 0 && (
          <select
            value={activeTeamId ?? ''}
            onChange={(event) => setActiveTeamId(event.target.value)}
            aria-label="Team"
            className={inputClass + ' max-w-56'}
          >
            {teams.map((team) => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
        )}
      </div>

      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

      <Card>
        <CardTitle>Members</CardTitle>
        <ul className="divide-y divide-border">
          {members.map((member) => (
            <li key={member.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
              <div>
                <span className="text-sm font-medium">{member.user.name ?? member.user.email}</span>
                <span className="ml-2 text-xs text-muted-foreground">{member.user.email}</span>
              </div>
              {canAdmin && (
                <div className="flex items-center gap-2">
                  <select
                    value={member.role}
                    onChange={(event) => changeRole(member.id, event.target.value)}
                    aria-label={`Role for ${member.user.email}`}
                    className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                  >
                    {['OWNER', 'ADMIN', 'MEMBER'].map((role) => (
                      <option key={role}>{role}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeMember(member.id)}
                    className="text-xs text-destructive hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </li>
          ))}
          {members.length === 0 && <li className="py-2 text-sm text-muted-foreground">No members.</li>}
        </ul>
      </Card>

      {canAdmin && (
        <Card>
          <CardTitle>Invite a teammate</CardTitle>
          <form onSubmit={invite} className="flex flex-wrap items-end gap-2">
            <Field label="Email" name="email" type="email" required placeholder="teammate@company.com" className="max-w-xs" />
            <Field
              label="Role"
              name="role"
              options={[
                { value: 'MEMBER', label: 'MEMBER' },
                { value: 'ADMIN', label: 'ADMIN' },
              ]}
              className="max-w-32"
            />
            <button type="submit" className="whitespace-nowrap rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Send invite
            </button>
          </form>
          {inviteUrl && (
            <p role="status" className="mt-3 break-all rounded-lg bg-primary/10 p-3 text-xs">
              Invite created — share this acceptance link: {inviteUrl}
            </p>
          )}
          {invites.length > 0 && (
            <>
              <h3 className="mb-2 mt-6 text-sm font-semibold">Pending invites</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {invites.map((invite) => (
                  <li key={invite.id}>
                    {invite.email} · {invite.role} · expires {new Date(invite.expiresAt).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>
      )}

      <Card>
        <CardTitle>Create another team</CardTitle>
        <form onSubmit={createTeam} className="flex gap-2">
          <Field label="Team name" name="name" required placeholder="Team name" className="max-w-xs" />
          <button type="submit" className="whitespace-nowrap rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-muted">
            Create team
          </button>
        </form>
      </Card>
    </div>
  );
}
