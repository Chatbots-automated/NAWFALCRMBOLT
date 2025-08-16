import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Users, FileText, Save, AlertCircle } from 'lucide-react';
import { eventService, CreateEventRequest } from '../services/eventService';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: () => void;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose, onEventCreated }) => {
  const [formData, setFormData] = useState({
    subject: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: '',
    description: '',
    attendees: '',
    isAllDay: false
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  // Generate time options (every 15 minutes)
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        const ampm = hour < 12 ? 'AM' : 'PM';
        const time12 = `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
        times.push({ value: time24, label: time12 });
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  // Generate calendar dates (current month + next month)
  const generateCalendarDates = () => {
    const dates = [];
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      if (date >= today || date.toDateString() === today.toDateString()) {
        dates.push(date);
      }
    }
    
    // Next month
    const nextMonth = currentMonth + 1;
    const nextYear = nextMonth > 11 ? currentYear + 1 : currentYear;
    const actualNextMonth = nextMonth > 11 ? 0 : nextMonth;
    const daysInNextMonth = new Date(nextYear, actualNextMonth + 1, 0).getDate();
    for (let day = 1; day <= daysInNextMonth; day++) {
      const date = new Date(nextYear, actualNextMonth, day);
      dates.push(date);
    }
    
    return dates;
  };

  const calendarDates = generateCalendarDates();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      // Combine date and time for start and end
      const startDateTimeString = formData.isAllDay 
        ? `${formData.startDate}T00:00:00`
        : `${formData.startDate}T${formData.startTime}:00`;
      
      const endDateTimeString = formData.isAllDay
        ? `${formData.endDate || formData.startDate}T23:59:59`
        : `${formData.endDate || formData.startDate}T${formData.endTime}:00`;

      const eventData: CreateEventRequest = {
        subject: formData.subject,
        start: {
          dateTime: startDateTimeString,
          timeZone: 'America/New_York'
        },
        end: {
          dateTime: endDateTimeString,
          timeZone: 'America/New_York'
        },
        location: formData.location || undefined,
        description: formData.description || undefined,
        attendees: formData.attendees ? formData.attendees.split(',').map(email => email.trim()) : undefined,
        isAllDay: formData.isAllDay,
        allowNewTimeProposals: true,
        isOnlineMeeting: true,
        onlineMeetingProvider: 'teamsForBusiness'
      };

      // Validate the data
      const validationErrors = eventService.validateEventData(eventData);
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        setLoading(false);
        return;
      }

      const result = await eventService.createEvent(eventData);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onEventCreated();
          onClose();
          resetForm();
        }, 1500);
      } else {
        setErrors([result.error || 'Failed to create event']);
      }
    } catch (error) {
      setErrors(['An unexpected error occurred']);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      subject: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      location: '',
      description: '',
      attendees: '',
      isAllDay: false
    });
    setErrors([]);
    setSuccess(false);
    setShowStartDatePicker(false);
    setShowEndDatePicker(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  // Set default dates to today
  const today = new Date().toISOString().split('T')[0];
  const currentTime = new Date().toTimeString().slice(0, 5);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black/90 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">CREATE ELITE EVENT</h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/40 rounded-xl">
            <p className="text-green-400 font-semibold">✅ Elite event created successfully!</p>
          </div>
        )}

        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-semibold">Please fix the following errors:</span>
            </div>
            <ul className="list-disc list-inside text-red-300 text-sm space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Event Title *
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-red-500/30 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-black/30 text-white placeholder-gray-500"
              placeholder="Enter elite event title..."
              required
            />
          </div>

          {/* All Day Toggle */}
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isAllDay"
                checked={formData.isAllDay}
                onChange={handleInputChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
            <span className="text-gray-300 font-medium">All Day Event</span>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                Start Date *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="startDate"
                  value={formData.startDate || today}
                  onClick={() => setShowStartDatePicker(!showStartDatePicker)}
                  readOnly
                  className="w-full px-4 py-3 border border-red-500/30 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-black/30 text-white cursor-pointer"
                  placeholder="Select start date..."
                  required
                />
                {showStartDatePicker && (
                  <div className="absolute top-full left-0 mt-2 bg-black/90 backdrop-blur-xl border border-red-500/30 rounded-xl p-4 shadow-2xl z-50 min-w-[300px]">
                    <div className="grid grid-cols-7 gap-2 mb-4">
                      <div className="text-center text-xs font-medium text-gray-400 py-2">Sun</div>
                      <div className="text-center text-xs font-medium text-gray-400 py-2">Mon</div>
                      <div className="text-center text-xs font-medium text-gray-400 py-2">Tue</div>
                      <div className="text-center text-xs font-medium text-gray-400 py-2">Wed</div>
                      <div className="text-center text-xs font-medium text-gray-400 py-2">Thu</div>
                      <div className="text-center text-xs font-medium text-gray-400 py-2">Fri</div>
                      <div className="text-center text-xs font-medium text-gray-400 py-2">Sat</div>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {calendarDates.slice(0, 42).map((date, index) => {
                        const dateStr = date.toISOString().split('T')[0];
                        const isSelected = formData.startDate === dateStr;
                        const isToday = dateStr === today;
                        
                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, startDate: dateStr }));
                              setShowStartDatePicker(false);
                            }}
                            className={`p-2 text-sm rounded-lg transition-all ${
                              isSelected
                                ? 'bg-red-500 text-white font-bold'
                                : isToday
                                ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                                : 'text-gray-300 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            {date.getDate()}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {!formData.isAllDay && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Start Time *</label>
                <select
                  name="startTime"
                  value={formData.startTime || currentTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-red-500/30 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-black/30 text-white"
                  required
                >
                  {timeOptions.map((time) => (
                    <option key={time.value} value={time.value} className="bg-black text-white">
                      {time.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
              <div className="relative">
                <input
                  type="text"
                  name="endDate"
                  value={formData.endDate || formData.startDate || today}
                  onClick={() => setShowEndDatePicker(!showEndDatePicker)}
                  readOnly
                  className="w-full px-4 py-3 border border-red-500/30 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-black/30 text-white cursor-pointer"
                  placeholder="Select end date..."
                />
                {showEndDatePicker && (
                  <div className="absolute top-full left-0 mt-2 bg-black/90 backdrop-blur-xl border border-red-500/30 rounded-xl p-4 shadow-2xl z-50 min-w-[300px]">
                    <div className="grid grid-cols-7 gap-2 mb-4">
                      <div className="text-center text-xs font-medium text-gray-400 py-2">Sun</div>
                      <div className="text-center text-xs font-medium text-gray-400 py-2">Mon</div>
                      <div className="text-center text-xs font-medium text-gray-400 py-2">Tue</div>
                      <div className="text-center text-xs font-medium text-gray-400 py-2">Wed</div>
                      <div className="text-center text-xs font-medium text-gray-400 py-2">Thu</div>
                      <div className="text-center text-xs font-medium text-gray-400 py-2">Fri</div>
                      <div className="text-center text-xs font-medium text-gray-400 py-2">Sat</div>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {calendarDates.slice(0, 42).map((date, index) => {
                        const dateStr = date.toISOString().split('T')[0];
                        const isSelected = (formData.endDate || formData.startDate) === dateStr;
                        const isToday = dateStr === today;
                        
                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, endDate: dateStr }));
                              setShowEndDatePicker(false);
                            }}
                            className={`p-2 text-sm rounded-lg transition-all ${
                              isSelected
                                ? 'bg-red-500 text-white font-bold'
                                : isToday
                                ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                                : 'text-gray-300 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            {date.getDate()}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {!formData.isAllDay && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">End Time *</label>
                <select
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-red-500/30 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-black/30 text-white"
                  required
                >
                  <option value="" className="bg-black text-white">Select end time...</option>
                  {timeOptions.map((time) => (
                    <option key={time.value} value={time.value} className="bg-black text-white">
                      {time.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-red-500/30 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-black/30 text-white placeholder-gray-500"
              placeholder="Enter location or meeting link..."
            />
          </div>

          {/* Attendees */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Users className="w-4 h-4 inline mr-2" />
              Attendees
            </label>
            <input
              type="text"
              name="attendees"
              value={formData.attendees}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-red-500/30 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-black/30 text-white placeholder-gray-500"
              placeholder="Enter email addresses separated by commas..."
            />
            <p className="text-xs text-gray-400 mt-1">Separate multiple emails with commas</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-red-500/30 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-black/30 text-white placeholder-gray-500 resize-none"
              placeholder="Enter event description..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 border border-red-500/30 rounded-xl hover:bg-red-500/10 transition-colors text-gray-300 hover:text-white font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  CREATING...
                </>
              ) : (
                <>
                  <Save size={16} />
                  CREATE ELITE EVENT
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;