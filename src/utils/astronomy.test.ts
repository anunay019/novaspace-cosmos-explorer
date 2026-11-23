import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateBlackHolePhysics,
  computeLogDistancePercent,
  createAccretionParticles,
  filterPlanetsByCategory,
  formatCelestialDistance,
  formatSpacecraftTransitTime,
  getAdjacentId,
} from './astronomy';

test('calculateBlackHolePhysics scales Schwarzschild radius linearly with mass', () => {
  const m10 = calculateBlackHolePhysics(10, 0.5, 25);
  const m20 = calculateBlackHolePhysics(20, 0.5, 25);

  assert.equal(m10.schwarzschildRadiusKm, 29.5);
  assert.equal(m20.schwarzschildRadiusKm, 59.1);
  assert.ok(m10.iscoRadiusKm > m10.photonSphereKm);
  assert.ok(m10.innerOrbitalVelocityPctC > 40 && m10.innerOrbitalVelocityPctC < 100);
});

test('higher spin shrinks ISCO radius and increases peak disk temperature', () => {
  const lowSpin = calculateBlackHolePhysics(15, 0.1, 30);
  const highSpin = calculateBlackHolePhysics(15, 0.95, 30);

  assert.ok(highSpin.iscoRadiusKm < lowSpin.iscoRadiusKm);
  assert.ok(highSpin.iscoRadiusKm > highSpin.schwarzschildRadiusKm);
  assert.ok(highSpin.peakDiskTempK > lowSpin.peakDiskTempK);
  assert.ok(highSpin.innerOrbitalVelocityPctC > lowSpin.innerOrbitalVelocityPctC);
});

test('formatCelestialDistance formats km, AU, light-years, and light travel time accurately', () => {
  assert.equal(formatCelestialDistance(384_400, 'km'), '384,400 km');
  assert.equal(formatCelestialDistance(1.2715e16, 'km'), '12.71 quadrillion km');
  assert.equal(formatCelestialDistance(149_597_870.7, 'au'), '1.00 AU');
  assert.equal(formatCelestialDistance(384_400, 'lightTime'), '1.28 light-sec');
  assert.equal(formatCelestialDistance(40_140_000_000_000, 'ly'), '4.24 ly');
});

test('formatSpacecraftTransitTime formats short and cosmic durations cleanly', () => {
  assert.equal(formatSpacecraftTransitTime(384_400), '6.6 hours');
  assert.ok(formatSpacecraftTransitTime(78_000_000).includes('days'));
  assert.ok(formatSpacecraftTransitTime(40_140_000_000_000).includes('years'));
});

test('computeLogDistancePercent clamps smoothly between 4 and 100', () => {
  assert.equal(computeLogDistancePercent(384_400) >= 4, true);
  assert.equal(computeLogDistancePercent(3e17), 100);
});

test('createAccretionParticles is deterministic and respects particle count', () => {
  const first = createAccretionParticles(120, 7);
  const second = createAccretionParticles(120, 7);
  assert.equal(first.length, 120);
  assert.deepEqual(first, second);
});

test('filterPlanetsByCategory filters accurately', () => {
  const sample = [
    { id: 'earth', category: 'terrestrial' as const },
    { id: 'jupiter', category: 'gas-giant' as const },
    { id: 'neptune', category: 'ice-giant' as const },
  ];
  assert.equal(filterPlanetsByCategory(sample, 'all').length, 3);
  assert.deepEqual(
    filterPlanetsByCategory(sample, 'terrestrial').map((p) => p.id),
    ['earth']
  );
});

test('getAdjacentId wraps safely in both directions', () => {
  const list = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
  assert.equal(getAdjacentId(list, 'a', 'prev'), 'c');
  assert.equal(getAdjacentId(list, 'c', 'next'), 'a');
  assert.equal(getAdjacentId(list, 'b', 'next'), 'c');
});
