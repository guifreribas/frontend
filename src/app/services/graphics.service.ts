import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  Graphic,
  GraphicAddResponse,
  GraphicResponse,
} from '../models/graphic';

@Injectable({
  providedIn: 'root',
})
export class GraphicsService {
  private http = inject(HttpClient);

  constructor() {}

  getGraphics(query: any = {}) {
    const filterParmas = Object.keys(query)
      .map((key) => `${key}=${query[key]}`)
      .join('&');
    return this.http.get<GraphicResponse>(
      `http://localhost:4000/graphics?${filterParmas}`
    );
  }

  addGraphics(graphic: Graphic) {
    return this.http.post<GraphicAddResponse>(
      'http://localhost:4000/graphics',
      graphic
    );
  }

  updateGraphics(graphic: Graphic) {
    return this.http.put<Graphic>('http://localhost:4000/graphics', graphic);
  }

  deleteGraphics(id: string) {
    return this.http.delete<Graphic>('http://localhost:4000/graphics/' + id);
  }
}
