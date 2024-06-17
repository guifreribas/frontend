export type MapStyles = 'STREET' | 'SATELLITE' | 'NAVIGATION' | 'OUTDOORS';
export type MapCategories = 'RESTAURANTS' | 'HOTELS' | 'PARKINGS' | 'THEATERS';

export type MapMarkersResponse = {
  count: number;
  markers: MapMarker[];
  page: string;
  ok: boolean;
};

export type MapMarker = {
  _id: string;
  name: string;
  category: MapCategories;
  latitude: number;
  longitude: number;
  description: string;
};

export type AddMapMarker = {
  name: string;
  description: string;
  category: MapCategories;
  latitude: number;
  longitude: number;
};

export type AddMarkerResponse = {
  marker: MapMarker;
  ok: boolean;
};

export type MapMarkerDeleteResponse = {
  message: string;
  marker: MapMarker;
  ok: boolean;
};
