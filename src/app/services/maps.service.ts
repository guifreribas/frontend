import { Injectable, inject } from '@angular/core';
import {
  AddMapMarker,
  AddMarkerResponse,
  MapCategories,
  MapMarkerDeleteResponse,
  MapMarkersResponse,
} from '../models/maps';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MapsService {
  private http = inject(HttpClient);

  constructor() {}

  getMaps() {
    return this.http.get<MapMarkersResponse>('http://localhost:4000/maps');
  }

  addMapMarker(mapMarker: AddMapMarker) {
    return this.http.post<AddMarkerResponse>(
      'http://localhost:4000/maps',
      mapMarker
    );
  }

  updateMapMarker({
    id,
    longitude,
    latitude,
  }: {
    id: string;
    longitude: number;
    latitude: number;
  }) {
    return this.http.put<AddMarkerResponse>(
      `http://localhost:4000/maps/${id}`,
      { longitude, latitude }
    );
  }

  getMapMarkers<T>(category: MapCategories) {
    if (!category)
      return this.http.get<MapMarkersResponse>('http://localhost:4000/maps');
    return this.http.get<MapMarkersResponse>(
      `http://localhost:4000/maps?category=${category}`
    );
  }

  deleteMapMarker(id: string) {
    return this.http.delete<MapMarkerDeleteResponse>(
      `http://localhost:4000/maps/${id}`
    );
  }
}
