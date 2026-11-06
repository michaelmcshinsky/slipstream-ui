# Creates the backlog as GitHub issues.
# Requires: gh auth login, and a git remote pointing at the target repository.
# Idempotent: skips issues whose "SLIP-xxx" title prefix already exists.
$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$tickets = Get-ChildItem -LiteralPath $PSScriptRoot -Filter 'SLIP-*.md' | Sort-Object Name

gh auth status *> $null
if ($LASTEXITCODE -ne 0) {
  throw 'gh is not authenticated. Run: gh auth login'
}

function Read-Frontmatter([string]$path) {
  $lines = [IO.File]::ReadAllLines($path)
  if ($lines[0] -ne '---') { throw "Missing frontmatter: $path" }
  $end = 1
  while ($end -lt $lines.Count -and $lines[$end] -ne '---') { $end++ }
  $data = @{}
  for ($i = 1; $i -lt $end; $i++) {
    if ($lines[$i] -match '^([a-z_]+):\s*(.*)$') {
      $data[$Matches[1]] = $Matches[2].Trim()
    }
  }
  $body = ($lines[($end + 1)..($lines.Count - 1)] -join "`n").Trim()
  return @{ Meta = $data; Body = $body }
}

$milestones = @(
  'M0 Truth & baseline', 'M1 Validation benchmark', 'M2 Competitor test',
  'M3 Tailwind v4', 'M4 AI Chat Starter', 'M5 Distribution'
)
$existingMilestones = @(gh api "repos/{owner}/{repo}/milestones?state=all&per_page=100" --jq '.[].title' 2>$null)
foreach ($m in $milestones) {
  if ($existingMilestones -notcontains $m) {
    gh api "repos/{owner}/{repo}/milestones" -f title="$m" *> $null
  }
}

$labels = @(
  @{ Name = 'epic:truth'; Color = '0E8A16' },
  @{ Name = 'epic:benchmark'; Color = '1D76DB' },
  @{ Name = 'epic:competitor'; Color = '5319E7' },
  @{ Name = 'epic:tailwind'; Color = 'FBCA04' },
  @{ Name = 'epic:starter'; Color = 'D93F0B' },
  @{ Name = 'epic:growth'; Color = '006B75' },
  @{ Name = 'type:research'; Color = 'C5DEF5' },
  @{ Name = 'type:feature'; Color = 'A2EEEF' },
  @{ Name = 'type:test'; Color = 'BFD4F2' },
  @{ Name = 'type:docs'; Color = '0075CA' },
  @{ Name = 'type:chore'; Color = 'EDEDED' },
  @{ Name = 'p0'; Color = 'B60205' },
  @{ Name = 'p1'; Color = 'D4C5F9' },
  @{ Name = 'p2'; Color = 'FEF2C0' },
  @{ Name = 'needs-decision'; Color = 'E99695' },
  @{ Name = 'good-first-issue'; Color = '7057FF' }
)
foreach ($l in $labels) {
  gh label create $l.Name --color $l.Color --force *> $null
}

$existingTitles = @(gh issue list --state all --limit 500 --json title --jq '.[].title')

foreach ($file in $tickets) {
  $t = Read-Frontmatter $file.FullName
  $id = $t.Meta['id']
  $title = "$id · $($t.Meta['title'].Trim('"'))"
  if ($existingTitles -contains $title) {
    Write-Host "skip  $title"
    continue
  }
  $bodyFile = Join-Path $PSScriptRoot ("$id.body.md")
  [IO.File]::WriteAllText($bodyFile, $t.Body, [Text.UTF8Encoding]::new($false))
  $labelList = ($t.Meta['labels'].Trim('[', ']') -replace '"', '') -replace '\s*,\s*', ','
  $milestone = $t.Meta['milestone'].Trim('"')
  gh issue create --title $title --body-file $bodyFile --label $labelList --milestone $milestone
  Remove-Item -LiteralPath $bodyFile
  Write-Host "created $title"
}
