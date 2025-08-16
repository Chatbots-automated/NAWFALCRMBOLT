import React from 'react';
import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, Clock, Users, Video, MapPin, BarChart3, Zap, X } from 'lucide-react';
import { calendarService, CalendarEvent } from '../services/calendarService';
import CreateEventModal from '../components/CreateEventModal';

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'week' | 'day' | 'month'>('day');
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        let days = 7; // default for week
        if (activeFilter === 'day') days = 1;
        if (activeFilter === 'month') days = 30;
        
        const upcomingEvents = await calendarService.getUpcomingEvents(days);
        setEvents(upcomingEvents);
        setFilteredEvents(upcomingEvents);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch calendar events:', err);
        setError('Failed to load calendar events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [activeFilter]);

  const handleEventCreated = () => {
    // Refresh events after creating a new one
    const fetchEvents = async () => {
      try {
        setLoading(true);
        let days = 7;
        if (activeFilter === 'day') days = 1;
        if (activeFilter === 'month') days = 30;
        const upcomingEvents = await calendarService.getUpcomingEvents(days);
        setEvents(upcomingEvents);
        setFilteredEvents(upcomingEvents);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch calendar events:', err);
        setError('Failed to load calendar events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  };

  const handleFilterChange = (filter: 'week' | 'day' | 'month') => {
    setActiveFilter(filter);
  };

  const getFilterTitle = () => {
    switch (activeFilter) {
      case 'day': return 'TODAY\'S OPERATIONS';
      case 'week': return 'WEEKLY OPERATIONS';
      case 'month': return 'MONTHLY OPERATIONS';
    }
  };

  // Generate time slots for the day view
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      const time12 = hour > 12 ? `${hour - 12}:00 PM` : hour === 12 ? '12:00 PM' : `${hour}:00 AM`;
      slots.push({
        time: time12,
        hour24: hour
      });
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Get events for a specific time slot
  const getEventsForTimeSlot = (hour: number) => {
    return filteredEvents.filter(event => {
      const eventStart = new Date(event.start.dateTime);
      const eventHour = eventStart.getHours();
     // Show events that start within this hour or span across it
     const eventEnd = new Date(event.end.dateTime);
     const eventEndHour = eventEnd.getHours();
     return eventHour === hour || (eventHour < hour && eventEndHour > hour);
    });
  };

  // Get event color based on type
  const getEventColor = (subject: string) => {
    const lowerSubject = subject.toLowerCase();
    if (lowerSubject.includes('discovery') || lowerSubject.includes('website')) {
      return 'bg-green-500';
    } else if (lowerSubject.includes('strategy') || lowerSubject.includes('elite')) {
      return 'bg-blue-500';
    } else if (lowerSubject.includes('coaching') || lowerSubject.includes('session')) {
      return 'bg-purple-500';
    } else {
      return 'bg-red-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white">
            FILALI EMPIRE
            <span className="block text-4xl bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent font-black">
              BATTLE SCHEDULE
            </span>
          </h1>
          <p className="text-gray-300 mt-2 font-semibold">TACTICAL OPERATIONS. PRECISION TIMING.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 border border-red-500/30 rounded-xl hover:bg-red-500/10 transition-colors text-gray-300 hover:text-white font-medium">
            <Video size={16} />
            Cal.com Sync
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-200 font-semibold"
          >
            <Plus size={16} />
            NEW ELITE EVENT
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-3">
          <div className="bg-black/60 backdrop-blur-sm rounded-2xl shadow-xl border border-red-500/30 overflow-hidden hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">ELITE SCHEDULE</h2>
                  <p className="text-red-400 text-sm font-semibold">{getFilterTitle()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 text-sm border border-red-500/30 rounded-xl hover:bg-red-500/10 text-gray-300 hover:text-white transition-all duration-200 font-medium">
                    onClick={() => handleFilterChange('week')}
                    className={`px-4 py-2 text-sm rounded-xl transition-all duration-200 font-medium ${activeFilter === 'week' ? 'bg-gradient-to-r from-blue-500/30 to-blue-600/30 text-blue-400 border border-blue-500/40' : 'border border-red-500/30 hover:bg-red-500/10 text-gray-300 hover:text-white'}`}>
                  </button>
                    onClick={() => handleFilterChange('day')}
                    className={`px-4 py-2 text-sm rounded-xl transition-all duration-200 font-medium ${activeFilter === 'day' ? 'bg-gradient-to-r from-red-500/30 to-purple-500/30 text-red-400 border border-red-500/40 shadow-lg' : 'border border-red-500/30 hover:bg-red-500/10 text-gray-300 hover:text-white'}`}>
                    Day
                  </button>
                  <button className="px-4 py-2 text-sm border border-red-500/30 rounded-xl hover:bg-red-500/10 text-gray-300 hover:text-white transition-all duration-200 font-medium">
                    Month
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-500 rounded-full animate-spin animate-reverse"></div>
                  </div>
                  <span className="mt-4 text-white font-semibold text-lg">LOADING ELITE OPERATIONS...</span>
                  <span className="mt-1 text-gray-400 text-sm">Synchronizing tactical schedule</span>
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/40">
                    <span className="text-red-400 text-2xl font-bold">!</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">OPERATION FAILED</h3>
                  <p className="text-red-400 mb-6 font-medium">{error}</p>
                  <button 
                    onClick={() => handleFilterChange('month')}
                    className={`px-4 py-2 text-sm rounded-xl transition-all duration-200 font-medium ${activeFilter === 'month' ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-400 border border-purple-500/40' : 'border border-red-500/30 hover:bg-red-500/10 text-gray-300 hover:text-white'}`}>
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-200 font-semibold"
                  >
                    RETRY MISSION
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  {/* Timeline View */}
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {new Date().toLocaleDateString('en-US', { 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </h3>
                  </div>
                  
                  {timeSlots.map((slot) => {
                    const slotEvents = getEventsForTimeSlot(slot.hour24);
                    
                    return (
                      <div key={slot.time} className="flex items-start gap-4 min-h-[60px] border-b border-white/10 py-2">
                        {/* Time Label */}
                        <div className="w-20 text-right">
                          <span className="text-gray-400 text-sm font-medium">{slot.time}</span>
                        </div>
                        
                        {/* Events for this time slot */}
                        <div className="flex-1 space-y-2">
                          {slotEvents.map((event) => {
                            const endTime = calendarService.formatEventTime(event).split(' - ')[1] || '';
                            
                            return (
                              <div
                                key={event.id}
                                onClick={() => setSelectedEvent(event)}
                                className={`${getEventColor(event.subject)} rounded-xl p-4 cursor-pointer hover:opacity-90 transition-all duration-200 hover:scale-[1.02] shadow-lg`}
                              >
                                <div>
                                  <h4 className="text-white font-semibold text-sm mb-1">{event.subject}</h4>
                                  <p className="text-white/80 text-xs">
                                    {event.location?.displayName || 'Cal.com Video Call'}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <span className="text-white/90 text-xs font-medium">{endTime}</span>
                                </div>
                              </div>
                            );
                          })}
                          {/* Show all events that don't fit in specific time slots */}
                          {slot.hour24 === 9 && filteredEvents.filter(event => {
                            const eventStart = new Date(event.start.dateTime);
                            const eventHour = eventStart.getHours();
                            return eventHour < 9 || eventHour > 17;
                          }).map((event) => {
                            const endTime = calendarService.formatEventTime(event).split(' - ')[1] || '';
                            
                            return (
                              <div
                                key={event.id}
                                onClick={() => setSelectedEvent(event)}
                                className={`${getEventColor(event.subject)} rounded-xl p-4 cursor-pointer hover:opacity-90 transition-all duration-200 hover:scale-[1.02] shadow-lg flex items-center justify-between`}
                              >
                                <div>
                                  <h4 className="text-white font-semibold text-sm mb-1">{event.subject}</h4>
                                  <p className="text-white/80 text-xs">
                                    {event.location?.displayName || 'Cal.com Video Call'}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <span className="text-white/90 text-xs font-medium">{endTime}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Events Sidebar */}
        <div className="space-y-6">
          <div className="bg-black/60 backdrop-blur-sm rounded-2xl shadow-xl border border-red-500/30 overflow-hidden hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-red-500/30 to-purple-500/30 rounded-xl border border-red-500/40">
                  <CalendarIcon className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">MISSION QUEUE</h3>
                  <p className="text-xs text-gray-400 font-medium">Upcoming operations</p>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-10 h-10 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mb-3"></div>
                  <p className="text-gray-400 text-sm font-medium">Loading missions...</p>
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/40">
                    <span className="text-green-400 text-xl font-bold">✓</span>
                  </div>
                  <p className="text-gray-300 font-medium">All clear</p>
                  <p className="text-xs text-gray-500 mt-1">No pending operations</p>
                </div>
              ) : (
                filteredEvents.slice(0, 6).map((event) => (
                  <div key={event.id} className="group p-4 rounded-xl border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all duration-200 cursor-pointer hover:scale-[1.02]">
                    <div className="flex items-start gap-3">
                      <div className={`w-4 h-4 ${calendarService.getEventTypeColor(event.subject)} rounded-full mt-1 flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`} />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white text-sm mb-2 group-hover:text-red-400 transition-colors">{event.subject}</h4>
                        <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                          <Clock size={10} className="text-red-400" />
                          <span className="font-medium">{calendarService.formatEventTime(event)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                          <MapPin size={10} className="text-purple-400" />
                          <span className="font-medium">{event.location?.displayName || 'Digital Battlefield'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                          <Users size={10} className="text-blue-400" />
                          <span className="font-medium">{event.organizer.emailAddress.name}</span>
                        </div>
                        {event.bodyPreview && (
                          <p className="text-xs text-gray-500 mt-2 line-clamp-2 bg-white/5 p-2 rounded-lg">{event.bodyPreview.substring(0, 80)}...</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Calendar Stats */}
          <div className="bg-black/60 backdrop-blur-sm rounded-2xl shadow-xl border border-red-500/30 overflow-hidden hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500/30 to-indigo-500/30 rounded-xl border border-blue-500/40">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">BATTLE STATS</h3>
                  <p className="text-xs text-gray-400 font-medium">Mission analytics</p>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm font-medium">Total Missions</span>
                </div>
                <span className="text-white font-bold text-lg">{filteredEvents.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-gray-300 text-sm font-medium">Today's Ops</span>
                </div>
                <span className="text-white font-bold text-lg">
                  {filteredEvents.filter(event => calendarService.formatEventDate(event) === 'Today').length}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm font-medium">This Week</span>
                </div>
                <span className="text-white font-bold text-lg">{filteredEvents.length}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-black/60 backdrop-blur-sm rounded-2xl shadow-xl border border-red-500/30 overflow-hidden hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-orange-500/30 to-red-500/30 rounded-xl border border-orange-500/40">
                  <Zap className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">QUICK STRIKE</h3>
                  <p className="text-xs text-gray-400 font-medium">Rapid deployment</p>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <button 
                onClick={() => window.open('https://outlook.office365.com/calendar', '_blank')}
                className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 text-left text-gray-300 border border-transparent hover:border-red-500/30 group"
              >
                <div className="p-2 bg-white/10 rounded-lg group-hover:bg-red-500/20 transition-colors">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <span className="font-semibold">OUTLOOK COMMAND</span>
              </button>
              <button className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-blue-500/10 hover:text-blue-400 transition-all duration-200 text-left text-gray-300 border border-transparent hover:border-blue-500/30 group">
                <div className="p-2 bg-white/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                  <Video className="w-4 h-4" />
                </div>
                <span className="font-semibold">ELITE BRIEFING</span>
              </button>
              <button className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-purple-500/10 hover:text-purple-400 transition-all duration-200 text-left text-gray-300 border border-transparent hover:border-purple-500/30 group">
                <div className="p-2 bg-white/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                  <Users className="w-4 h-4" />
                </div>
                <span className="font-semibold">SQUAD ASSEMBLY</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black/90 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">MISSION DETAILS</h2>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Event Title */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">{selectedEvent.subject}</h3>
                <div className={`inline-block px-3 py-1 rounded-full text-white text-sm font-medium ${getEventColor(selectedEvent.subject)}`}>
                  Elite Operation
                </div>
              </div>
              
              {/* Time & Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-red-400" />
                    <span className="text-gray-300 font-medium">Time</span>
                  </div>
                  <p className="text-white font-semibold">{calendarService.formatEventTime(selectedEvent)}</p>
                  <p className="text-gray-400 text-sm">{calendarService.formatEventDate(selectedEvent)}</p>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-purple-400" />
                    <span className="text-gray-300 font-medium">Location</span>
                  </div>
                  <p className="text-white font-semibold break-all overflow-wrap-anywhere">{selectedEvent.location?.displayName || 'Digital Battlefield'}</p>
                </div>
              </div>
              
              {/* Organizer */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-300 font-medium">Organizer</span>
                </div>
                <p className="text-white font-semibold">{selectedEvent.organizer.emailAddress.name}</p>
                <p className="text-gray-400 text-sm">{selectedEvent.organizer.emailAddress.address}</p>
              </div>
              
              {/* Description */}
              {selectedEvent.bodyPreview && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h4 className="text-gray-300 font-medium mb-2">Mission Brief</h4>
                  <p className="text-white leading-relaxed break-words overflow-wrap-anywhere">{selectedEvent.bodyPreview}</p>
                </div>
              )}
              
              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => window.open(selectedEvent.webLink, '_blank')}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-200 font-semibold"
                >
                  <Video size={16} />
                  OPEN IN OUTLOOK
                </button>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-6 py-3 border border-red-500/30 rounded-xl hover:bg-red-500/10 transition-colors text-gray-300 hover:text-white font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onEventCreated={handleEventCreated}
      />
    </div>
  );
};

export default Calendar;