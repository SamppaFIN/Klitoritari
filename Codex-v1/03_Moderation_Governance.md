# 🛡️ Moderation & Governance
*The Sacred Blueprint for Revolutionary Anti-Censorship Discussion Platform*

## 📋 Document Information
**Version**: 1.0.0  
**Date**: 2025-09-30  
**Doc-ID**: SC-MODERATION-GOVERNANCE  
**Status**: Canonical

## 📝 ChangeLog
- 1.0.0 Initial codex import from chat (author: Infinite IRL)

---

## 🚨 Reporting System

### **Flag Types**
```sql
CREATE TYPE flag_reason AS ENUM (
    'spam', 'harassment', 'hate_speech', 'misinformation', 'inappropriate', 'other'
);
```

### **Flag Creation**
```typescript
// POST /api/comments/:id/flags
interface FlagRequest {
  reason: 'spam' | 'harassment' | 'hate_speech' | 'misinformation' | 'inappropriate' | 'other';
  text?: string; // Optional additional context
}
```

### **Flag Processing**
```sql
CREATE TABLE flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    reporter_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reason flag_reason NOT NULL,
    text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'upheld', 'dismissed', 'severe')),
    resolved_by UUID REFERENCES users(id),
    resolved_at TIMESTAMP WITH TIME ZONE
);
```

### **Rate Limiting & CAPTCHA**
- **Rate limits**: Per-user and per-IP limits for flagging
- **CAPTCHA triggers**: On abnormal spikes (new or low-rep accounts)
- **Throttling**: Over-reporter detection and throttling

---

## 👮 Protector Badge System

### **Protector Signal Calculation**
```typescript
interface ProtectorMetrics {
  upheldReports: number;
  totalReports: number;
  upheldRatio: number; // upheldReports / totalReports
  isProtector: boolean; // upheldRatio >= 0.7 && totalReports >= 10
}
```

### **Protector Benefits**
- **Limited moderation actions**: Can soft-hide comments
- **Priority in moderation queue**: Flags from protectors prioritized
- **Community recognition**: Protector badge displayed on profile
- **Enhanced reporting**: Additional flag reasons available

### **Protector Requirements**
- **Upheld ratio**: ≥70% of reports upheld
- **Minimum reports**: ≥10 reports submitted
- **Account age**: ≥30 days old
- **No violations**: No upheld reports against protector

---

## ⚖️ Anti-Abuse Systems

### **Legal Strikes Counter**
```sql
-- Add to profiles table
ALTER TABLE profiles ADD COLUMN legal_strikes INTEGER DEFAULT 0;
```

### **Strike Escalation**
- **Strike 1**: Warning notification
- **Strike 2**: Temporary restrictions (7 days)
- **Strike 3**: Extended restrictions (30 days)
- **Strike 4**: Account suspension (90 days)
- **Strike 5**: Permanent ban

### **Strike Triggers**
- **Severe violations**: Hate speech, harassment, illegal content
- **Repeat violations**: Multiple upheld reports
- **System abuse**: Attempting to game moderation systems
- **Spam behavior**: Automated or bulk posting

### **Appeal Process**
```sql
CREATE TABLE appeals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    strike_id UUID REFERENCES strikes(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    evidence TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🔍 Audit Logs & Transparency

### **Audit Log Schema**
```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    subject_type VARCHAR(50) NOT NULL,
    subject_id UUID NOT NULL,
    meta JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Audit Log Actions**
- **flag_created**: User created a flag
- **flag_resolved**: Moderator resolved a flag
- **comment_soft_hidden**: Comment was soft-hidden
- **comment_restored**: Comment was restored
- **user_strike**: User received a strike
- **user_appeal**: User submitted an appeal
- **appeal_resolved**: Appeal was resolved

### **Audit Log Metadata**
```typescript
interface AuditLogMeta {
  reason?: string;
  severity?: 'low' | 'medium' | 'high' | 'severe';
  previousStatus?: string;
  newStatus?: string;
  strikeLevel?: number;
  appealReason?: string;
}
```

### **Transparency Reports**
- **Quarterly reports**: Public transparency reports
- **Moderation statistics**: Number of flags, resolutions, appeals
- **Community health metrics**: User satisfaction, engagement
- **Policy updates**: Changes to moderation policies

---

## 🔒 Security Events & Case Logging

### **Security Events Schema**
```sql
CREATE TABLE security_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(50) NOT NULL,
    ts TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ip_hash VARCHAR(64), -- hashed IP address
    raw_ip INET, -- only for severe cases
    ua_family VARCHAR(100),
    meta JSONB DEFAULT '{}',
    case_id UUID -- only for severe cases
);
```

### **Event Types**
- **flag_spam**: Spam flagging detected
- **rate_limit_exceeded**: Rate limit exceeded
- **suspicious_activity**: Suspicious user behavior
- **severe_violation**: Severe content violation
- **security_breach**: Potential security breach
- **abuse_pattern**: Abuse pattern detected

### **IP Address Handling**
- **Hashed IP**: All events use hashed IP addresses
- **Raw IP**: Only stored for severe cases with case_id
- **Retention**: 90d hashed, 180d raw IP for severe cases
- **Access control**: Raw IP only accessible to admin users

### **Case Management**
```sql
CREATE TABLE security_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'severe')),
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
    assigned_to UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    notes TEXT
);
```

---

## 🎯 Soft-Hide Moderation

### **Soft-Hide Implementation**
```sql
-- Comments table already has visibility field
ALTER TABLE comments ADD COLUMN visibility VARCHAR(20) DEFAULT 'public' 
CHECK (visibility IN ('public', 'soft_hidden'));
```

### **Soft-Hide Rules**
- **Public visibility**: Default state for all comments
- **Soft-hidden**: Comment remains visible to owner and admin
- **Badge display**: Soft-hidden comments show badge to owner
- **Restoration**: Comments can be restored by moderators

### **Soft-Hide Permissions**
```sql
-- RLS for soft-hidden comments
CREATE POLICY "Comments soft-hidden owner view" ON comments FOR SELECT USING (
    visibility = 'public' OR 
    (visibility = 'soft_hidden' AND auth.uid() = user_id) OR
    (visibility = 'soft_hidden' AND EXISTS (
        SELECT 1 FROM profiles WHERE user_id = auth.uid() AND supporter = true
    ))
);
```

### **Soft-Hide API**
```typescript
// PATCH /api/comments/:id
interface CommentUpdateRequest {
  visibility: 'public' | 'soft_hidden';
}

// Response
interface CommentUpdateResponse {
  success: boolean;
  comment: {
    id: string;
    visibility: 'public' | 'soft_hidden';
    badge?: 'soft_hidden'; // Only for owner
  };
}
```

---

## 🚨 Severe Case Handling

### **Severe Case Triggers**
- **Hate speech**: Targeted harassment or discrimination
- **Illegal content**: Content that violates laws
- **Doxxing**: Sharing private personal information
- **Threats**: Direct threats of violence
- **Child safety**: Content involving minors

### **Severe Case Process**
1. **Automatic flagging**: System detects severe content
2. **Immediate soft-hide**: Content hidden pending review
3. **Case creation**: Security case created with raw IP
4. **Admin notification**: Admins notified immediately
5. **Investigation**: Thorough investigation conducted
6. **Resolution**: Appropriate action taken

### **Severe Case Logging**
```typescript
// When severe case is created
const createSevereCase = async (commentId: string, reason: string) => {
  // Create security case
  const caseId = await createSecurityCase({
    caseType: 'severe_content',
    severity: 'severe',
    reason
  });
  
  // Log security event with raw IP
  await logSecurityEvent({
    eventType: 'severe_violation',
    subjectType: 'comment',
    subjectId: commentId,
    caseId,
    rawIp: true // Store raw IP for severe cases
  });
  
  // Soft-hide comment
  await softHideComment(commentId);
};
```

---

## 📊 Moderation Queue & Admin Dashboard

### **Moderation Queue API**
```typescript
// GET /api/mod/queue
interface ModerationQueueResponse {
  flags: Array<{
    id: string;
    commentId: string;
    reporterId: string;
    reason: string;
    text?: string;
    createdAt: string;
    comment: {
      id: string;
      body: string;
      author: string;
      createdAt: string;
    };
    reporter: {
      id: string;
      username: string;
      isProtector: boolean;
    };
  }>;
  total: number;
  page: number;
  limit: number;
}
```

### **Queue Filters**
- **Status**: open, upheld, dismissed, severe
- **Reason**: spam, harassment, hate_speech, etc.
- **Protector flags**: Flags from protector users
- **Severity**: low, medium, high, severe
- **Date range**: Filter by creation date

### **Resolution API**
```typescript
// POST /api/mod/flags/:id/resolve
interface FlagResolutionRequest {
  status: 'upheld' | 'dismissed' | 'severe';
  notes?: string;
  severe?: boolean; // If true, creates security case
}

// Response
interface FlagResolutionResponse {
  success: boolean;
  flag: {
    id: string;
    status: string;
    resolvedAt: string;
    resolvedBy: string;
  };
  caseId?: string; // If severe case created
}
```

---

## 🔧 Admin Console Features

### **Admin Dashboard**
- **Flags queue**: List of pending flags
- **Resolution tools**: Resolve flags with notes
- **Soft-hide toggle**: Toggle comment visibility
- **Case management**: Create and manage security cases
- **User management**: View user profiles and strikes
- **Analytics**: Moderation statistics and trends

### **Admin Permissions**
```sql
-- Admin role check
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = $1 AND supporter = true
  );
END;
$$ LANGUAGE plpgsql;
```

### **Admin Actions**
- **Resolve flags**: Approve or dismiss flags
- **Soft-hide comments**: Hide comments from public view
- **Create cases**: Create security cases for severe violations
- **View audit logs**: Access all audit log entries
- **Manage users**: View user profiles and moderation history

---

## 📈 Moderation Analytics

### **Key Metrics**
- **Flag volume**: Number of flags per day/week/month
- **Resolution time**: Average time to resolve flags
- **Protector effectiveness**: Flags from protector users
- **Appeal rate**: Percentage of strikes appealed
- **Community health**: User satisfaction with moderation

### **Reporting Dashboard**
- **Real-time metrics**: Current moderation queue status
- **Trend analysis**: Moderation trends over time
- **Protector performance**: Protector user effectiveness
- **Policy impact**: Impact of policy changes

### **Transparency Reports**
- **Quarterly reports**: Public transparency reports
- **Moderation statistics**: Public moderation data
- **Policy updates**: Changes to moderation policies
- **Community feedback**: User feedback on moderation

---

## 🎯 Moderation Principles

### **Community-Driven**
- **User participation**: Users participate in moderation decisions
- **Protector system**: Trusted users help moderate
- **Transparency**: All moderation actions are logged
- **Appeals**: Users can appeal moderation decisions

### **Proportional Response**
- **Graduated sanctions**: Escalating responses to violations
- **Soft-hide first**: Use soft-hide before permanent removal
- **Restoration**: Comments can be restored when appropriate
- **Education**: Help users understand community standards

### **Anti-Censorship**
- **Transparent policies**: Clear, community-driven guidelines
- **Appeal process**: Fair appeal system for all users
- **Audit trails**: Complete audit trail of all actions
- **Community input**: Regular community feedback on policies

This moderation system provides a balanced approach to community management that respects free speech while maintaining a healthy, safe environment for all users.
