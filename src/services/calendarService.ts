export interface CalendarEvent {
  id: string;
  subject: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  organizer: {
    emailAddress: {
      name: string;
      address: string;
    };
  };
  location?: {
    displayName: string;
  };
  bodyPreview: string;
  webLink: string;
  isAllDay: boolean;
}

export interface CalendarResponse {
  '@odata.context': string;
  value: CalendarEvent[];
}

class CalendarService {
  private readonly baseUrl = 'https://nawfalfilalicrm.vercel.app/api/calendar.js';

  async getEvents(options: {
    start?: string;
    end?: string;
    calendarId?: string;
    tz?: string;
    top?: number;
  } = {}): Promise<CalendarEvent[]> {
    try {
      const params = new URLSearchParams();
      
      if (options.start) params.set('start', options.start);
      if (options.end) params.set('end', options.end);
      if (options.calendarId) params.set('calendarId', options.calendarId);
      if (options.tz) params.set('tz', options.tz);
      if (options.top) params.set('top', options.top.toString());

      const url = `${this.baseUrl}?${params.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`Calendar API error: ${response.status} ${response.statusText}`);
      }

      const data: CalendarResponse = await response.json();
      return data.value || [];
    } catch (error) {
      console.error('Failed to fetch calendar events:', error);
      throw error;
    }
  }

  async getTodaysEvents(): Promise<CalendarEvent[]> {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    return this.getEvents({
      start: start.toISOString(),
      end: end.toISOString(),
      tz: 'Eastern Standard Time'
    });
  }

  async getUpcomingEvents(days: number = 7): Promise<CalendarEvent[]> {
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + days);

    return this.getEvents({
      start: start.toISOString(),
      end: end.toISOString(),
      tz: 'Eastern Standard Time',
      top: 50
    });
  }

  formatEventTime(event: CalendarEvent): string {
    const start = new Date(event.start.dateTime);
    const end = new Date(event.end.dateTime);
    
    if (event.isAllDay) {
      return 'All Day';
    }

    const startTime = start.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    
    const endTime = end.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    return `${startTime} - ${endTime}`;
  }

  formatEventDate(event: CalendarEvent): string {
    const date = new Date(event.start.dateTime);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    }
  }

  getEventTypeColor(subject: string): string {
    const lowerSubject = subject.toLowerCase();
    
    if (lowerSubject.includes('strategy') || lowerSubject.includes('coaching')) {
      return 'bg-purple-500';
    } else if (lowerSubject.includes('call') || lowerSubject.includes('meeting')) {
      return 'bg-blue-500';
    } else if (lowerSubject.includes('elite') || lowerSubject.includes('filali')) {
      return 'bg-red-500';
    } else if (lowerSubject.includes('review') || lowerSubject.includes('check')) {
      return 'bg-orange-500';
    } else {
      return 'bg-green-500';
    }
  }
}

export const calendarService = new CalendarService();