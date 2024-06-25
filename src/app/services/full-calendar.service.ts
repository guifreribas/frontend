import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FullCalendarService {
  private http = inject<HttpClient>(HttpClient);

  constructor() {}

  getEvents() {
    return this.http.get<any>('http://localhost:4000/calendars');
  }

  addEvent(event: any) {
    return this.http.post<any>('http://localhost:4000/calendars', event);
  }

  updateEvent(event: any, eventId: string) {
    return this.http.put<any>(
      `http://localhost:4000/calendars/${eventId}`,
      event
    );
  }

  deleteEvent(eventId: string) {
    return this.http.delete<any>(`http://localhost:4000/calendars/${eventId}`);
  }
}
