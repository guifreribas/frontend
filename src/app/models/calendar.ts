export type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  backgroundColor?: BackgroundColor;
  createdAt: Date;
  updatedAt: Date;
};

export type BackgroundColor = 'BLUE' | 'RED' | 'GREEN' | 'YELLOW';

export type CalendarEventUpdate = {
  title?: string;
  allDay?: boolean;
  start?: Date;
  end?: Date;
  backgroundColor?: BackgroundColor;
};
