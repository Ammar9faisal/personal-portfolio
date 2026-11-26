import test from 'node:test';
import assert from 'node:assert/strict';
import { projects, experience, profile, publicLinks, skills } from '../src/data/portfolio.ts';
import { filterProjects, projectLinks, projectsForSkill, verifiedEmail, verifiedUrl } from '../src/lib/portfolio.ts';

test('archive priority and planned work stay explicit', () => {
  assert.deepEqual(projects.slice(0, 6).map(project => project.id), ['skillforge', 'neurogait', 'dash2dorm', 'clarus', 'eunoiahub', 'pawnvision']);
  assert.equal(projects.find(project => project.id === 'pawnvision').status, 'In development');
  assert.equal(projects.find(project => project.id === 'clarus').status, 'Needs review');
  assert.equal(new Set(projects.map(project => project.id)).size, projects.length);
});

test('search combines words, case, content, and status without changing priority', () => {
  assert.deepEqual(filterProjects(projects, '  CAMERA  stride ', 'All projects').map(project => project.id), ['neurogait']);
  assert.deepEqual(filterProjects(projects, 'OpenCV', 'Completed').map(project => project.id), ['neurogait']);
  assert.deepEqual(filterProjects(projects, 'OpenCV', 'In development').map(project => project.id), ['pawnvision']);
  assert.equal(filterProjects(projects, 'not-a-project', 'All projects').length, 0);
  assert.deepEqual(filterProjects(projects, '', 'All projects'), projects);
});

test('skill evidence does not confuse language substrings or planned technologies with completed work', () => {
  assert.equal(projectsForSkill('C', projects).length, 0);
  assert.deepEqual(projectsForSkill('Gemini', projects).map(project => project.id), ['skillforge', 'dash2dorm', 'eunoiahub']);
  assert.deepEqual(projectsForSkill('OpenCV', projects).map(project => project.id), ['neurogait']);
  assert.equal(projectsForSkill('Stockfish', projects).length, 0);
});

test('unverified, missing, or invalid destinations cannot become project links', () => {
  const project = { ...projects[0], links: {
    github: { url: 'https://example.com/code', verified: true },
    demo: { url: 'https://example.com/demo', verified: false },
    devpost: { url: 'javascript:alert(1)', verified: true },
  }};
  assert.deepEqual(projectLinks(project).map(link => link.key), ['github']);
  assert.equal(verifiedUrl({ url: 'not a url', verified: true }), undefined);
  assert.equal(verifiedUrl({ url: 'https://name:secret@example.com', verified: true }), undefined);
  assert.equal(verifiedEmail({ address: 'not-an-email', verified: true }), undefined);
  assert.equal(verifiedEmail({ address: 'person@example.com', verified: false }), undefined);
});

test('published fields omit draft date labels and expose only explicitly verified destinations', () => {
  for (const link of projects.flatMap(projectLinks)) assert.match(link.href, /^https:\/\//);
  for (const [key, link] of Object.entries(publicLinks)) {
    assert.equal(link.verified, true);
    assert.ok(key === 'email' ? verifiedEmail(link) : verifiedUrl(link));
  }
  for (const item of experience) assert.doesNotMatch(item.date || '', /verify|TODO|unknown/i);
  assert.doesNotMatch(profile.education.graduation || '', /verify|awaiting|TODO/i);
  assert.deepEqual(Object.keys(skills), ['Languages', 'Frontend', 'Backend', 'AI / Computer Vision', 'Infrastructure', 'Hardware']);
});
