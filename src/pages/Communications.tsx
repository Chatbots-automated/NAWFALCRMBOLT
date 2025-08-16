import React, { useState, useEffect } from 'react';
import { Mail, MessageSquare, Phone, Send, Plus, Search, Filter, Video, Users, CheckCircle, MessageCircle, X, Eye, Download } from 'lucide-react';
import { clientService } from '../services/clientService';
import { Client } from '../lib/supabase';
import CallTextActions from '../components/CallTextActions';

const Communications: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'compose' | 'templates'>('compose');
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [showEmailDropdown, setShowEmailDropdown] = useState(false);
  const [emailSearchQuery, setEmailSearchQuery] = useState('');
  const [emailSelectedClients, setEmailSelectedClients] = useState<string[]>([]);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [templateVars, setTemplateVars] = useState({
    SUBJECT_LINE: 'Elite Coaching Opportunity',
    EMAIL_BODY: 'Hi {name}, I wanted to reach out about your elite transformation journey.\n\nAre you ready to take your leadership and performance to the next level?\n\nI help elite entrepreneurs and leaders break through their limitations and achieve extraordinary results.',
    CALL_TO_ACTION: 'START YOUR TRANSFORMATION',
    URL: 'https://filaligroup.com',
    FOOTER_LINKS: 'filaligroup.com',
    MANAGE_PREFERENCES_URL: 'filaligroup.com',
    UNSUBSCRIBE_URL: 'filaligroup.com'
  });
  const [showEmailPreview, setShowEmailPreview] = useState(false);

  // Convert plain text to HTML
  const convertTextToHtml = (text: string): string => {
    return text
      .split('\n\n') // Split by double newlines for paragraphs
      .map(paragraph => paragraph.trim())
      .filter(paragraph => paragraph.length > 0)
      .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
      .join('');
  };

  // Generate full email HTML
  const generateEmailHtml = (): string => {
    const htmlBody = convertTextToHtml(templateVars.EMAIL_BODY);
    
    return `<!doctype html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <title>${templateVars.SUBJECT_LINE}</title>
  <style>
    /* Resets */
    body,table,td,a{ -webkit-text-size-adjust:100%; -ms-text-size-adjust:100% }
    table,td{ mso-table-lspace:0pt; mso-table-rspace:0pt }
    img{ -ms-interpolation-mode:bicubic; border:0; outline:none; text-decoration:none; display:block }
    body{ margin:0; padding:0; width:100%!important; height:100%!important; background:#0b0d12 }
    /* Layout */
    .wrap{ width:100%; max-width:640px; margin:0 auto }
    .card{ background:#141922; border:1px solid #2b3341; border-radius:16px; overflow:hidden }
    .pad-20{ padding:20px } .pad-28{ padding:28px } .pad-32{ padding:32px }
    .center{ text-align:center }
    .muted{ color:#9aa3b2 }
    /* Color accents (solid red) */
    .band{ height:10px; line-height:10px; background:#e53935; }
    .accent{ height:3px; line-height:3px; background:#e53935; }
    /* Type */
    .h1{ color:#ffffff; font-weight:900; font-size:30px; line-height:1.2; margin:0 0 12px }
    .note{ background:#1a1f2e; border:1px solid #3a4553; border-radius:14px }
    .note p{ color:#f0f2f5; font-size:16px; line-height:1.7; margin:0 0 12px }
    /* Button */
    .btn a{
      display:inline-block; background:#e53935; color:#fff!important; font-weight:900;
      padding:14px 24px; border-radius:12px; text-decoration:none;
      box-shadow:0 8px 24px rgba(229,57,53,0.35);
    }
    @media only screen and (max-width:600px){
      .pad-32{ padding:20px !important }
      .h1{ font-size:24px !important }
      .btn a{ width:100% !important; text-align:center !important }
    }
  </style>
  <!--[if mso]><style>.btn a{padding:0!important}</style><![endif]-->
</head>
<body>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" class="pad-20">
        <table role="presentation" class="wrap" cellspacing="0" cellpadding="0">
          <tr><td style="height:8px;line-height:8px">&nbsp;</td></tr>

          <tr>
            <td class="card">
              <!-- Solid band -->
              <div class="band"></div>

              <!-- Header -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td class="pad-28 center">
                    <img src="https://i.imgur.com/F2oLMY3.png" alt="FILALI" width="140" style="margin:0 auto 8px">
                  </td>
                </tr>
                <tr><td class="accent"></td></tr>

                <!-- Title + Body -->
                <tr>
                  <td class="pad-32">
                    <h1 class="h1 center">${templateVars.SUBJECT_LINE}</h1>

                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="note">
                      <tr>
                        <td class="pad-20">
                          ${htmlBody}
                        </td>
                      </tr>
                    </table>

                    <div style="height:22px;line-height:22px">&nbsp;</div>

                    <!-- CTA -->
                    <table role="presentation" align="center" cellspacing="0" cellpadding="0">
                      <tr>
                        <td class="btn" align="center" bgcolor="#e53935" style="border-radius:12px">
                          <!--[if mso]>
                          <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${templateVars.URL}"
                            arcsize="14%" strokecolor="#e53935" fillcolor="#e53935"
                            style="height:46px;v-text-anchor:middle;width:270px;">
                            <w:anchorlock/>
                            <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:16px;font-weight:900;">
                              ${templateVars.CALL_TO_ACTION}
                            </center>
                          </v:roundrect>
                          <![endif]-->
                          <!--[if !mso]><!-- -->
                          <a href="${templateVars.URL}" target="_blank">${templateVars.CALL_TO_ACTION}</a>
                          <!--<![endif]-->
                        </td>
                      </tr>
                    </table>

                    <!-- Signature -->
                    <div style="height:26px;line-height:26px">&nbsp;</div>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr><td>
                        <img src="https://i.imgur.com/98vo3P6.png" alt="Signature" width="200" style="opacity:.98">
                      </td></tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td class="pad-28">
                    <table role="presentation" width="100%">
                      <tr>
                        <td class="muted" style="font-size:12px; line-height:1.6">
                          ${templateVars.FOOTER_LINKS}<br>
                          <a href="${templateVars.MANAGE_PREFERENCES_URL}" style="color:#9aa3b2;text-decoration:underline">Manage preferences</a>
                          &nbsp;&middot;&nbsp;
                          <a href="${templateVars.UNSUBSCRIBE_URL}" style="color:#9aa3b2;text-decoration:underline">Unsubscribe</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <tr><td style="height:28px;line-height:28px">&nbsp;</td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  };

  // Filter clients for email dropdown
  const filteredEmailClients = clients.filter(client => 
    client.full_name.toLowerCase().includes(emailSearchQuery.toLowerCase()) ||
    (client.email && client.email.toLowerCase().includes(emailSearchQuery.toLowerCase())) ||
    (client.company && client.company.toLowerCase().includes(emailSearchQuery.toLowerCase()))
  );

  const handleEmailClientSelect = (clientId: string) => {
    setEmailSelectedClients(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleEmailSelectAll = () => {
    if (emailSelectedClients.length === filteredEmailClients.length) {
      setEmailSelectedClients([]);
    } else {
      setEmailSelectedClients(filteredEmailClients.map(c => c.id));
    }
  };

  const handleSendEmails = () => {
    sendMassEmail();
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data } = await clientService.getClients({
        limit: 100
      });
      setClients(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch clients:', err);
      setError('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const handleActionLog = async (clientId: string, type: 'call' | 'text' | 'facetime' | 'email', meta: any = {}) => {
    try {
      const client = clients.find(c => c.id === clientId);
      if (!client) return;
      
      const actionMessages = {
        call: `Phone call initiated to ${meta.phone}`,
        text: `SMS sent to ${meta.phone}: "${meta.body}"`,
        facetime: `FaceTime call initiated to ${meta.phone}`,
        email: `Email sent to ${meta.email}`
      };
      
      await clientService.addNote(clientId, actionMessages[type], 'System');
      
      // Refresh clients to show the new activity
      fetchClients();
    } catch (err) {
      console.error('Failed to log activity:', err);
    }
  };

  const handleMassEmail = () => {
    if (emailSelectedClients.length === 0) {
      alert('Please select clients from the dropdown to send mass email');
      return;
    }
    
    sendMassEmail();
  };

  const sendMassEmail = async () => {
    try {
      const selectedClientData = clients.filter(c => emailSelectedClients.includes(c.id));
      
      // Create array of email items in single payload
      const emailItems = selectedClientData.map(client => ({
        template_vars: {
          ...templateVars,
          EMAIL_BODY: convertTextToHtml(templateVars.EMAIL_BODY),
          SUBJECT_LINE: templateVars.SUBJECT_LINE,
          CALL_TO_ACTION: templateVars.CALL_TO_ACTION,
          URL: templateVars.URL,
          FOOTER_LINKS: templateVars.FOOTER_LINKS,
          MANAGE_PREFERENCES_URL: templateVars.MANAGE_PREFERENCES_URL,
          UNSUBSCRIBE_URL: templateVars.UNSUBSCRIBE_URL
        },
        client: {
          id: client.id,
          name: client.full_name,
          email: client.email,
          company: client.company
        },
        body: generateEmailHtml().replace(/{{SUBJECT_LINE}}/g, templateVars.SUBJECT_LINE)
                                 .replace(/{{EMAIL_BODY}}/g, convertTextToHtml(templateVars.EMAIL_BODY))
                                 .replace(/{{CALL_TO_ACTION}}/g, templateVars.CALL_TO_ACTION)
                                 .replace(/{{URL}}/g, templateVars.URL)
                                 .replace(/{{FOOTER_LINKS}}/g, templateVars.FOOTER_LINKS)
                                 .replace(/{{MANAGE_PREFERENCES_URL}}/g, templateVars.MANAGE_PREFERENCES_URL)
                                 .replace(/{{UNSUBSCRIBE_URL}}/g, templateVars.UNSUBSCRIBE_URL)
      }));

      // Send all emails as array in single payload
      const response = await fetch('https://n8n-up8s.onrender.com/webhook/665443ff-5859-4d7b-a3a5-1f700df5965d', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emails: emailItems })
      });

      if (!response.ok) {
        throw new Error(`Failed to send mass email`);
      }
      
      alert(`Mass email sent successfully to ${selectedClientData.length} clients!`);
      
      // Log the mass email activity for each client
      selectedClientData.forEach(client => {
        if (client.email) {
          handleActionLog(client.id, 'email', { email: client.email });
        }
      });
      
      // Close dropdown and reset
      setShowEmailDropdown(false);
      setEmailSelectedClients([]);
      setEmailSearchQuery('');
    } catch (error) {
      console.error('Error sending mass email:', error);
      alert(`Failed to send some emails: ${error.message}. Please try again.`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'lead': return 'bg-blue-500/20 text-blue-400 border-blue-500/40'
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/40'
      case 'inactive': return 'bg-gray-500/20 text-gray-400 border-gray-500/40'
      case 'lost': return 'bg-red-500/20 text-red-400 border-red-500/40'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/40'
    }
  };

  const tabs = [
    { id: 'compose' as const, label: 'Compose', icon: Send },
    { id: 'templates' as const, label: 'Templates', icon: MessageSquare }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            FILALI COMMAND NETWORK
          </h1>
          <p className="text-gray-600 mt-1 font-semibold">TACTICAL COMMUNICATIONS. PRECISION STRIKES.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <Video size={16} />
            Video Call
          </button>
          <div className="relative">
            <button 
              onClick={() => setShowEmailDropdown(!showEmailDropdown)}
              className="flex items-center gap-2 px-8 py-4 rounded-xl transition-all duration-200 font-bold text-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg hover:shadow-red-500/25 border-2 border-red-400"
            >
              <Mail size={20} />
              ELITE EMAIL BLAST ({emailSelectedClients.length})
            </button>
            
            {showEmailDropdown && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-black/95 backdrop-blur-xl border border-red-500/30 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                  {/* Header */}
                  <div className="p-6 border-b border-white/10 bg-gradient-to-r from-red-500/10 to-purple-500/10">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">ELITE EMAIL DEPLOYMENT</h3>
                        <p className="text-gray-400 text-sm font-medium">Select your targets for mass communication</p>
                      </div>
                      <button
                        onClick={() => setShowEmailDropdown(false)}
                        className="p-3 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200 hover:rotate-90"
                      >
                        <X size={24} />
                      </button>
                    </div>
                    
                    {/* Search Bar */}
                    <div className="relative mb-4">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="Search elite clients by name, email, or company..."
                        value={emailSearchQuery}
                        onChange={(e) => setEmailSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-black/40 border border-red-500/30 rounded-xl focus:ring-2 focus:ring-red-500 text-white placeholder-gray-400 text-lg"
                      />
                    </div>
                    
                    {/* Stats and Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-white">{filteredEmailClients.length}</p>
                          <p className="text-xs text-gray-400 font-medium">Available</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-red-400">{emailSelectedClients.length}</p>
                          <p className="text-xs text-gray-400 font-medium">Selected</p>
                        </div>
                      </div>
                      <button
                        onClick={handleEmailSelectAll}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/40 rounded-xl hover:bg-purple-500/30 transition-all duration-200 text-purple-300 hover:text-purple-200 font-semibold"
                      >
                        {emailSelectedClients.length === filteredEmailClients.length ? 'DESELECT ALL' : 'SELECT ALL'}
                      </button>
                    </div>
                  </div>
                  
                  {/* Email Template Configuration */}
                  <div className="p-6 border-b border-white/10 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/40">
                        <Mail className="w-5 h-5 text-blue-400" />
                      </div>
                      <h4 className="text-lg font-bold text-white">EMAIL TEMPLATE CONFIGURATION</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Left Column */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Subject Line</label>
                          <input
                            type="text"
                            value={templateVars.SUBJECT_LINE}
                            onChange={(e) => setTemplateVars(prev => ({ ...prev, SUBJECT_LINE: e.target.value }))}
                            className="w-full px-4 py-3 border border-red-500/30 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-black/30 text-white text-sm"
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Call to Action</label>
                            <input
                              type="text"
                              value={templateVars.CALL_TO_ACTION}
                              onChange={(e) => setTemplateVars(prev => ({ ...prev, CALL_TO_ACTION: e.target.value }))}
                              className="w-full px-4 py-3 border border-red-500/30 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-black/30 text-white text-sm"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Button URL</label>
                            <input
                              type="url"
                              value={templateVars.URL}
                              onChange={(e) => setTemplateVars(prev => ({ ...prev, URL: e.target.value }))}
                              className="w-full px-4 py-3 border border-red-500/30 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-black/30 text-white text-sm"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Right Column */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email Message</label>
                        <textarea
                          rows={6}
                          value={templateVars.EMAIL_BODY}
                          onChange={(e) => setTemplateVars(prev => ({ ...prev, EMAIL_BODY: e.target.value }))}
                          placeholder="Hi {name}, I wanted to reach out about your elite transformation journey.&#10;&#10;Are you ready to take your leadership to the next level?&#10;&#10;Let's discuss how I can help you achieve extraordinary results."
                          className="w-full px-4 py-3 border border-red-500/30 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none bg-black/30 text-white placeholder-gray-500 text-sm leading-relaxed"
                        />
                        <p className="text-xs text-gray-400 mt-2">Write in plain text. Use {name} for personalization. Double line breaks create new paragraphs.</p>
                      </div>
                    </div>
                    
                    {/* Footer Settings */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Footer Links</label>
                        <input
                          type="text"
                          value={templateVars.FOOTER_LINKS}
                          onChange={(e) => setTemplateVars(prev => ({ ...prev, FOOTER_LINKS: e.target.value }))}
                          className="w-full px-4 py-3 border border-red-500/30 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-black/30 text-white text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Manage Preferences URL</label>
                        <input
                          type="url"
                          value={templateVars.MANAGE_PREFERENCES_URL}
                          onChange={(e) => setTemplateVars(prev => ({ ...prev, MANAGE_PREFERENCES_URL: e.target.value }))}
                          className="w-full px-4 py-3 border border-red-500/30 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-black/30 text-white text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Unsubscribe URL</label>
                        <input
                          type="url"
                          value={templateVars.UNSUBSCRIBE_URL}
                          onChange={(e) => setTemplateVars(prev => ({ ...prev, UNSUBSCRIBE_URL: e.target.value }))}
                          className="w-full px-4 py-3 border border-red-500/30 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-black/30 text-white text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Client Selection Grid */}
                  <div className="overflow-y-auto max-h-[50vh]">
                    {loading ? (
                      <div className="flex items-center justify-center py-16">
                        <div className="relative">
                          <div className="w-12 h-12 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
                          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-purple-500 rounded-full animate-spin animate-reverse"></div>
                        </div>
                        <span className="ml-4 text-white font-semibold">Loading elite clients...</span>
                      </div>
                    ) : filteredEmailClients.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-20 h-20 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-500/40">
                          <Users className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No Elite Clients Found</h3>
                        <p className="text-gray-400">Try adjusting your search criteria</p>
                      </div>
                    ) : (
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {filteredEmailClients.map((client) => (
                            <div 
                              key={client.id} 
                              className={`relative p-4 rounded-xl border transition-all duration-200 cursor-pointer hover:scale-[1.02] ${
                                emailSelectedClients.includes(client.id)
                                  ? 'bg-gradient-to-r from-red-500/20 to-purple-500/20 border-red-500/40 shadow-lg shadow-red-500/20'
                                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                              }`}
                              onClick={() => handleEmailClientSelect(client.id)}
                            >
                              {/* Selection Indicator */}
                              <div className="absolute top-3 right-3">
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                  emailSelectedClients.includes(client.id)
                                    ? 'bg-red-500 border-red-500 shadow-lg shadow-red-500/50'
                                    : 'border-gray-400 hover:border-red-400'
                                }`}>
                                  {emailSelectedClients.includes(client.id) && (
                                    <CheckCircle className="w-4 h-4 text-white" />
                                  )}
                                </div>
                              </div>
                              
                              {/* Client Info */}
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-red-500/30 to-purple-500/30 rounded-full flex items-center justify-center border border-red-500/40">
                                  <span className="text-sm font-bold text-white">
                                    {client.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-white text-sm truncate">{client.full_name}</h4>
                                  {client.company && (
                                    <p className="text-xs text-gray-400 truncate">{client.company}</p>
                                  )}
                                </div>
                              </div>
                              
                              {/* Contact Info */}
                              <div className="space-y-1">
                                {client.email && (
                                  <div className="flex items-center gap-2 text-xs text-gray-300">
                                    <Mail size={10} className="text-blue-400 flex-shrink-0" />
                                    <span className="truncate">{client.email}</span>
                                  </div>
                                )}
                                {client.phone && (
                                  <div className="flex items-center gap-2 text-xs text-gray-300">
                                    <Phone size={10} className="text-green-400 flex-shrink-0" />
                                    <span>{client.phone}</span>
                                  </div>
                                )}
                              </div>
                              
                              {/* Status Badge */}
                              <div className="mt-2">
                                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(client.status)}`}>
                                  {client.status.toUpperCase()}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
              
                  {/* Action Bar */}
                  {emailSelectedClients.length > 0 && (
                    <div className="sticky bottom-0 bg-black/90 backdrop-blur-xl border-t border-red-500/30 p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-white font-bold">{emailSelectedClients.length} ELITE TARGETS SELECTED</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setShowEmailPreview(true)}
                            className="flex items-center gap-2 px-6 py-3 border border-purple-500/30 rounded-xl hover:bg-purple-500/10 transition-colors text-purple-300 hover:text-purple-200 font-semibold"
                          >
                            <Eye size={16} />
                            PREVIEW MISSION
                          </button>
                          <button
                            onClick={handleSendEmails}
                            disabled={loading}
                            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-200 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loading ? (
                              <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                DEPLOYING...
                              </>
                            ) : (
                              <>
                                <Send size={16} />
                                DEPLOY ELITE EMAILS
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Email Preview Modal */}
      {showEmailPreview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black/90 backdrop-blur-xl border border-red-500/30 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white">EMAIL PREVIEW</h2>
              <button
                onClick={() => setShowEmailPreview(false)}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
                <iframe
                  srcDoc={generateEmailHtml()}
                  className="w-full h-[600px] border-0"
                  title="Email Preview"
                />
              </div>
              
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    const blob = new Blob([generateEmailHtml()], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'email-template.html';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-6 py-3 border border-green-500/30 rounded-xl hover:bg-green-500/10 transition-colors text-green-300 hover:text-green-200 font-medium"
                >
                  <Download size={16} className="inline mr-2" />
                  DOWNLOAD HTML
                </button>
                <button
                  onClick={() => setShowEmailPreview(false)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-200 font-semibold"
                >
                  CLOSE PREVIEW
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Clients List */}
      <div className="bg-black/60 backdrop-blur-sm rounded-2xl shadow-sm border border-red-500/20 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">ALL ELITE CLIENTS</h2>
          <p className="text-gray-400 text-sm mt-1">Your complete elite network</p>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
              <span className="ml-3 text-white font-medium">Loading elite clients...</span>
            </div>
          ) : clients.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-16 w-16 text-gray-500 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Elite Clients Found</h3>
              <p className="text-gray-400 mb-6">Start building your elite network by adding your first client</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clients.map((client) => (
                <div key={client.id} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500/30 to-purple-500/30 rounded-full flex items-center justify-center border border-red-500/40">
                      <span className="text-sm font-bold text-white">
                        {client.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white text-sm">{client.full_name}</h4>
                      {client.company && <p className="text-xs text-gray-400">{client.company}</p>}
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border mt-1 ${getStatusColor(client.status)}`}>
                        {client.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {client.email && (
                      <div className="flex items-center gap-2 text-xs text-gray-300">
                        <Mail size={12} className="text-blue-400" />
                        <span className="truncate">{client.email}</span>
                      </div>
                    )}
                    {client.phone && (
                      <div className="flex items-center gap-2 text-xs text-gray-300">
                        <Phone size={12} className="text-green-400" />
                        <span>{client.phone}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-white/10">
                    <CallTextActions
                      phoneE164={client.phone}
                      email={undefined}
                      clientName={client.full_name}
                      clientId={client.id}
                      onActionLog={handleActionLog}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
    </div>
  );
};

export default Communications;