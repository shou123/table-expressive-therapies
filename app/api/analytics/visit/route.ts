import { recordVisitorLocation } from '@/db/analytics';

export const dynamic = 'force-dynamic';

type EdgeLocation = {
  country?: unknown;
  region?: unknown;
  city?: unknown;
  latitude?: unknown;
  longitude?: unknown;
};

function stringValue(value: unknown) {
  return typeof value === 'string' ? value : undefined;
}

function numberValue(value: unknown) {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string' || !value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function countryName(countryCode: string) {
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(countryCode) ?? countryCode;
  } catch {
    return countryCode;
  }
}

export async function POST(request: Request) {
  const userAgent = request.headers.get('user-agent') ?? '';
  if (/bot|crawler|spider|preview|facebookexternalhit|slurp/i.test(userAgent)) {
    return new Response(null, { status: 204 });
  }

  const edge = (request as Request & { cf?: EdgeLocation }).cf;
  const countryCode = stringValue(edge?.country)?.toUpperCase();
  if (!countryCode || !/^[A-Z]{2}$/.test(countryCode)) {
    return new Response(null, { status: 204 });
  }

  try {
    await recordVisitorLocation({
      countryCode,
      countryName: countryName(countryCode),
      regionName: stringValue(edge?.region),
      cityName: stringValue(edge?.city),
      latitude: numberValue(edge?.latitude),
      longitude: numberValue(edge?.longitude),
    });
  } catch (error) {
    console.error('Unable to record aggregate visitor location', error);
  }

  return new Response(null, { status: 204 });
}
