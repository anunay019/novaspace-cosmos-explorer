import type { PlanetCategory } from '../utils/astronomy';

export interface PlanetData {
  id: string;
  name: string;
  order: number;
  category: Exclude<PlanetCategory, 'all'>;
  categoryLabel: string;
  distanceFromSun: string;
  distanceAu: number;
  diameterKm: string;
  meanTemperature: string;
  moons: number;
  orbitalPeriod: string;
  dayLength: string;
  gravity: string;
  shortDescription: string;
  facts: string[];
  visual: {
    baseColor: string;
    secondaryColor: string;
    accentColor: string;
    atmosphereColor: string;
    style:
      | 'mercury'
      | 'venus'
      | 'earth'
      | 'mars'
      | 'jupiter'
      | 'saturn'
      | 'uranus'
      | 'neptune';
    hasRings?: boolean;
    ringColor?: string;
    axialTiltDeg: number;
  };
}

export interface ExplorationTopic {
  id: string;
  title: string;
  classification: string;
  image: string;
  shortDescription: string;
  overview: string;
  telemetryMetrics: { label: string; value: string }[];
  notableExamples: string[];
  hasSimulatorLink?: boolean;
}

export interface MissionEntry {
  id: string;
  name: string;
  date: string;
  year: number;
  agency: string;
  status: string;
  image: string;
  shortDescription: string;
  extendedSummary: string;
  highlights: { label: string; value: string }[];
}

export interface CelestialTarget {
  id: string;
  name: string;
  type: string;
  distanceKm: number;
  note: string;
}

export const HERO_IMAGE = '/src/assets/images/hero_cosmos_horizon_1795447845208.jpg';

export const PLANETS: PlanetData[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    order: 1,
    category: 'terrestrial',
    categoryLabel: 'Terrestrial',
    distanceFromSun: '57.9M km (0.39 AU)',
    distanceAu: 0.39,
    diameterKm: '4,879 km',
    meanTemperature: '167 °C',
    moons: 0,
    orbitalPeriod: '88 Earth days',
    dayLength: '58.6 Earth days',
    gravity: '3.70 m/s²',
    shortDescription:
      'The smallest and innermost world, scarred by ancient impact basins and extreme thermal swings.',
    facts: [
      'Surface temperatures swing from -180 °C at night to 430 °C at noon due to its ultra-thin exosphere.',
      'Its metallic iron core occupies roughly 85% of the planet’s radius.',
      'Water ice persists inside permanently shadowed polar craters.',
    ],
    visual: {
      baseColor: '#8d8882',
      secondaryColor: '#5c5854',
      accentColor: '#b5afa6',
      atmosphereColor: '#94a3b8',
      style: 'mercury',
      axialTiltDeg: 0.03,
    },
  },
  {
    id: 'venus',
    name: 'Venus',
    order: 2,
    category: 'terrestrial',
    categoryLabel: 'Terrestrial',
    distanceFromSun: '108.2M km (0.72 AU)',
    distanceAu: 0.72,
    diameterKm: '12,104 km',
    meanTemperature: '464 °C',
    moons: 0,
    orbitalPeriod: '225 Earth days',
    dayLength: '243 Earth days (retrograde)',
    gravity: '8.87 m/s²',
    shortDescription:
      'Shrouded in thick sulfuric clouds and a runaway greenhouse atmosphere hotter than Mercury.',
    facts: [
      'Venus rotates backward (retrograde), meaning the Sun rises in the west and sets in the east.',
      'Surface atmospheric pressure is 92 times Earth’s — equivalent to being 900 meters underwater.',
      'Its upper cloud deck super-rotates around the globe every four Earth days.',
    ],
    visual: {
      baseColor: '#d9b37c',
      secondaryColor: '#a6763f',
      accentColor: '#f3d8a7',
      atmosphereColor: '#fbbf24',
      style: 'venus',
      axialTiltDeg: 177.3,
    },
  },
  {
    id: 'earth',
    name: 'Earth',
    order: 3,
    category: 'terrestrial',
    categoryLabel: 'Terrestrial',
    distanceFromSun: '149.6M km (1.00 AU)',
    distanceAu: 1.0,
    diameterKm: '12,742 km',
    meanTemperature: '15 °C',
    moons: 1,
    orbitalPeriod: '365.25 days',
    dayLength: '23.9 hours',
    gravity: '9.81 m/s²',
    shortDescription:
      'An ocean-covered silicate world shielded by a dynamic magnetosphere and life-sustaining atmosphere.',
    facts: [
      'Liquid water covers 71% of the crust, regulated by plate tectonics and the carbon-silicate cycle.',
      'Earth’s dipolar magnetic field deflects charged solar wind particles from stripping the atmosphere.',
      'Its large Moon stabilizes axial tilt at 23.4°, moderating long-term climate cycles.',
    ],
    visual: {
      baseColor: '#1d4ed8',
      secondaryColor: '#15803d',
      accentColor: '#e2e8f0',
      atmosphereColor: '#38bdf8',
      style: 'earth',
      axialTiltDeg: 23.4,
    },
  },
  {
    id: 'mars',
    name: 'Mars',
    order: 4,
    category: 'terrestrial',
    categoryLabel: 'Terrestrial',
    distanceFromSun: '227.9M km (1.52 AU)',
    distanceAu: 1.52,
    diameterKm: '6,779 km',
    meanTemperature: '-65 °C',
    moons: 2,
    orbitalPeriod: '687 Earth days',
    dayLength: '24.6 hours',
    gravity: '3.72 m/s²',
    shortDescription:
      'The iron-oxide desert frontier home to Olympus Mons, Valles Marineris, and ancient dry river deltas.',
    facts: [
      'Olympus Mons rises nearly 22 km above the surrounding plains — nearly triple Mount Everest’s height.',
      'Robotic rovers have uncovered clay minerals and lakebed sediments indicating ancient liquid water.',
      'Two small captured-asteroid moons, Phobos and Deimos, orbit rapidly above its dusty skies.',
    ],
    visual: {
      baseColor: '#c25934',
      secondaryColor: '#7c2d12',
      accentColor: '#ea9b75',
      atmosphereColor: '#fb923c',
      style: 'mars',
      axialTiltDeg: 25.2,
    },
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    order: 5,
    category: 'gas-giant',
    categoryLabel: 'Gas Giant',
    distanceFromSun: '778.5M km (5.20 AU)',
    distanceAu: 5.2,
    diameterKm: '139,820 km',
    meanTemperature: '-110 °C',
    moons: 95,
    orbitalPeriod: '11.86 Earth years',
    dayLength: '9.9 hours',
    gravity: '24.79 m/s²',
    shortDescription:
      'The Solar System’s largest planet, sculpted by banded ammonia clouds and the Great Red Spot.',
    facts: [
      'Jupiter holds more than twice the mass of all other planets in the Solar System combined.',
      'The Great Red Spot is an anticyclonic storm wider than Earth that has raged for over 300 years.',
      'Four Galilean moons — Io, Europa, Ganymede, and Callisto — form a miniature planetary system.',
    ],
    visual: {
      baseColor: '#d4a373',
      secondaryColor: '#9c6644',
      accentColor: '#f4e4d4',
      atmosphereColor: '#fdba74',
      style: 'jupiter',
      axialTiltDeg: 3.1,
    },
  },
  {
    id: 'saturn',
    name: 'Saturn',
    order: 6,
    category: 'gas-giant',
    categoryLabel: 'Gas Giant',
    distanceFromSun: '1.43B km (9.58 AU)',
    distanceAu: 9.58,
    diameterKm: '116,460 km',
    meanTemperature: '-140 °C',
    moons: 146,
    orbitalPeriod: '29.45 Earth years',
    dayLength: '10.7 hours',
    gravity: '10.44 m/s²',
    shortDescription:
      'A golden gas giant encircled by a vast crystalline ring system of water ice and shepherd moons.',
    facts: [
      'Saturn’s main rings span 282,000 km across yet average only 10 to 30 meters in thickness.',
      'It is the only planet in the Solar System with a mean density lower than liquid water (0.687 g/cm³).',
      'Its moon Titan features a thick nitrogen atmosphere and liquid methane-ethane seas.',
    ],
    visual: {
      baseColor: '#e3c898',
      secondaryColor: '#b39562',
      accentColor: '#f7ead0',
      atmosphereColor: '#fde68a',
      style: 'saturn',
      hasRings: true,
      ringColor: '#e5d4b3',
      axialTiltDeg: 26.7,
    },
  },
  {
    id: 'uranus',
    name: 'Uranus',
    order: 7,
    category: 'ice-giant',
    categoryLabel: 'Ice Giant',
    distanceFromSun: '2.87B km (19.2 AU)',
    distanceAu: 19.2,
    diameterKm: '50,724 km',
    meanTemperature: '-195 °C',
    moons: 28,
    orbitalPeriod: '84 Earth years',
    dayLength: '17.2 hours',
    gravity: '8.69 m/s²',
    shortDescription:
      'A serene cyan ice giant rolling sideways along its orbit with an extreme 98-degree axial tilt.',
    facts: [
      'Methane in the upper hydrogen-helium atmosphere absorbs red light, giving Uranus its pale cyan hue.',
      'Its extreme axial tilt produces 42-year-long polar summers and 42-year-long winters.',
      'Thirteen dark, narrow rings orbit vertically around its tilted equatorial plane.',
    ],
    visual: {
      baseColor: '#7dd3fc',
      secondaryColor: '#38bdf8',
      accentColor: '#bae6fd',
      atmosphereColor: '#67e8f9',
      style: 'uranus',
      hasRings: true,
      ringColor: '#94a3b8',
      axialTiltDeg: 97.8,
    },
  },
  {
    id: 'neptune',
    name: 'Neptune',
    order: 8,
    category: 'ice-giant',
    categoryLabel: 'Ice Giant',
    distanceFromSun: '4.50B km (30.1 AU)',
    distanceAu: 30.1,
    diameterKm: '49,244 km',
    meanTemperature: '-201 °C',
    moons: 16,
    orbitalPeriod: '164.8 Earth years',
    dayLength: '16.1 hours',
    gravity: '11.15 m/s²',
    shortDescription:
      'The wind-swept azure frontier driven by internal heat and supersonic equatorial jet streams.',
    facts: [
      'Neptune’s winds reach 2,100 km/h — the fastest sustained planetary winds in the Solar System.',
      'It was the first planet discovered through mathematical prediction before telescopic observation in 1846.',
      'Its largest moon Triton orbits backward and erupts nitrogen-ice geysers.',
    ],
    visual: {
      baseColor: '#2563eb',
      secondaryColor: '#1e3a8a',
      accentColor: '#60a5fa',
      atmosphereColor: '#3b82f6',
      style: 'neptune',
      axialTiltDeg: 28.3,
    },
  },
];

export const EXPLORATION_TOPICS: ExplorationTopic[] = [
  {
    id: 'black-holes',
    title: 'Black Holes',
    classification: 'Relativistic Singularity',
    image: '/src/assets/images/explore_black_hole_1795447845576.jpg',
    shortDescription:
      'Regions of spacetime where gravity bends light itself into photon rings and superheated accretion disks.',
    overview:
      'Formed from the gravitational collapse of massive stars or galaxy-center mergers, black holes trap all matter and radiation beyond the event horizon. Superheated plasma spiraling inward emits X-rays and synchrotron light that reveal their silhouette.',
    telemetryMetrics: [
      { label: 'Nearest Confirmed', value: 'Gaia BH1 · 1,560 ly' },
      { label: 'Largest Known', value: 'TON 618 · 66B Solar Masses' },
      { label: 'Horizon Escape', value: '> 299,792 km/s' },
    ],
    notableExamples: ['Sagittarius A* (Milky Way)', 'M87* (Virgo Cluster)', 'Cygnus X-1'],
    hasSimulatorLink: true,
  },
  {
    id: 'nebulae',
    title: 'Nebulae',
    classification: 'Interstellar Nurseries',
    image: '/src/assets/images/explore_nebula_1795447845212.jpg',
    shortDescription:
      'Colossal clouds of ionized hydrogen, cosmic dust, and plasma sculpting new generations of stars.',
    overview:
      'Nebulae act as both stellar cradles and remnants. Radiation from newborn O-type stars carves towering molecular pillars, while supernova shockwaves seed surrounding space with carbon, oxygen, and heavy elements.',
    telemetryMetrics: [
      { label: 'Orion Nebula Distance', value: '1,344 ly' },
      { label: 'Typical Span', value: '10 – 100+ light-years' },
      { label: 'Primary Gas', value: 'Ionized Hydrogen (H II)' },
    ],
    notableExamples: ['Eagle Nebula (M16)', 'Carina Nebula', 'Crab Nebula (M1)'],
  },
  {
    id: 'galaxies',
    title: 'Galaxies',
    classification: 'Cosmological Structures',
    image: '/src/assets/images/explore_galaxy_1795447844587.jpg',
    shortDescription:
      'Gravitationally bound island universes containing hundreds of billions of stars, dust lanes, and dark matter.',
    overview:
      'Spanning spiral, elliptical, and irregular morphologies, galaxies assemble along vast cosmic web filaments. Deep infrared surveys allow astronomers to trace galaxy formation back within 300 million years of the Big Bang.',
    telemetryMetrics: [
      { label: 'Observable Count', value: '~2 Trillion Galaxies' },
      { label: 'Milky Way Stars', value: '100B – 400B' },
      { label: 'Nearest Major Spiral', value: 'Andromeda (M31) · 2.54M ly' },
    ],
    notableExamples: ['Milky Way', 'Andromeda (M31)', 'Whirlpool Galaxy (M51)'],
  },
  {
    id: 'exoplanets',
    title: 'Exoplanets',
    classification: 'Extrasolar Worlds',
    image: '/src/assets/images/explore_exoplanet_1795447845415.jpg',
    shortDescription:
      'Worlds orbiting distant stars — from scorching lava super-Earths to temperate ocean candidates.',
    overview:
      'Detected via transit photometry and radial velocity wobble, thousands of exoplanets have transformed planetary science. Transmission spectroscopy now probes their atmospheres for water vapor, methane, and carbon dioxide.',
    telemetryMetrics: [
      { label: 'Confirmed Worlds', value: '5,800+ Cataloged' },
      { label: 'Nearest Exoplanet', value: 'Proxima Centauri b · 4.24 ly' },
      { label: 'Primary Detection', value: 'Transit & Radial Velocity' },
    ],
    notableExamples: ['TRAPPIST-1e', 'Kepler-186f', '55 Cancri e'],
  },
  {
    id: 'stars',
    title: 'Stars',
    classification: 'Thermonuclear Furnaces',
    image: '/src/assets/images/explore_stars_1795447845786.jpg',
    shortDescription:
      'Self-luminous plasma spheres fusing hydrogen into helium and forging the chemical elements of the cosmos.',
    overview:
      'From cool red dwarfs burning steadily for trillions of years to luminous blue supergiants ending in core-collapse supernovae, a star’s initial mass dictates its luminosity, color temperature, and ultimate fate.',
    telemetryMetrics: [
      { label: 'Core Fusion Temp', value: '15M – 100M+ K' },
      { label: 'Spectral Classes', value: 'O · B · A · F · G · K · M' },
      { label: 'Solar Lifespan', value: '~10 Billion Years' },
    ],
    notableExamples: ['Sirius A', 'Betelgeuse', 'Proxima Centauri'],
  },
];

export const MISSIONS: MissionEntry[] = [
  {
    id: 'apollo-11',
    name: 'Apollo 11',
    date: 'July 20, 1969',
    year: 1969,
    agency: 'NASA',
    status: 'Historic Completed',
    image: '/src/assets/images/mission_apollo_lunar_1795447844993.jpg',
    shortDescription:
      'First crewed landing on the Moon, delivering astronauts to the Sea of Tranquility and returning lunar samples.',
    extendedSummary:
      'Launched aboard a Saturn V rocket, Neil Armstrong, Buzz Aldrin, and Michael Collins achieved humanity’s first footsteps on another celestial body, deploying seismic experiments and returning 21.5 kg of lunar basalt to Earth.',
    highlights: [
      { label: 'Landing Site', value: 'Mare Tranquillitatis' },
      { label: 'Surface EVA', value: '2h 31m 40s' },
      { label: 'Lunar Samples', value: '21.55 kg returned' },
    ],
  },
  {
    id: 'voyager-1',
    name: 'Voyager 1',
    date: 'September 5, 1977',
    year: 1977,
    agency: 'NASA / JPL',
    status: 'Active · Interstellar Space',
    image: '/src/assets/images/mission_voyager_1_1795447845200.jpg',
    shortDescription:
      'Humanity’s farthest spacecraft, now cruising through interstellar plasma beyond the heliopause.',
    extendedSummary:
      'After capturing unprecedented views of Jupiter’s storms and Saturn’s moon Titan, Voyager 1 turned back to snap the iconic Pale Blue Dot portrait in 1990 before crossing into interstellar space in August 2012.',
    highlights: [
      { label: 'Current Distance', value: '~166 AU (~24.8B km)' },
      { label: 'One-Way Signal', value: '22h 56m' },
      { label: 'Payload', value: 'Golden Record & Plasma Suite' },
    ],
  },
  {
    id: 'voyager-2',
    name: 'Voyager 2',
    date: 'August 20, 1977',
    year: 1977,
    agency: 'NASA / JPL',
    status: 'Active · Interstellar Space',
    image: '/src/assets/images/mission_voyager_2_1795447845641.jpg',
    shortDescription:
      'The only spacecraft to visit all four giant planets — Jupiter, Saturn, Uranus, and Neptune.',
    extendedSummary:
      'Exploiting a once-in-176-year planetary alignment, Voyager 2 executed the Grand Tour of the outer Solar System, discovering active cryovolcanism on Triton and Uranus’s tilted magnetic field.',
    highlights: [
      { label: 'Grand Tour', value: '4 Giant Planets' },
      { label: 'Current Distance', value: '~138 AU (~20.6B km)' },
      { label: 'Cruise Speed', value: '15.37 km/s' },
    ],
  },
  {
    id: 'hubble',
    name: 'Hubble Space Telescope',
    date: 'April 24, 1990',
    year: 1990,
    agency: 'NASA / ESA',
    status: 'Active · Low Earth Orbit',
    image: '/src/assets/images/mission_hubble_1795447845197.jpg',
    shortDescription:
      'Iconic optical and ultraviolet observatory that pinned down the expansion rate of the universe.',
    extendedSummary:
      'Orbiting 535 km above Earth’s atmospheric distortion, Hubble has captured over 1.6 million observations, revealing deep-field galaxies, protoplanetary disks, and accelerating cosmic expansion.',
    highlights: [
      { label: 'Orbit Altitude', value: '535 km (LEO)' },
      { label: 'Primary Mirror', value: '2.4 m Diameter' },
      { label: 'Observations', value: '1.6M+ Exposures' },
    ],
  },
  {
    id: 'iss',
    name: 'International Space Station',
    date: 'November 20, 1998',
    year: 1998,
    agency: 'NASA / Roscosmos / ESA / JAXA / CSA',
    status: 'Active · Crewed Laboratory',
    image: '/src/assets/images/mission_iss_1795447845235.jpg',
    shortDescription:
      'Continuously inhabited orbital microgravity research outpost circling Earth 16 times every day.',
    extendedSummary:
      'Assembled over dozens of orbital flights, the ISS serves as an international testbed for human spaceflight physiology, fluid physics, Earth climate observation, and closed-loop life support.',
    highlights: [
      { label: 'Orbital Velocity', value: '27,600 km/h' },
      { label: 'Pressurized Volume', value: '916 m³' },
      { label: 'Orbits Per Day', value: '15.5 Revolutions' },
    ],
  },
  {
    id: 'jwst',
    name: 'James Webb Space Telescope',
    date: 'December 25, 2021',
    year: 2021,
    agency: 'NASA / ESA / CSA',
    status: 'Active · Sun-Earth L2',
    image: '/src/assets/images/mission_jwst_1795447846524.jpg',
    shortDescription:
      'Flagship infrared space observatory peering through cosmic dust to witness the earliest galaxies.',
    extendedSummary:
      'Stationed 1.5 million km away at Lagrange Point L2 behind a tennis-court-sized sunshield, JWST’s 6.5-meter gold-coated beryllium mirror captures faint infrared signatures from ancient galaxies and exoplanet atmospheres.',
    highlights: [
      { label: 'Station', value: 'Sun-Earth L2 (1.5M km)' },
      { label: 'Primary Mirror', value: '6.5 m · 18 Gold Segments' },
      { label: 'Operating Temp', value: '-223 °C (50 K)' },
    ],
  },
];

export const DASHBOARD_COUNTERS = [
  {
    id: 'total-planets',
    label: 'Solar System Planets',
    targetValue: 8,
    suffix: '',
    detail: 'IAU recognized major worlds',
  },
  {
    id: 'known-exoplanets',
    label: 'Confirmed Exoplanets',
    targetValue: 5812,
    suffix: '+',
    detail: 'Reference archive count',
  },
  {
    id: 'active-missions',
    label: 'Active Space Missions',
    targetValue: 34,
    suffix: '',
    detail: 'Orbital, lunar & deep-space probes',
  },
  {
    id: 'deep-observatories',
    label: 'Space Observatories',
    targetValue: 18,
    suffix: '',
    detail: 'Multi-wavelength fleet',
  },
];

export const CELESTIAL_TARGETS: CelestialTarget[] = [
  {
    id: 'moon',
    name: 'The Moon',
    type: 'Natural Satellite',
    distanceKm: 384_400,
    note: 'Mean orbital distance from Earth center',
  },
  {
    id: 'mars',
    name: 'Mars (Closest Approach)',
    type: 'Terrestrial Planet',
    distanceKm: 54_600_000,
    note: 'Minimum theoretical opposition distance',
  },
  {
    id: 'jupiter',
    name: 'Jupiter (Mean Opposition)',
    type: 'Gas Giant',
    distanceKm: 628_730_000,
    note: 'Average closest orbital alignment',
  },
  {
    id: 'voyager-1',
    name: 'Voyager 1 Probe',
    type: 'Interstellar Spacecraft',
    distanceKm: 24_830_000_000,
    note: 'Simulated 2026 heliocentric range (~166 AU)',
  },
  {
    id: 'proxima',
    name: 'Proxima Centauri',
    type: 'Nearest Exoplanet Host Star',
    distanceKm: 40_140_000_000_000,
    note: '4.24 light-years in Centaurus',
  },
  {
    id: 'orion',
    name: 'Orion Nebula (M42)',
    type: 'Diffuse Stellar Nursery',
    distanceKm: 1.2715e16,
    note: '1,344 light-years across the Orion Arm',
  },
  {
    id: 'sgr-a',
    name: 'Sagittarius A*',
    type: 'Galactic Core Black Hole',
    distanceKm: 2.523e17,
    note: '26,670 light-years at the Milky Way center',
  },
];
