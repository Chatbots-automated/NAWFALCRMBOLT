export interface CreateEventRequest {
  subject: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  body?: {
    contentType: string;
    content: string;
  };
  location?: string;
  description?: string;
  attendees?: string[];
  isAllDay?: boolean;
  allowNewTimeProposals?: boolean;
  isOnlineMeeting?: boolean;
  onlineMeetingProvider?: string;
}

export interface CreateEventResponse {
  success: boolean;
  eventId?: string;
  message?: string;
  error?: string;
}

class EventService {
  private readonly webhookUrl = 'https://n8n-up8s.onrender.com/webhook/ad873246-517b-4a11-92a6-75710399b123';

  async createEvent(eventData: CreateEventRequest): Promise<CreateEventResponse> {
    try {
      // Format the request body to match the required JSON structure
      const requestBody = {
        subject: eventData.subject,
        body: eventData.description ? {
          contentType: "HTML",
          content: eventData.description
        } : undefined,
        start: eventData.start,
        end: eventData.end,
        location: eventData.location ? {
          displayName: eventData.location
        } : undefined,
        attendees: eventData.attendees ? eventData.attendees.map(email => ({
          emailAddress: {
            address: email.trim(),
            name: email.trim().split('@')[0] // Use email prefix as name
          },
          type: "required"
        })) : undefined,
        allowNewTimeProposals: eventData.allowNewTimeProposals ?? true,
        isOnlineMeeting: eventData.isOnlineMeeting ?? true,
        onlineMeetingProvider: eventData.onlineMeetingProvider ?? "teamsForBusiness"
      };

      // Remove undefined properties
      Object.keys(requestBody).forEach(key => {
        if (requestBody[key as keyof typeof requestBody] === undefined) {
          delete requestBody[key as keyof typeof requestBody];
        }
      });

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        eventId: result.id || result.eventId,
        message: 'Event created successfully'
      };
    } catch (error) {
      console.error('Failed to create event:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create event'
      };
    }
  }

  // Helper method to format date for Microsoft Graph
  formatDateTimeForGraph(date: Date, timeZone: string = 'Eastern Standard Time'): string {
    return date.toISOString();
  }

  // Helper method to validate event data
  validateEventData(eventData: CreateEventRequest): string[] {
    const errors: string[] = [];

    if (!eventData.subject || eventData.subject.trim().length === 0) {
      errors.push('Subject is required');
    }

    if (!eventData.start?.dateTime) {
      errors.push('Start date and time is required');
    }

    if (!eventData.end?.dateTime) {
      errors.push('End date and time is required');
    }

    if (eventData.start?.dateTime && eventData.end?.dateTime) {
      const start = new Date(eventData.start.dateTime);
      const end = new Date(eventData.end.dateTime);
      
      if (start >= end) {
        errors.push('End time must be after start time');
      }
    }

    return errors;
  }
}

export const eventService = new EventService();