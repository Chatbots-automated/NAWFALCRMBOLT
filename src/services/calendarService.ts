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
    attendee_email?: string;
  } = {}): Promise<CalendarEvent[]> {
    try {
      const params = new URLSearchParams();
      
      if (options.start) params.set('start', options.start);
      if (options.end) params.set('end', options.end);
      if (options.calendarId) params.set('calendarId', options.calendarId);
      if (options.tz) params.set('tz', options.tz);
      if (options.top) params.set('top', options.top.toString());
      if (options.attendee_email) params.set('attendee_email', options.attendee_email);

      const url = `${this.baseUrl}?${params.toString()}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({
          start: options.start,
          end: options.end,
          calendarId: options.calendarId,
          tz: options.tz,
          top: options.top,
          attendee_email: options.attendee_email
        })
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

  // Get events for a specific client
  async getClientEvents(attendeeEmail: string, days: number = 365): Promise<CalendarEvent[]> {
    try {
      // Only fetch events if we have an email to filter by
      if (!attendeeEmail || !attendeeEmail.includes('@')) {
        console.log('No valid email provided for calendar filtering, returning empty array');
        return [];
      }

      try {
        const start = new Date();
        start.setDate(start.getDate() - 30); // Look back 30 days
        const end = new Date();
        end.setDate(end.getDate() + days); // Look forward specified days

        const events = await this.getEvents({
          start: start.toISOString(),
          end: end.toISOString(),
          attendee_email: attendeeEmail,
          tz: 'America/New_York',
          top: 100
        });

        // Additional client-side filtering to ensure we only get events for this specific client
        const filteredEvents = events.filter(event => {
          // Check if the client email is in the attendees or if it's the organizer
          const organizerEmail = event.organizer?.emailAddress?.address?.toLowerCase();
          const clientEmail = attendeeEmail.toLowerCase();
          
          // For now, only return events where the client is the organizer
          // This prevents showing all calendar events to every client
          return organizerEmail === clientEmail;
        });

        console.log(`Found ${filteredEvents.length} events specifically for ${attendeeEmail}`);
        return filteredEvents;
      } catch (apiError) {
        console.log('Calendar API filtering not supported, returning empty array to avoid showing all events');
        return [];
      }
    } catch (error) {
      console.error('Failed to fetch client events:', error);
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
      tz: 'America/New_York'
    });
  }

  async getUpcomingEvents(days: number = 7, timeZone: string = 'America/New_York'): Promise<CalendarEvent[]> {
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + days);

    const events = await this.getEvents({
      start: start.toISOString(),
      end: end.toISOString(),
      tz: timeZone,
      top: 50
    });
    
    // Sort events by date and time (earliest first for upcoming events)
    return events.sort((a, b) => new Date(a.start.dateTime).getTime() - new Date(b.start.dateTime).getTime());
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