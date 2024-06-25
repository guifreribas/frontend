import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import {
  CalendarOptions,
  DateSelectArg,
  EventApi,
  EventClickArg,
  EventDropArg,
} from '@fullcalendar/core/index.js';
import interactionPlugin, {
  EventResizeStartArg,
  EventResizeStopArg,
} from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import {
  INITIAL_EVENTS,
  createEventId,
  dateParser,
  getColor,
} from './event-utils';
import { CalendarEvent, CalendarEventUpdate } from '../../models/calendar';
import { FullCalendarService } from '../../services/full-calendar.service';
import { Modal } from 'bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModalComponent } from '../../components/calendar-modal/calendar-modal.component';
import dayjs from 'dayjs';
import { firstValueFrom, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-full-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FullCalendarModule,
    ReactiveFormsModule,
    FormsModule,
    CalendarModalComponent,
  ],
  templateUrl: './full-calendar.component.html',
  styleUrl: './full-calendar.component.scss',
})
export class FullCalendarComponent implements OnInit {
  @ViewChild('editModal') editModal!: ElementRef;
  public modal!: Modal;
  private calendarService = inject(FullCalendarService);
  public showToast = signal(false);
  public events = signal<CalendarEvent[]>([]);
  public event = signal<any | null>(null);
  public calendarVisible = signal(true);
  public calendarOptions = signal<CalendarOptions>({
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    initialView: 'dayGridMonth',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    eventColor: '#0000ff',
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    eventDrop: this.handleEventDrop.bind(this),
    eventResize: this.handleEventResize.bind(this),
  });
  public currentEvents = signal<EventApi[]>([]);
  public title = new FormControl('');
  public allDay = new FormControl(false);
  public color = new FormControl('BLUE');

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.calendarService.getEvents().subscribe({
      next: (events) => {
        this.calendarOptions.set({
          events: events.calendars.map((event: CalendarEvent) => {
            const textColor =
              event?.backgroundColor === 'YELLOW' ? 'black' : 'white';
            const backgroundColor = event?.backgroundColor || 'BLUE';
            return {
              ...event,
              start: dateParser(event.start),
              end: dateParser(event.end),
              allday: event.allDay,
              backgroundColor,
              textColor,
            };
          }),
        });
      },
      error: (err) => console.log(err),
    });
  }

  onAddEvent(): string {
    return 'addEvent';
  }

  handleCalendarToggle() {
    this.calendarVisible.update((bool) => !bool);
  }

  handleWeekendsToggle() {
    this.calendarOptions.update((options) => ({
      ...options,
      weekends: !options.weekends,
    }));
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Please enter a new title for your event');

    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect(); // clear date selection

    this.calendarService
      .addEvent({
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      })
      .subscribe({
        next: (res) => {
          if (title) {
            calendarApi.addEvent({
              id: String(res.calendar._id),
              title,
              start: selectInfo.startStr,
              end: selectInfo.endStr,
              allDay: selectInfo.allDay,
              backgroundColor: 'BLUE',
            });
          }
        },
        error: (err) => console.log(err),
      });
  }

  handleEventClick(clickInfo: EventClickArg) {
    const modalElement = this.editModal.nativeElement;
    this.modal = new Modal(modalElement);
    this.modal.show();
    this.title.setValue(clickInfo.event.title);
    this.event.set(clickInfo);
    this.allDay.setValue(clickInfo.event.allDay);
  }

  onHideModal() {
    this.modal.hide();
    this.event.set(null);
  }

  async onUpdateEvent() {
    const color = getColor(this.color.value);
    const dataToUpdate: CalendarEventUpdate = {
      title: this.title.value || '',
      backgroundColor: color || undefined,
    };
    try {
      await firstValueFrom(
        this.calendarService.updateEvent(
          dataToUpdate,
          this.event().event.extendedProps._id
        )
      );
      this.event().event.setProp('title', dataToUpdate.title);
      this.event().event.setProp(
        'backgroundColor',
        dataToUpdate.backgroundColor
      );
      if (dataToUpdate.backgroundColor === 'YELLOW') {
        this.event().event.setProp('textColor', 'black');
      } else {
        this.event().event.setProp('textColor', 'white');
      }
    } catch (err) {
      console.log(err);
    }
    this.modal.hide();
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges();
  }

  onDeleteEvent(): void {
    this.handleDeleteEvent();
  }

  handleDeleteEvent() {
    this.calendarService
      .deleteEvent(this.event().event.extendedProps._id)
      .subscribe({
        next: (res) => {
          this.event().event.remove();
          this.modal.hide();
          this.event.set(null);
        },
        error: (err) => console.log(err),
      });
  }

  handleEventDrop(event: EventDropArg) {
    const dataToUpdate: CalendarEventUpdate = {
      ...(event.event.start && {
        start: dayjs(event.event.start).add(1, 'day').toDate(),
      }),
      ...(event.event.end && {
        end: dayjs(event.event.end).add(1, 'day').toDate(),
      }),
      allDay: event.event.allDay,
    };
    this.calendarService
      .updateEvent(dataToUpdate, event.event.extendedProps['_id'])
      .subscribe({
        next: (res) => console.log('updateEvent', res),
        error: (err) => console.log(err),
      });
  }

  handleEventResize(event: EventResizeStartArg | EventResizeStopArg) {
    const dataToUpdate: CalendarEventUpdate = {
      ...(event.event.start && {
        start: dayjs(event.event.start).add(1, 'day').toDate(),
      }),
      ...(event.event.end && {
        end: dayjs(event.event.end).add(1, 'day').toDate(),
      }),
      allDay: event.event.allDay,
    };
    this.calendarService
      .updateEvent(dataToUpdate, event.event.extendedProps['_id'])
      .subscribe({
        next: (res) => console.log('updateEvent', res),
        error: (err) => console.log(err),
      });
  }
}
