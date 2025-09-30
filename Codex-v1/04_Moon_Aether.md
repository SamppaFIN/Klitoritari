# 🌙 Moon Calendar & ÆtherLens
*The Sacred Blueprint for Revolutionary Anti-Censorship Discussion Platform*

## 📋 Document Information
**Version**: 1.0.0  
**Date**: 2025-09-30  
**Doc-ID**: SC-MOON-AETHER  
**Status**: Canonical

## 📝 ChangeLog
- 1.0.0 Initial codex import from chat (author: Infinite IRL)

---

## 🌙 Moon Calendar System

### **Lunar Phase Calculation**
```typescript
// Meeus-based lunar phase calculation
interface MoonPhase {
  phase: 'new' | 'first_quarter' | 'full' | 'last_quarter';
  illumination: number; // 0-1
  age: number; // days since new moon
  nextApex: Date;
  apexBand: boolean; // true if within 3-day apex band
}

// Apex windows: New, First Quarter, Full, Last Quarter each have a 3-day band (-1, 0, +1)
const calculateApexBand = (date: Date): boolean => {
  const moonPhase = calculateMoonPhase(date);
  const daysToApex = Math.abs(moonPhase.age % 7.38); // Lunar month is ~29.5 days
  return daysToApex <= 1; // Within 1 day of apex
};
```

### **13-Moonth Calendar**
```typescript
interface Moonth {
  number: number; // 1-13
  name: string; // Traditional moon names
  days: number; // 29 or 30 days
  startDate: Date;
  endDate: Date;
  currentPhase: MoonPhase;
  apexDays: number[]; // Days within apex bands
}

// 13-moonth layout (29–30 days each), indexed by lunations (no Gregorian grid)
const createMoonthCalendar = (year: number): Moonth[] => {
  const moonths: Moonth[] = [];
  let currentDate = new Date(year, 0, 1);
  
  for (let i = 0; i < 13; i++) {
    const moonth = createMoonth(currentDate, i + 1);
    moonths.push(moonth);
    currentDate = addDays(currentDate, moonth.days);
  }
  
  return moonths;
};
```

### **Countdown System**
```typescript
interface ApexCountdown {
  daysToNext: number;
  nextApex: Date;
  apexType: 'new' | 'first_quarter' | 'full' | 'last_quarter';
  isActive: boolean; // true if currently in apex band
}

// Countdown: shows days until next apex; disappears during active apex
const calculateApexCountdown = (date: Date): ApexCountdown => {
  const moonPhase = calculateMoonPhase(date);
  const nextApex = calculateNextApex(date);
  const daysToNext = Math.ceil((nextApex.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  return {
    daysToNext,
    nextApex,
    apexType: nextApex.phase,
    isActive: calculateApexBand(date)
  };
};
```

---

## 🎨 Moon UI Components

### **MoonWidget (Header)**
```typescript
interface MoonWidgetProps {
  currentPhase: MoonPhase;
  apexCountdown: ApexCountdown;
  onCalendarOpen: () => void;
}

// Shows current phase glyph, apex ring when active, countdown badge with ▲/▼
const MoonWidget: SvelteComponent = {
  props: ['currentPhase', 'apexCountdown', 'onCalendarOpen'],
  template: `
    <div class="moon-widget" on:click={onCalendarOpen}>
      <div class="phase-glyph" class:apex-active={apexCountdown.isActive}>
        {currentPhase.phase}
      </div>
      {#if !apexCountdown.isActive}
        <div class="countdown-badge">
          {apexCountdown.daysToNext} days to {apexCountdown.apexType}
        </div>
      {/if}
    </div>
  `
};
```

### **MoonCalendarModal**
```typescript
interface MoonCalendarModalProps {
  currentMoonth: Moonth;
  onPrevMoonth: () => void;
  onNextMoonth: () => void;
  onFullCalendar: () => void;
}

// Lunation view (current moonth), apex rings on relevant days, next/prev with buttons
const MoonCalendarModal: SvelteComponent = {
  props: ['currentMoonth', 'onPrevMoonth', 'onNextMoonth', 'onFullCalendar'],
  template: `
    <div class="moon-calendar-modal">
      <div class="moonth-header">
        <button on:click={onPrevMoonth}>←</button>
        <h2>{currentMoonth.name}</h2>
        <button on:click={onNextMoonth}>→</button>
      </div>
      <div class="moonth-grid">
        {#each currentMoonth.days as day}
          <div class="day" class:apex-day={currentMoonth.apexDays.includes(day)}>
            {day}
          </div>
        {/each}
      </div>
      <button on:click={onFullCalendar}>Open Full Calendar</button>
    </div>
  `
};
```

### **MoonCalendarPage (Full Screen)**
```typescript
interface MoonCalendarPageProps {
  year: number;
  moonths: Moonth[];
  sidebarToggles: {
    planets: boolean;
    weekdays: boolean;
    alchemical: boolean;
    gemstones: boolean;
  };
  onToggleSidebar: (section: string) => void;
}

// 13-moonth layout; sidebar toggles for Planets/Weekdays, Alchemical signs, Gemstones
const MoonCalendarPage: SvelteComponent = {
  props: ['year', 'moonths', 'sidebarToggles', 'onToggleSidebar'],
  template: `
    <div class="moon-calendar-page">
      <div class="sidebar">
        <div class="toggle-section">
          <label>
            <input type="checkbox" bind:checked={sidebarToggles.planets} 
                   on:change={() => onToggleSidebar('planets')}>
            Planets/Weekdays
          </label>
          <label>
            <input type="checkbox" bind:checked={sidebarToggles.alchemical} 
                   on:change={() => onToggleSidebar('alchemical')}>
            Alchemical Signs
          </label>
          <label>
            <input type="checkbox" bind:checked={sidebarToggles.gemstones} 
                   on:change={() => onToggleSidebar('gemstones')}>
            Gemstones
          </label>
        </div>
      </div>
      <div class="calendar-grid">
        {#each moonths as moonth}
          <div class="moonth-card">
            <h3>{moonth.name}</h3>
            <div class="moonth-days">
              {#each moonth.days as day}
                <div class="day" class:apex-day={moonth.apexDays.includes(day)}>
                  {day}
                </div>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </div>
  `
};
```

---

## 🔮 Tarot System

### **Global & Personal Tarot**
```typescript
interface TarotCard {
  id: number;
  name: string;
  suit: 'major' | 'cups' | 'wands' | 'swords' | 'pentacles';
  deck: 'waite' | 'thoth';
  image: string;
  description: string;
}

// Global daily card (date+salt), personal daily card (user_id+date)
const getGlobalTarotCard = (date: Date): TarotCard => {
  const seed = date.getTime() + 12345; // Salt for global card
  return getTarotCard(seed);
};

const getPersonalTarotCard = (userId: string, date: Date): TarotCard => {
  const seed = date.getTime() + userId.hashCode();
  return getTarotCard(seed);
};
```

### **Tarot History Storage**
```sql
CREATE TABLE tarot_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    card_id INTEGER NOT NULL,
    deck VARCHAR(20) NOT NULL CHECK (deck IN ('waite', 'thoth')),
    card_type VARCHAR(20) NOT NULL CHECK (card_type IN ('global', 'personal')),
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, card_type, date)
);
```

### **Tarot UI Components**
```typescript
interface TarotCardProps {
  card: TarotCard;
  type: 'global' | 'personal';
  onDeckToggle: (deck: 'waite' | 'thoth') => void;
}

const TarotCard: SvelteComponent = {
  props: ['card', 'type', 'onDeckToggle'],
  template: `
    <div class="tarot-card">
      <div class="card-header">
        <h3>{type === 'global' ? 'Global' : 'Personal'} Card</h3>
        <div class="deck-toggle">
          <button on:click={() => onDeckToggle('waite')}>Waite</button>
          <button on:click={() => onDeckToggle('thoth')}>Thoth</button>
        </div>
      </div>
      <div class="card-image">
        <img src={card.image} alt={card.name} />
      </div>
      <div class="card-info">
        <h4>{card.name}</h4>
        <p>{card.description}</p>
      </div>
    </div>
  `
};
```

---

## 🔬 Equinox/Solstice Integration

### **Solstice/Equinox Calculation**
```typescript
interface SolsticeEquinox {
  type: 'spring_equinox' | 'summer_solstice' | 'autumn_equinox' | 'winter_solstice';
  date: Date;
  countdown: number; // days until next
}

const calculateNextSolsticeEquinox = (date: Date): SolsticeEquinox => {
  const year = date.getFullYear();
  const events = [
    { type: 'spring_equinox', date: new Date(year, 2, 20) },
    { type: 'summer_solstice', date: new Date(year, 5, 21) },
    { type: 'autumn_equinox', date: new Date(year, 8, 22) },
    { type: 'winter_solstice', date: new Date(year, 11, 21) }
  ];
  
  const nextEvent = events.find(event => event.date > date) || events[0];
  const countdown = Math.ceil((nextEvent.date.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  return {
    type: nextEvent.type,
    date: nextEvent.date,
    countdown
  };
};
```

### **Solstice/Equinox Card**
```typescript
interface SolsticeEquinoxCardProps {
  event: SolsticeEquinox;
}

const SolsticeEquinoxCard: SvelteComponent = {
  props: ['event'],
  template: `
    <div class="solstice-equinox-card">
      <h3>Next {event.type.replace('_', ' ')}</h3>
      <div class="countdown">
        {event.countdown} days
      </div>
      <div class="date">
        {event.date.toLocaleDateString()}
      </div>
    </div>
  `
};
```

---

## 🔮 Gemstones & Alchemical Info

### **Static Content System**
```typescript
interface GemstoneInfo {
  name: string;
  properties: string[];
  chakra: string;
  element: string;
  description: string;
}

interface AlchemicalInfo {
  symbol: string;
  name: string;
  element: string;
  properties: string[];
  description: string;
}

// Static, concise content; sidebar + duplicated under the calendar for discoverability
const gemstonesData: GemstoneInfo[] = [
  {
    name: "Amethyst",
    properties: ["Spiritual protection", "Intuition", "Peace"],
    chakra: "Crown",
    element: "Water",
    description: "A powerful spiritual stone that enhances intuition and provides protection."
  },
  // ... more gemstones
];

const alchemicalData: AlchemicalInfo[] = [
  {
    symbol: "☉",
    name: "Gold",
    element: "Sun",
    properties: ["Perfection", "Immortality", "Transmutation"],
    description: "The ultimate goal of alchemy, representing spiritual perfection."
  },
  // ... more alchemical symbols
];
```

---

## 📊 ÆtherLens Analytics

### **Opt-in Scopes**
```sql
CREATE TYPE aether_scope AS ENUM ('Off', 'Basic', 'Advanced');

CREATE TABLE aether_opt_in (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    scope aether_scope NOT NULL DEFAULT 'Off',
    consented_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Scope Definitions**
- **Off**: No data collection
- **Basic**: Mood and reaction tendencies, basic analytics
- **Advanced**: Detailed analytics, moon correlation, 30/90-day charts

### **Personal ÆL Insights**
```typescript
interface PersonalAetherInsights {
  moodPatterns: {
    [mood: string]: number;
  };
  reactionTendencies: {
    [reaction: string]: number;
  };
  moonCorrelation: {
    phase: string;
    correlation: number;
  };
  charts: {
    mood30Day: ChartData;
    mood90Day: ChartData;
    reactions30Day: ChartData;
    reactions90Day: ChartData;
  };
}
```

### **K-Anonymity Implementation**
```typescript
// Public aggregates: k-anonymity k ≥ 50 per country/day; else bucket "Other"
const getPublicAetherData = async (date: Date, country: string) => {
  const userCount = await getUserCountForCountry(date, country);
  
  if (userCount < 50) {
    return {
      country: 'Other',
      data: await getAggregatedDataForOther(date)
    };
  }
  
  return {
    country,
    data: await getAggregatedDataForCountry(date, country)
  };
};
```

---

## 🌐 Public Æther Page

### **Public Aggregates API**
```typescript
// GET /api/aether/daily.json|.csv
interface PublicAetherData {
  date: string;
  country: string;
  moods: {
    [mood: string]: number;
  };
  reactions: {
    [reaction: string]: number;
  };
  usersActive: number;
  comments: number;
  reactions: number;
  botsExcluded: boolean;
}
```

### **Public Æther UI**
```typescript
interface PublicAetherPageProps {
  data: PublicAetherData[];
  selectedCountry: string;
  dateRange: { start: Date; end: Date };
}

const PublicAetherPage: SvelteComponent = {
  props: ['data', 'selectedCountry', 'dateRange'],
  template: `
    <div class="public-aether-page">
      <h1>Public Æther Analytics</h1>
      <div class="filters">
        <select bind:value={selectedCountry}>
          <option value="all">All Countries</option>
          <option value="Other">Other</option>
          <!-- Dynamic country options -->
        </select>
        <input type="date" bind:value={dateRange.start} />
        <input type="date" bind:value={dateRange.end} />
      </div>
      <div class="charts">
        <!-- Mood charts -->
        <!-- Reaction charts -->
        <!-- Activity charts -->
      </div>
      <div class="export-options">
        <button on:click={() => exportData('json')}>Export JSON</button>
        <button on:click={() => exportData('csv')}>Export CSV</button>
      </div>
    </div>
  `
};
```

---

## 🔧 Moon Helpers & Utilities

### **Moon Phase Calculation**
```typescript
// Meeus-based lunar phase calculation
const calculateMoonPhase = (date: Date): MoonPhase => {
  // Implementation of Meeus algorithm
  const jd = toJulianDay(date);
  const phase = calculateLunarPhase(jd);
  
  return {
    phase: phase.phase,
    illumination: phase.illumination,
    age: phase.age,
    nextApex: calculateNextApex(date),
    apexBand: calculateApexBand(date)
  };
};
```

### **Apex Band Calculation**
```typescript
const calculateApexBand = (date: Date): boolean => {
  const moonPhase = calculateMoonPhase(date);
  const daysToApex = Math.abs(moonPhase.age % 7.38);
  return daysToApex <= 1; // Within 1 day of apex
};
```

### **Countdown Logic**
```typescript
const calculateApexCountdown = (date: Date): ApexCountdown => {
  const moonPhase = calculateMoonPhase(date);
  const nextApex = calculateNextApex(date);
  const daysToNext = Math.ceil((nextApex.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  return {
    daysToNext,
    nextApex,
    apexType: nextApex.phase,
    isActive: calculateApexBand(date)
  };
};
```

---

## 🎯 Performance Requirements

### **Moon Calculations**
- **<10ms**: Moon phase calculations must complete in under 10ms
- **Caching**: Cache moon phase calculations for current day
- **Client-side**: All moon calculations run client-side
- **Accuracy**: Meeus algorithm accuracy within 0.1 degrees

### **ÆtherLens Performance**
- **<50ms**: Personal insights API responses under 50ms
- **<100ms**: Public aggregates API responses under 100ms
- **Caching**: Cache aggregated data for 1 hour
- **K-anonymity**: Real-time k-anonymity checks

### **UI Performance**
- **60fps**: All moon UI animations maintain 60fps
- **Smooth transitions**: Smooth transitions between moon phases
- **Responsive**: All components responsive on mobile
- **Accessibility**: Full keyboard and screen reader support

---

## 🧪 Testing Requirements

### **Moon System Tests**
- **Phase accuracy**: Test moon phase calculations against known dates
- **Apex bands**: Test apex band calculations
- **Countdown logic**: Test countdown accuracy
- **Calendar rendering**: Test 13-moonth calendar display

### **ÆtherLens Tests**
- **K-anonymity**: Test k-anonymity enforcement
- **Data aggregation**: Test data aggregation accuracy
- **Privacy**: Test user data privacy protection
- **Export functionality**: Test data export features

### **Integration Tests**
- **Moon UI**: Test moon widget and calendar components
- **Tarot system**: Test tarot card generation and history
- **Public API**: Test public ÆtherLens API endpoints
- **Performance**: Test performance requirements

This moon calendar and ÆtherLens system provides a rich, mystical experience that enhances user engagement while maintaining privacy and performance standards.
