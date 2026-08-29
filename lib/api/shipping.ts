import { apiClient } from './client';
import { CarrierRateQuote, TrackingStatusResponse } from './types';

export interface ServiceabilityCheckResponse {
  success: boolean;
  serviceable: boolean;
  codAvailable: boolean;
  city?: string;
  state?: string;
  estimatedDays?: number;
  providers?: any[];
}

export interface RateQuotesResponse {
  success: boolean;
  quotes: CarrierRateQuote[];
  source: 'live' | 'cache' | 'zone_fallback';
  priority: string;
  pincode: string;
  country: string;
}

export async function checkShippingServiceability(
  pincode: string,
  country: string = 'India',
  weightKg: number = 0.5,
  cod: boolean = false
): Promise<ServiceabilityCheckResponse> {
  try {
    const res = await apiClient.post<ServiceabilityCheckResponse>('/api/storefront/shipping/serviceability', {
      pincode,
      country,
      weightKg,
      cod,
    });
    return res;
  } catch (error) {
    console.warn('Failed to check shipping serviceability, returning fallback:', error);
    return {
      success: true,
      serviceable: true,
      codAvailable: true,
      city: 'Hub Center',
      estimatedDays: 3,
    };
  }
}

export async function getShippingRateQuotes(payload: {
  destination: {
    pincode: string;
    country?: string;
    state?: string;
    city?: string;
    street?: string;
  };
  parcel?: {
    weightKg?: number;
  };
  isCod?: boolean;
  codAmount?: number;
  cartSubtotal?: number;
}): Promise<CarrierRateQuote[]> {
  try {
    const res = await apiClient.post<RateQuotesResponse>('/api/storefront/shipping/quotes', payload);
    if (res && Array.isArray(res.quotes)) {
      return res.quotes;
    }
  } catch (error) {
    console.warn('Failed to fetch dynamic shipping rate quotes:', error);
  }

  // Graceful fallback if backend call fails
  const isIndia = (payload.destination.country || 'India').toLowerCase() === 'india';
  return [
    {
      providerId: 'shiprocket',
      carrierCode: 'DELHIVERY_SURFACE',
      carrierName: 'Standard Surface (Delhivery / Xpressbees)',
      serviceType: 'standard',
      serviceName: 'Economy Ground Delivery',
      estimatedDays: 3,
      cost: isIndia ? (payload.cartSubtotal && payload.cartSubtotal >= 999 ? 0 : 49) : 9.99,
      currency: isIndia ? 'INR' : 'USD',
      codAvailable: true,
      badge: payload.cartSubtotal && payload.cartSubtotal >= 999 ? 'Free Shipping' : 'Best Value',
    },
    {
      providerId: 'shiprocket',
      carrierCode: 'BLUEDART_AIR',
      carrierName: 'Air Express Priority (Blue Dart)',
      serviceType: 'express',
      serviceName: 'Next-Flight Priority Air',
      estimatedDays: 1,
      cost: isIndia ? 89 : 24.99,
      currency: isIndia ? 'INR' : 'USD',
      codAvailable: true,
      badge: 'Fastest',
    },
  ];
}

export interface TrackingApiResponse {
  success: boolean;
  tracking: TrackingStatusResponse;
}

export async function trackShipmentAwb(
  awb: string,
  carrier: string = 'SHIPROCKET'
): Promise<TrackingStatusResponse | null> {
  try {
    const encodedAwb = encodeURIComponent(awb);
    const encodedCarrier = encodeURIComponent(carrier);
    const res = await apiClient.get<TrackingApiResponse>(
      `/api/storefront/shipping/track/${encodedAwb}?carrier=${encodedCarrier}`
    );
    return res.tracking || null;
  } catch (error) {
    console.warn('Failed to track shipment AWB:', error);
    return null;
  }
}
