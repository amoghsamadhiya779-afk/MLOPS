export interface TouristLocation {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  difficulty: 'easy' | 'moderate' | 'challenging';
  region: string;
  rating: number;
  tags: string[];
}

export const touristLocations: TouristLocation[] = [
  {
    id: 'nyc',
    name: 'New York City',
    country: 'USA',
    latitude: 40.7128,
    longitude: -74.0060,
    difficulty: 'easy',
    region: 'North America',
    rating: 4.8,
    tags: ['urban', 'culture', 'food']
  },
  {
    id: 'boston',
    name: 'Boston',
    country: 'USA',
    latitude: 42.3601,
    longitude: -71.0589,
    difficulty: 'easy',
    region: 'North America',
    rating: 4.6,
    tags: ['history', 'urban', 'education']
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    latitude: 48.8566,
    longitude: 2.3522,
    difficulty: 'easy',
    region: 'Europe',
    rating: 4.9,
    tags: ['culture', 'romance', 'history']
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    latitude: 35.6762,
    longitude: 139.6503,
    difficulty: 'easy',
    region: 'Asia',
    rating: 4.9,
    tags: ['urban', 'technology', 'culture']
  },
  {
    id: 'machupicchu',
    name: 'Machu Picchu',
    country: 'Peru',
    latitude: -13.1631,
    longitude: -72.5450,
    difficulty: 'challenging',
    region: 'South America',
    rating: 5.0,
    tags: ['history', 'nature', 'adventure']
  },
  {
    id: 'tajmahal',
    name: 'Taj Mahal',
    country: 'India',
    latitude: 27.1751,
    longitude: 78.0421,
    difficulty: 'moderate',
    region: 'Asia',
    rating: 4.8,
    tags: ['history', 'monument', 'culture']
  },
  {
    id: 'syd',
    name: 'Sydney',
    country: 'Australia',
    latitude: -33.8688,
    longitude: 151.2093,
    difficulty: 'easy',
    region: 'Oceania',
    rating: 4.7,
    tags: ['urban', 'beach', 'culture']
  },
  {
    id: 'cpt',
    name: 'Cape Town',
    country: 'South Africa',
    latitude: -33.9249,
    longitude: 18.4241,
    difficulty: 'moderate',
    region: 'Africa',
    rating: 4.8,
    tags: ['nature', 'beach', 'mountain']
  }
];
