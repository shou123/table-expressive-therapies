import { env } from 'cloudflare:workers';
import { ensureSchema } from './content';

type SiteBindings = {
  DB: D1Database;
};

type VisitorLocationRow = {
  location_key: string;
  country_code: string;
  country_name: string;
  region_name: string;
  city_name: string;
  latitude: number | null;
  longitude: number | null;
  visit_count: number;
  first_seen: string;
  last_seen: string;
};

export type VisitorLocation = {
  key: string;
  countryCode: string;
  countryName: string;
  regionName: string;
  cityName: string;
  latitude: number | null;
  longitude: number | null;
  visits: number;
  firstSeen: string;
  lastSeen: string;
};

export type VisitorAnalytics = {
  totalVisits: number;
  countries: number;
  locations: number;
  generatedAt: string;
  locationRows: VisitorLocation[];
};

type VisitorLocationInput = {
  countryCode: string;
  countryName: string;
  regionName?: string;
  cityName?: string;
  latitude?: number | null;
  longitude?: number | null;
};

function database() {
  return (env as unknown as SiteBindings).DB;
}

function cleanText(value: string | undefined, maxLength: number) {
  return (value ?? '').replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function roundedCoordinate(value: number | null | undefined, min: number, max: number) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) return null;
  return Math.round(value * 10) / 10;
}

export async function recordVisitorLocation(input: VisitorLocationInput) {
  const countryCode = cleanText(input.countryCode, 2).toUpperCase();
  if (!/^[A-Z]{2}$/.test(countryCode) || countryCode === 'XX') return;

  const countryName = cleanText(input.countryName, 80) || countryCode;
  const regionName = cleanText(input.regionName, 100);
  const cityName = cleanText(input.cityName, 100);
  const latitude = roundedCoordinate(input.latitude, -90, 90);
  const longitude = roundedCoordinate(input.longitude, -180, 180);
  const locationKey = [countryCode, regionName, cityName, latitude ?? '', longitude ?? ''].join('|').toLowerCase();
  const now = new Date().toISOString();

  await ensureSchema();
  await database().prepare(
    `INSERT INTO visitor_locations (
       location_key, country_code, country_name, region_name, city_name,
       latitude, longitude, visit_count, first_seen, last_seen
     ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
     ON CONFLICT(location_key) DO UPDATE SET
       visit_count = visitor_locations.visit_count + 1,
       last_seen = excluded.last_seen`,
  ).bind(
    locationKey,
    countryCode,
    countryName,
    regionName,
    cityName,
    latitude,
    longitude,
    now,
    now,
  ).run();
}

export async function getVisitorAnalytics(): Promise<VisitorAnalytics> {
  await ensureSchema();
  const { results } = await database().prepare(
    `SELECT location_key, country_code, country_name, region_name, city_name,
       latitude, longitude, visit_count, first_seen, last_seen
     FROM visitor_locations
     ORDER BY visit_count DESC, last_seen DESC
     LIMIT 250`,
  ).all<VisitorLocationRow>();

  const locationRows = results.map((row) => ({
    key: row.location_key,
    countryCode: row.country_code,
    countryName: row.country_name,
    regionName: row.region_name,
    cityName: row.city_name,
    latitude: row.latitude,
    longitude: row.longitude,
    visits: row.visit_count,
    firstSeen: row.first_seen,
    lastSeen: row.last_seen,
  }));

  return {
    totalVisits: locationRows.reduce((sum, location) => sum + location.visits, 0),
    countries: new Set(locationRows.map((location) => location.countryCode)).size,
    locations: locationRows.length,
    generatedAt: new Date().toISOString(),
    locationRows,
  };
}
