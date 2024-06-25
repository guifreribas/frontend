import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import * as Mapboxgl from 'mapbox-gl';
import { MapboxAddressAutofill, MapboxSearchBox } from '@mapbox/search-js-web';
import { environment } from '../../../environments/environment.development';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  AddMapMarker,
  MapCategories,
  MapMarker,
  MapMarkersResponse,
  MapStyles,
} from '../../models/maps';
import { MapsService } from '../../services/maps.service';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './mapa.component.html',
  styleUrl: 'mapa.component.scss',
})
export class MapaComponent implements OnInit {
  map!: Mapboxgl.Map;
  public lngLat = signal<[number, number]>([2.1917479, 41.4024528]);
  public style = signal<string>('mapbox://styles/mapbox/streets-v12');
  public selectStyle = new FormControl<MapStyles>('STREET');
  public selectCategory = new FormControl<MapCategories>('RESTAURANTS');
  public restaurantCheckbox = new FormControl<boolean>(true);
  public hotelCheckbox = new FormControl<boolean>(true);
  public parkingCheckbox = new FormControl<boolean>(true);
  public theaterCheckbox = new FormControl<boolean>(true);
  public mapService = inject(MapsService);
  public mapMarker = signal<MapMarker | null>(null);

  constructor() {
    this.style.set('mapbox://styles/mapbox/streets-v12');
  }

  ngOnInit(): void {
    this.onConfigMap();
    const search = new MapboxSearchBox();
    search.accessToken = environment.mapboxKey;
    this.map.addControl(search);
    this.getLngLat();
    const markersCategories: MapCategories[] = [
      'RESTAURANTS',
      'HOTELS',
      'PARKINGS',
      'THEATERS',
    ];
    markersCategories.forEach((category) => {
      this.mapService.getMapMarkers(category).subscribe({
        next: (res: MapMarkersResponse) => {
          if (res.count > 0) {
            res.markers.forEach((marker: any) => {
              this.onShowMarker(marker);
            });
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    });
  }

  onConfigMap() {
    this.map = new Mapboxgl.Map({
      accessToken: environment.mapboxKey,
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [2.1917479, 41.4024528], // starting position [lng, lat] 41.4024528,2.1917479
      zoom: 14, // starting zoom
    });
  }

  onShowMarker(markerData: MapMarker) {
    const marker = new Mapboxgl.Marker({
      draggable: true,
    })
      .setLngLat([markerData.longitude, markerData.latitude])
      .addTo(this.map);
    const markerId = markerData._id;
    this.configureMarker(marker, markerId, 'SHOW', markerData);
  }

  onCreateMarker(lng: number, lat: number) {
    const marker = new Mapboxgl.Marker({
      draggable: true,
    })
      .setLngLat([lng, lat])
      .addTo(this.map);

    const markerToAdd: AddMapMarker = {
      longitude: marker.getLngLat().lng,
      latitude: marker.getLngLat().lat,
      name: '',
      description: '',
      category: this.selectCategory.value || 'RESTAURANTS',
    };

    let markerId = '';
    this.mapService.addMapMarker(markerToAdd).subscribe({
      next: (res) => {
        markerId = String(res.marker._id);
        this.configureMarker(marker, markerId, 'CREATE');
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  configureMarker(
    marker: Mapboxgl.Marker,
    markerId: string,
    action: string,
    markerData: MapMarker | null = null
  ) {
    marker.getElement().id = markerId;
    if (action === 'CREATE') {
      marker
        .getElement()
        .classList.add(
          this.selectCategory.value?.toLowerCase() || 'restaurants'
        );
    } else {
      marker
        .getElement()
        .classList.add(
          markerData?.category.toLocaleLowerCase() || 'restaurants'
        );
    }

    marker.getElement().addEventListener('click', (e: Event) => {
      e.stopPropagation();

      // if user drags the marker do not delete it
      if (
        markerData?.longitude !== marker.getLngLat().lng ||
        markerData?.latitude !== marker.getLngLat().lat
      )
        return;

      marker.remove();
      this.mapService.deleteMapMarker(markerId).subscribe({
        next: (res) => console.log('deleteMarker', res),
        error: (err) => console.log(err),
      });
    });

    marker.on('dragend', () => {
      const { lng, lat } = marker.getLngLat();
      this.lngLat.set([lng, lat]);
      this.mapService
        .updateMapMarker({ id: markerId, longitude: lng, latitude: lat })
        .subscribe({
          next: (res) => console.log('updateMarker', res),
          error: (err) => console.log(err),
        });
    });
  }

  getLngLat() {
    this.map.on('click', (e) => {
      e.preventDefault();
      this.onCreateMarker(e.lngLat.lng, e.lngLat.lat);
    });
  }

  changeStyle(e: Event) {
    if (!this.selectStyle.value) return;
    const stylesMap = {
      STREET: 'mapbox://styles/mapbox/streets-v12',
      SATELLITE: 'mapbox://styles/mapbox/satellite-v9',
      NAVIGATION: 'mapbox://styles/mapbox/navigation-day-v1',
      OUTDOORS: 'mapbox://styles/mapbox/outdoors-v12',
    };
    this.map.setStyle(stylesMap[this.selectStyle.value]);
  }

  changeCategory(e: Event) {
    if (!this.selectCategory.value) return;
  }

  onCategoryFilterChange(e: Event, category: MapCategories) {
    if (!this.restaurantCheckbox.value && category === 'RESTAURANTS') {
      const restaurantMarkers = document.querySelectorAll('.restaurants');
      restaurantMarkers?.forEach((marker) => {
        marker.remove();
      });
      return;
    }
    if (!this.hotelCheckbox.value && category === 'HOTELS') {
      const hotelMarkers = document.querySelectorAll('.hotels');
      hotelMarkers?.forEach((marker) => {
        marker.remove();
      });
      return;
    }
    if (!this.parkingCheckbox.value && category === 'PARKINGS') {
      const parkingMarkers = document.querySelectorAll('.parkings');
      parkingMarkers?.forEach((marker) => {
        marker.remove();
      });
      return;
    }
    if (!this.theaterCheckbox.value && category === 'THEATERS') {
      const theaterMarkers = document.querySelectorAll('.theaters');
      theaterMarkers?.forEach((marker) => {
        marker.remove();
      });
      return;
    }
    this.mapService.getMapMarkers(category).subscribe({
      next: (res: any) => {
        console.log('Map Markers', res);
        if (res.count > 0) {
          res.markers.forEach((marker: any) => {
            this.onShowMarker(marker);
          });
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
