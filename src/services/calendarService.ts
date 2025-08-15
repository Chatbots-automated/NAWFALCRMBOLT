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

// Mock calendar events for production demo
const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    subject: 'Elite Strategy Session - John Smith',
    start: {
      dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
      timeZone: 'Eastern Standard Time'
    },
    end: {
      dateTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // 3 hours from now
      timeZone: 'Eastern Standard Time'
    },
    organizer: {
      emailAddress: {
        name: 'Nawfal Filali',
        address: 'nawfal@filaliempire.com'
      }
    },
    location: {
      displayName: 'Elite Command Center'
    },
    bodyPreview: 'Strategic coaching session focused on elite performance and leadership transformation.',
    webLink: 'https://outlook.office365.com/calendar',
    isAllDay: false
  },
  {
    id: '2',
    subject: 'Elite Transformation Call - Sarah Wilson',
    start: {
      dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      timeZone: 'Eastern Standard Time'
    },
    end: {
      dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // Tomorrow + 1 hour
      timeZone: 'Eastern Standard Time'
    },
    organizer: {
      emailAddress: {
        name: 'Nawfal Filali',
        address: 'nawfal@filaliempire.com'
      }
    },
    location: {
      displayName: 'Cal.com Video Call'
    },
    bodyPreview: 'Elite transformation coaching session for high-performance leadership development.',
    webLink: 'https://outlook.office365.com/calendar',
    isAllDay: false
  },
  {
    id: '3',
    subject: 'Elite Mastermind Group Session',
    start: {
      dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
      timeZone: 'Eastern Standard Time'
    },
    end: {
      dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), // Day after tomorrow + 2 hours
      timeZone: 'Eastern Standard Time'
    },
    organizer: {
      emailAddress: {
        name: 'Nawfal Filali',
        address: 'nawfal@filaliempire.com'
      }
    },
    location: {
      displayName: 'Elite Mastermind HQ'
    },
    bodyPreview: 'Exclusive mastermind session for elite entrepreneurs and leaders.',
    webLink: 'https://outlook.office365.com/calendar',
    isAllDay: false
  }
];

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
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Calendar API error: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Calendar API returned non-JSON response');
      }

      try {
        const data: CalendarResponse = await response.json();
        return data.value || [];
      } catch (parseError) {
        throw new Error('Failed to parse calendar API response');
      }
    } catch (error) {
      console.error('Calendar service error:', error);
      // Return empty array on error
      return [];
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