import React from 'react';
import { Phone, MessageSquare, Video, Mail } from 'lucide-react';

interface CallTextActionsProps {
  phoneE164?: string;
  email?: string;
  clientName: string;
  clientId: string;
  onActionLog?: (clientId: string, type: 'call' | 'text' | 'facetime' | 'email', meta?: any) => void;
}

function encodeBody(s: string) {
  return encodeURIComponent(s).replace(/%20/g, '+'); // pretty spaces
}

const CallTextActions: React.FC<CallTextActionsProps> = ({ 
  phoneE164, 
  email, 
  clientName, 
  clientId, 
  onActionLog 
}) => {
  const phone = phoneE164?.replace(/[^\d+]/g, ''); // normalize
  const smsBody = `Hey ${clientName}, quick chat about your elite transformation?`;
  
  const telHref = phone ? `tel:${phone}` : '#';
  const smsHref = phone ? `sms:${phone}?&body=${encodeBody(smsBody)}` : '#';
  const facetimeHref = phone ? `facetime:${phone}` : email ? `facetime:${email}` : '#';
  const emailHref = email ? `mailto:${email}?subject=Elite Coaching Opportunity&body=Hi ${clientName},%0A%0AI wanted to reach out about your elite transformation journey...` : '#';

  const handleAction = (type: 'call' | 'text' | 'facetime' | 'email', meta: any = {}) => {
    if (onActionLog) {
      onActionLog(clientId, type, meta);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {phone && (
        <>
          <a
            href={telHref}
            onClick={() => handleAction('call', { phone })}
            className="flex items-center gap-1 px-3 py-2 text-sm bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors border border-green-500/40 font-medium"
            title="Call"
          >
            <Phone size={14} />
            Call
          </a>
          
          <a
            href={smsHref}
            onClick={() => handleAction('text', { phone, body: smsBody })}
            className="flex items-center gap-1 px-3 py-2 text-sm bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors border border-blue-500/40 font-medium"
            title="Send SMS"
          >
            <MessageSquare size={14} />
            SMS
          </a>
          
          <a
            href={facetimeHref}
            onClick={() => handleAction('facetime', { phone })}
            className="flex items-center gap-1 px-3 py-2 text-sm bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors border border-purple-500/40 font-medium"
            title="FaceTime"
          >
            <Video size={14} />
            FaceTime
          </a>
        </>
      )}
      
      {email && (
        <a
          href={emailHref}
          onClick={() => handleAction('email', { email })}
          className="flex items-center gap-1 px-3 py-2 text-sm bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-colors border border-orange-500/40 font-medium"
          title="Send Email"
        >
          <Mail size={14} />
          Email
        </a>
      )}
    </div>
  );
};

export default CallTextActions;