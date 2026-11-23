export type PlanetCategory = 'all' | 'terrestrial' | 'gas-giant' | 'ice-giant';
export type DistanceUnit = 'km' | 'au' | 'ly' | 'lightTime';

export interface BlackHoleTelemetry {
  schwarzschildRadiusKm: number;
  photonSphereKm: number;
  iscoRadiusKm: number;
  innerOrbitalVelocityPctC: number;
  peakDiskTempK: number;
  timeDilationFactor: number;
}

export interface AccretionParticle {
  angle: number;
  radiusNorm: number; // 0 = ISCO, 1 = outer disk
  angularSpeed: number;
  size: number;
  brightness: number;
  hueShift: number; // 0 = hot inner cyan/white, 1 = warm amber/violet outer
}

const KM_PER_AU = 149_597_870.7;
const KM_PER_LY = 9_460_730_472_580.8;
const SPEED_OF_LIGHT_KM_S = 299_792.458;

/**
 * Computes illustrative black hole physical parameters from mass (in solar masses)
 * and dimensionless Kerr spin parameter (0.0 to 1.0).
 */
export function calculateBlackHolePhysics(
  solarMasses: number,
  spinParameter: number,
  inclinationDeg: number
): BlackHoleTelemetry {
  const clampedMass = Math.max(1, Math.min(500, solarMasses));
  const clampedSpin = Math.max(0, Math.min(0.998, spinParameter));
  const clampedTilt = Math.max(5, Math.min(85, inclinationDeg));

  // R_s = 2.953 km per solar mass
  const schwarzschildRadiusKm = Number((2.953 * clampedMass).toFixed(1));
  // Prograde photon sphere shrinks toward horizon as Kerr spin rises, staying outside R_s
  const photonSphereFactor = 1.06 + 0.44 * (1 - clampedSpin);
  const photonSphereKm = Number((schwarzschildRadiusKm * photonSphereFactor).toFixed(1));
  // Prograde ISCO moves inward from 3.0 * R_s (Schwarzschild) toward 1.15 * R_s (high spin)
  const iscoFactor = 1.15 + 1.85 * (1 - clampedSpin);
  const iscoRadiusKm = Number((schwarzschildRadiusKm * iscoFactor).toFixed(1));

  // Illustrative relativistic orbital velocity (% of c) at ISCO
  const rawVelPct = Math.min(96.5, 40.8 + 48.0 * clampedSpin + (clampedTilt / 85) * 2.5);
  const innerOrbitalVelocityPctC = Number(rawVelPct.toFixed(1));

  // Illustrative inner accretion disk temperature in Kelvin (scales inversely with M^0.25, boosted by spin)
  const baseTemp = 1.2e7 * Math.pow(10 / clampedMass, 0.25) * (1 + 1.45 * clampedSpin);
  const peakDiskTempK = Math.round(baseTemp);

  // Gravitational time dilation factor sqrt(1 - R_s / r) at r = 1.35 * R_s
  const rProbe = 1.35;
  const timeDilationFactor = Number((1 / Math.sqrt(1 - 1 / rProbe)).toFixed(2));

  return {
    schwarzschildRadiusKm,
    photonSphereKm,
    iscoRadiusKm,
    innerOrbitalVelocityPctC,
    peakDiskTempK,
    timeDilationFactor,
  };
}

/**
 * Formats a distance in kilometers into km, AU, light-years, or human-readable light travel time.
 */
export function formatCelestialDistance(distanceKm: number, unit: DistanceUnit): string {
  if (!Number.isFinite(distanceKm) || distanceKm < 0) {
    return '0 km';
  }

  if (unit === 'km') {
    if (distanceKm >= 1e15) {
      return `${(distanceKm / 1e15).toFixed(2)} quadrillion km`;
    }
    if (distanceKm >= 1e12) {
      return `${(distanceKm / 1e12).toFixed(2)} trillion km`;
    }
    if (distanceKm >= 1e9) {
      return `${(distanceKm / 1e9).toFixed(2)} billion km`;
    }
    if (distanceKm >= 1e6) {
      return `${(distanceKm / 1e6).toFixed(2)} million km`;
    }
    return `${Math.round(distanceKm).toLocaleString('en-US')} km`;
  }

  if (unit === 'au') {
    const au = distanceKm / KM_PER_AU;
    if (au < 0.01) {
      return `${au.toFixed(4)} AU`;
    }
    if (au >= 1000) {
      return `${Math.round(au).toLocaleString('en-US')} AU`;
    }
    return `${au.toFixed(2)} AU`;
  }

  if (unit === 'ly') {
    const ly = distanceKm / KM_PER_LY;
    if (ly < 0.001) {
      return `${ly.toExponential(2)} ly`;
    }
    if (ly >= 100) {
      return `${Math.round(ly).toLocaleString('en-US')} ly`;
    }
    return `${ly.toFixed(2)} ly`;
  }

  // Light travel time
  const totalSeconds = distanceKm / SPEED_OF_LIGHT_KM_S;
  if (totalSeconds < 60) {
    return `${totalSeconds.toFixed(2)} light-sec`;
  }
  const minutes = totalSeconds / 60;
  if (minutes < 60) {
    return `${minutes.toFixed(1)} light-min`;
  }
  const hours = minutes / 60;
  if (hours < 24) {
    return `${hours.toFixed(2)} light-hrs`;
  }
  const days = hours / 24;
  if (days < 365.25) {
    return `${days.toFixed(1)} light-days`;
  }
  const years = days / 365.25;
  if (years >= 100) {
    return `${Math.round(years).toLocaleString('en-US')} light-yrs`;
  }
  return `${years.toFixed(2)} light-yrs`;
}

/**
 * Estimates travel duration at New Horizons cruise velocity (58,500 km/h).
 */
export function formatSpacecraftTransitTime(distanceKm: number): string {
  const speedKmPerHour = 58_500;
  const hours = distanceKm / speedKmPerHour;
  if (hours < 48) {
    return `${hours.toFixed(1)} hours`;
  }
  const days = hours / 24;
  if (days < 365.25) {
    return `${Math.round(days).toLocaleString('en-US')} days`;
  }
  const years = days / 365.25;
  if (years >= 1_000_000) {
    return `${(years / 1_000_000).toFixed(1)}M years`;
  }
  if (years >= 1_000) {
    return `${Math.round(years).toLocaleString('en-US')} years`;
  }
  return `${years.toFixed(1)} years`;
}

/**
 * Computes logarithmic scale percentage (0-100) for comparing planetary to galactic distances.
 */
export function computeLogDistancePercent(distanceKm: number): number {
  const minLog = Math.log10(300_000); // ~Moon
  const maxLog = Math.log10(3e17); // ~Sagittarius A*
  const currentLog = Math.log10(Math.max(300_000, distanceKm));
  const pct = ((currentLog - minLog) / (maxLog - minLog)) * 100;
  return Number(Math.max(4, Math.min(100, pct)).toFixed(1));
}

/**
 * Deterministic PRNG for reproducible particle distributions.
 */
export function createSeededRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

/**
 * Builds deterministic orbiting accretion particles for the black hole visualization.
 */
export function createAccretionParticles(count: number, seed = 42): AccretionParticle[] {
  const safeCount = Math.max(10, Math.min(500, Math.floor(count)));
  const rand = createSeededRng(seed);
  const particles: AccretionParticle[] = [];

  for (let i = 0; i < safeCount; i++) {
    // Concentrate particles toward the bright inner disk using quadratic bias
    const rBias = Math.pow(rand(), 1.55);
    particles.push({
      angle: rand() * Math.PI * 2,
      radiusNorm: rBias,
      angularSpeed: 0.45 + (1 - rBias) * 2.1 + rand() * 0.25,
      size: 1.0 + rand() * 2.1,
      brightness: 0.45 + (1 - rBias) * 0.55,
      hueShift: rBias,
    });
  }

  return particles;
}

/**
 * Filters a list of items with a `category` property by PlanetCategory.
 */
export function filterPlanetsByCategory<T extends { category: Exclude<PlanetCategory, 'all'> }>(
  planets: readonly T[],
  category: PlanetCategory
): T[] {
  if (category === 'all') {
    return [...planets];
  }
  return planets.filter((p) => p.category === category);
}

/**
 * Cycles through an ordered list of mission IDs safely.
 */
export function getAdjacentId<T extends { id: string }>(
  items: readonly T[],
  currentId: string,
  direction: 'prev' | 'next'
): string {
  if (items.length === 0) return '';
  const idx = items.findIndex((item) => item.id === currentId);
  if (idx === -1) return items[0].id;
  const offset = direction === 'next' ? 1 : -1;
  const nextIdx = (idx + offset + items.length) % items.length;
  return items[nextIdx].id;
}
