/**
 * 🚀 Advanced Components
 * Sophisticated UI components with complex interactions
 * 
 * @author Aurora - The Dawn Bringer of Digital Light
 * @version 2.0
 */

/**
 * 📅 Calendar Component
 */
class CalendarComponent extends BaseComponent {
    constructor() {
        super('Calendar', 'Interactive date picker with events', 'calendar');
    }
    
    createVanillaElement() {
        const container = document.createElement('div');
        container.className = 'calendar-container';
        
        const label = document.createElement('label');
        label.textContent = 'Calendar';
        label.className = 'calendar-label';
        
        const calendar = document.createElement('div');
        calendar.className = 'vanilla-calendar';
        
        const header = document.createElement('div');
        header.className = 'calendar-header';
        header.innerHTML = `
            <button class="calendar-nav" id="prev-month">‹</button>
            <h3 class="calendar-title" id="current-month">January 2024</h3>
            <button class="calendar-nav" id="next-month">›</button>
        `;
        
        const weekdays = document.createElement('div');
        weekdays.className = 'calendar-weekdays';
        weekdays.innerHTML = `
            <div class="weekday">Sun</div>
            <div class="weekday">Mon</div>
            <div class="weekday">Tue</div>
            <div class="weekday">Wed</div>
            <div class="weekday">Thu</div>
            <div class="weekday">Fri</div>
            <div class="weekday">Sat</div>
        `;
        
        const days = document.createElement('div');
        days.className = 'calendar-days';
        days.id = 'calendar-days';
        
        const footer = document.createElement('div');
        footer.className = 'calendar-footer';
        footer.innerHTML = `
            <button class="calendar-btn" id="today-btn">Today</button>
            <button class="calendar-btn" id="clear-btn">Clear</button>
        `;
        
        calendar.appendChild(header);
        calendar.appendChild(weekdays);
        calendar.appendChild(days);
        calendar.appendChild(footer);
        container.appendChild(label);
        container.appendChild(calendar);
        
        return container;
    }
    
    createLibraryElement(libraryId) {
        const container = document.createElement('div');
        container.className = 'calendar-container';
        
        const label = document.createElement('label');
        label.textContent = `${libraryId.toUpperCase()} Calendar`;
        label.className = 'calendar-label';
        
        const calendar = document.createElement('div');
        calendar.className = `library-calendar ${libraryId}-calendar`;
        
        const header = document.createElement('div');
        header.className = 'calendar-header';
        header.innerHTML = `
            <button class="calendar-nav" id="prev-month-lib">‹</button>
            <h3 class="calendar-title" id="current-month-lib">January 2024</h3>
            <button class="calendar-nav" id="next-month-lib">›</button>
        `;
        
        const weekdays = document.createElement('div');
        weekdays.className = 'calendar-weekdays';
        weekdays.innerHTML = `
            <div class="weekday">Sun</div>
            <div class="weekday">Mon</div>
            <div class="weekday">Tue</div>
            <div class="weekday">Wed</div>
            <div class="weekday">Thu</div>
            <div class="weekday">Fri</div>
            <div class="weekday">Sat</div>
        `;
        
        const days = document.createElement('div');
        days.className = 'calendar-days';
        days.id = 'calendar-days-lib';
        
        const footer = document.createElement('div');
        footer.className = 'calendar-footer';
        footer.innerHTML = `
            <button class="calendar-btn" id="today-btn-lib">Today</button>
            <button class="calendar-btn" id="clear-btn-lib">Clear</button>
        `;
        
        calendar.appendChild(header);
        calendar.appendChild(weekdays);
        calendar.appendChild(days);
        calendar.appendChild(footer);
        container.appendChild(label);
        container.appendChild(calendar);
        
        return container;
    }
    
    setupVanillaEventListeners(element) {
        const prevBtn = element.querySelector('#prev-month');
        const nextBtn = element.querySelector('#next-month');
        const todayBtn = element.querySelector('#today-btn');
        const clearBtn = element.querySelector('#clear-btn');
        const daysContainer = element.querySelector('#calendar-days');
        const monthTitle = element.querySelector('#current-month');
        
        // Initialize calendar
        this.initCalendar(element);
        
        // Navigation
        prevBtn.addEventListener('click', () => {
            this.previousMonth(element);
        });
        
        nextBtn.addEventListener('click', () => {
            this.nextMonth(element);
        });
        
        todayBtn.addEventListener('click', () => {
            this.goToToday(element);
        });
        
        clearBtn.addEventListener('click', () => {
            this.clearSelection(element);
        });
        
        // Day selection
        daysContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('calendar-day')) {
                this.selectDay(element, e.target);
            }
        });
    }
    
    setupLibraryEventListeners(element, libraryId) {
        const prevBtn = element.querySelector('#prev-month-lib');
        const nextBtn = element.querySelector('#next-month-lib');
        const todayBtn = element.querySelector('#today-btn-lib');
        const clearBtn = element.querySelector('#clear-btn-lib');
        const daysContainer = element.querySelector('#calendar-days-lib');
        const monthTitle = element.querySelector('#current-month-lib');
        
        this.initCalendar(element);
        
        prevBtn.addEventListener('click', () => {
            this.previousMonth(element);
        });
        
        nextBtn.addEventListener('click', () => {
            this.nextMonth(element);
        });
        
        todayBtn.addEventListener('click', () => {
            this.goToToday(element);
        });
        
        clearBtn.addEventListener('click', () => {
            this.clearSelection(element);
        });
        
        daysContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('calendar-day')) {
                this.selectDay(element, e.target);
            }
        });
    }
    
    initCalendar(element) {
        element.calendarData = {
            currentDate: new Date(),
            selectedDate: null,
            events: [
                { date: new Date(2024, 0, 15), title: 'Meeting', color: '#ff6b6b' },
                { date: new Date(2024, 0, 22), title: 'Deadline', color: '#4ecdc4' },
                { date: new Date(2024, 0, 28), title: 'Conference', color: '#45b7d1' }
            ]
        };
        
        this.renderCalendar(element);
    }
    
    renderCalendar(element) {
        const data = element.calendarData;
        const daysContainer = element.querySelector('[id*="calendar-days"]');
        const monthTitle = element.querySelector('[id*="current-month"]');
        
        const year = data.currentDate.getFullYear();
        const month = data.currentDate.getMonth();
        
        // Update title
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];
        monthTitle.textContent = `${monthNames[month]} ${year}`;
        
        // Clear days
        daysContainer.innerHTML = '';
        
        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        
        // Add empty cells for days before month starts
        for (let i = 0; i < startingDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            daysContainer.appendChild(emptyDay);
        }
        
        // Add days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            dayElement.dataset.day = day;
            
            const currentDate = new Date(year, month, day);
            const today = new Date();
            
            // Check if it's today
            if (this.isSameDay(currentDate, today)) {
                dayElement.classList.add('today');
            }
            
            // Check if it's selected
            if (data.selectedDate && this.isSameDay(currentDate, data.selectedDate)) {
                dayElement.classList.add('selected');
            }
            
            // Check for events
            const event = data.events.find(e => this.isSameDay(e.date, currentDate));
            if (event) {
                dayElement.classList.add('has-event');
                dayElement.style.setProperty('--event-color', event.color);
                dayElement.title = event.title;
            }
            
            daysContainer.appendChild(dayElement);
        }
    }
    
    previousMonth(element) {
        const data = element.calendarData;
        data.currentDate.setMonth(data.currentDate.getMonth() - 1);
        this.renderCalendar(element);
    }
    
    nextMonth(element) {
        const data = element.calendarData;
        data.currentDate.setMonth(data.currentDate.getMonth() + 1);
        this.renderCalendar(element);
    }
    
    goToToday(element) {
        const data = element.calendarData;
        data.currentDate = new Date();
        this.renderCalendar(element);
    }
    
    clearSelection(element) {
        const data = element.calendarData;
        data.selectedDate = null;
        this.renderCalendar(element);
    }
    
    selectDay(element, dayElement) {
        const data = element.calendarData;
        const day = parseInt(dayElement.dataset.day);
        const year = data.currentDate.getFullYear();
        const month = data.currentDate.getMonth();
        
        data.selectedDate = new Date(year, month, day);
        this.renderCalendar(element);
        
        // Trigger custom event
        element.dispatchEvent(new CustomEvent('dateSelected', {
            detail: { date: data.selectedDate }
        }));
    }
    
    isSameDay(date1, date2) {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    }
    
    applyVanillaStyles(element) {
        styleManager.addComponentStyles('calendar', `
            .calendar-container {
                margin: 1rem 0;
            }
            
            .calendar-label {
                display: block;
                margin-bottom: 0.5rem;
                color: var(--cosmic-light);
                font-family: var(--font-primary);
                font-weight: 600;
            }
            
            .vanilla-calendar {
                background: var(--cosmic-dark);
                border: 2px solid var(--cosmic-neutral);
                border-radius: 12px;
                padding: 1.5rem;
                max-width: 400px;
            }
            
            .calendar-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
            }
            
            .calendar-nav {
                background: var(--cosmic-primary);
                color: white;
                border: none;
                border-radius: 50%;
                width: 32px;
                height: 32px;
                cursor: pointer;
                font-size: 1.2rem;
                transition: all 0.3s ease;
            }
            
            .calendar-nav:hover {
                background: var(--cosmic-accent);
                transform: scale(1.1);
            }
            
            .calendar-title {
                color: var(--cosmic-light);
                font-family: var(--font-primary);
                font-size: 1.2rem;
                margin: 0;
            }
            
            .calendar-weekdays {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                gap: 0.5rem;
                margin-bottom: 1rem;
            }
            
            .weekday {
                text-align: center;
                color: var(--cosmic-neutral);
                font-family: var(--font-secondary);
                font-weight: 600;
                padding: 0.5rem;
            }
            
            .calendar-days {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                gap: 0.5rem;
                margin-bottom: 1rem;
            }
            
            .calendar-day {
                aspect-ratio: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                background: var(--cosmic-darker);
                border: 1px solid var(--cosmic-neutral);
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-family: var(--font-secondary);
                font-weight: 500;
                position: relative;
            }
            
            .calendar-day:hover {
                background: var(--cosmic-primary);
                color: white;
                transform: scale(1.05);
            }
            
            .calendar-day.today {
                background: var(--cosmic-accent);
                color: var(--cosmic-dark);
                font-weight: 700;
            }
            
            .calendar-day.selected {
                background: var(--cosmic-primary);
                color: white;
                box-shadow: 0 0 0 2px var(--cosmic-accent);
            }
            
            .calendar-day.has-event::after {
                content: '';
                position: absolute;
                bottom: 2px;
                left: 50%;
                transform: translateX(-50%);
                width: 4px;
                height: 4px;
                background: var(--event-color, var(--cosmic-accent));
                border-radius: 50%;
            }
            
            .calendar-day.empty {
                background: transparent;
                border: none;
                cursor: default;
            }
            
            .calendar-day.empty:hover {
                background: transparent;
                transform: none;
            }
            
            .calendar-footer {
                display: flex;
                gap: 0.5rem;
                justify-content: center;
            }
            
            .calendar-btn {
                padding: 0.5rem 1rem;
                background: var(--cosmic-neutral);
                color: var(--cosmic-light);
                border: none;
                border-radius: 6px;
                font-family: var(--font-primary);
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .calendar-btn:hover {
                background: var(--cosmic-primary);
                transform: translateY(-2px);
            }
        `);
    }
    
    applyLibraryStyles(element, libraryId) {
        styleManager.addComponentStyles('calendar-library', `
            .library-calendar {
                background: var(--cosmic-dark);
                border: 2px solid var(--cosmic-neutral);
                border-radius: 12px;
                padding: 1.5rem;
                max-width: 400px;
            }
        `);
    }
}

/**
 * 🎠 Carousel Component
 */
class CarouselComponent extends BaseComponent {
    constructor() {
        super('Carousel', 'Image and content slider with navigation', 'carousel');
    }
    
    createVanillaElement() {
        const container = document.createElement('div');
        container.className = 'carousel-container';
        
        const label = document.createElement('label');
        label.textContent = 'Carousel';
        label.className = 'carousel-label';
        
        const carousel = document.createElement('div');
        carousel.className = 'vanilla-carousel';
        
        const wrapper = document.createElement('div');
        wrapper.className = 'carousel-wrapper';
        wrapper.innerHTML = `
            <div class="carousel-track" id="carousel-track">
                <div class="carousel-slide active">
                    <div class="slide-content">
                        <h3>Slide 1</h3>
                        <p>Beautiful cosmic imagery and content</p>
                        <div class="slide-image" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); height: 200px; border-radius: 8px;"></div>
                    </div>
                </div>
                <div class="carousel-slide">
                    <div class="slide-content">
                        <h3>Slide 2</h3>
                        <p>Advanced UI components showcase</p>
                        <div class="slide-image" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); height: 200px; border-radius: 8px;"></div>
                    </div>
                </div>
                <div class="carousel-slide">
                    <div class="slide-content">
                        <h3>Slide 3</h3>
                        <p>Interactive elements and animations</p>
                        <div class="slide-image" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); height: 200px; border-radius: 8px;"></div>
                    </div>
                </div>
            </div>
        `;
        
        const controls = document.createElement('div');
        controls.className = 'carousel-controls';
        controls.innerHTML = `
            <button class="carousel-btn prev" id="carousel-prev">‹</button>
            <div class="carousel-dots" id="carousel-dots"></div>
            <button class="carousel-btn next" id="carousel-next">›</button>
        `;
        
        carousel.appendChild(wrapper);
        carousel.appendChild(controls);
        container.appendChild(label);
        container.appendChild(carousel);
        
        return container;
    }
    
    createLibraryElement(libraryId) {
        const container = document.createElement('div');
        container.className = 'carousel-container';
        
        const label = document.createElement('label');
        label.textContent = `${libraryId.toUpperCase()} Carousel`;
        label.className = 'carousel-label';
        
        const carousel = document.createElement('div');
        carousel.className = `library-carousel ${libraryId}-carousel`;
        
        const wrapper = document.createElement('div');
        wrapper.className = 'carousel-wrapper';
        wrapper.innerHTML = `
            <div class="carousel-track" id="carousel-track-lib">
                <div class="carousel-slide active">
                    <div class="slide-content">
                        <h3>Slide 1</h3>
                        <p>Beautiful cosmic imagery and content</p>
                        <div class="slide-image" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); height: 200px; border-radius: 8px;"></div>
                    </div>
                </div>
                <div class="carousel-slide">
                    <div class="slide-content">
                        <h3>Slide 2</h3>
                        <p>Advanced UI components showcase</p>
                        <div class="slide-image" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); height: 200px; border-radius: 8px;"></div>
                    </div>
                </div>
                <div class="carousel-slide">
                    <div class="slide-content">
                        <h3>Slide 3</h3>
                        <p>Interactive elements and animations</p>
                        <div class="slide-image" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); height: 200px; border-radius: 8px;"></div>
                    </div>
                </div>
            </div>
        `;
        
        const controls = document.createElement('div');
        controls.className = 'carousel-controls';
        controls.innerHTML = `
            <button class="carousel-btn prev" id="carousel-prev-lib">‹</button>
            <div class="carousel-dots" id="carousel-dots-lib"></div>
            <button class="carousel-btn next" id="carousel-next-lib">›</button>
        `;
        
        carousel.appendChild(wrapper);
        carousel.appendChild(controls);
        container.appendChild(label);
        container.appendChild(carousel);
        
        return container;
    }
    
    setupVanillaEventListeners(element) {
        const prevBtn = element.querySelector('#carousel-prev');
        const nextBtn = element.querySelector('#carousel-next');
        const track = element.querySelector('#carousel-track');
        const dotsContainer = element.querySelector('#carousel-dots');
        
        // Initialize carousel
        this.initCarousel(element);
        
        // Navigation
        prevBtn.addEventListener('click', () => {
            this.previousSlide(element);
        });
        
        nextBtn.addEventListener('click', () => {
            this.nextSlide(element);
        });
        
        // Dot navigation
        dotsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('carousel-dot')) {
                const index = parseInt(e.target.dataset.index);
                this.goToSlide(element, index);
            }
        });
        
        // Touch/swipe support
        this.addTouchSupport(element);
    }
    
    setupLibraryEventListeners(element, libraryId) {
        const prevBtn = element.querySelector('#carousel-prev-lib');
        const nextBtn = element.querySelector('#carousel-next-lib');
        const track = element.querySelector('#carousel-track-lib');
        const dotsContainer = element.querySelector('#carousel-dots-lib');
        
        this.initCarousel(element);
        
        prevBtn.addEventListener('click', () => {
            this.previousSlide(element);
        });
        
        nextBtn.addEventListener('click', () => {
            this.nextSlide(element);
        });
        
        dotsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('carousel-dot')) {
                const index = parseInt(e.target.dataset.index);
                this.goToSlide(element, index);
            }
        });
        
        this.addTouchSupport(element);
    }
    
    initCarousel(element) {
        element.carouselData = {
            currentSlide: 0,
            totalSlides: 3,
            isTransitioning: false,
            autoplay: true,
            autoplayInterval: 3000
        };
        
        this.createDots(element);
        this.startAutoplay(element);
    }
    
    createDots(element) {
        const dotsContainer = element.querySelector('[id*="carousel-dots"]');
        dotsContainer.innerHTML = '';
        
        for (let i = 0; i < element.carouselData.totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.dataset.index = i;
            if (i === 0) dot.classList.add('active');
            dotsContainer.appendChild(dot);
        }
    }
    
    previousSlide(element) {
        const data = element.carouselData;
        if (data.isTransitioning) return;
        
        data.currentSlide = (data.currentSlide - 1 + data.totalSlides) % data.totalSlides;
        this.updateCarousel(element);
    }
    
    nextSlide(element) {
        const data = element.carouselData;
        if (data.isTransitioning) return;
        
        data.currentSlide = (data.currentSlide + 1) % data.totalSlides;
        this.updateCarousel(element);
    }
    
    goToSlide(element, index) {
        const data = element.carouselData;
        if (data.isTransitioning || index === data.currentSlide) return;
        
        data.currentSlide = index;
        this.updateCarousel(element);
    }
    
    updateCarousel(element) {
        const data = element.carouselData;
        const track = element.querySelector('[id*="carousel-track"]');
        const slides = track.querySelectorAll('.carousel-slide');
        const dots = element.querySelectorAll('.carousel-dot');
        
        data.isTransitioning = true;
        
        // Update slides
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === data.currentSlide);
        });
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === data.currentSlide);
        });
        
        // Update track position
        track.style.transform = `translateX(-${data.currentSlide * 100}%)`;
        
        setTimeout(() => {
            data.isTransitioning = false;
        }, 300);
    }
    
    startAutoplay(element) {
        const data = element.carouselData;
        if (!data.autoplay) return;
        
        element.autoplayInterval = setInterval(() => {
            this.nextSlide(element);
        }, data.autoplayInterval);
    }
    
    stopAutoplay(element) {
        if (element.autoplayInterval) {
            clearInterval(element.autoplayInterval);
        }
    }
    
    addTouchSupport(element) {
        let startX = 0;
        let startY = 0;
        let isDragging = false;
        
        element.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isDragging = true;
            this.stopAutoplay(element);
        });
        
        element.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        });
        
        element.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.nextSlide(element);
                } else {
                    this.previousSlide(element);
                }
            }
            
            isDragging = false;
            this.startAutoplay(element);
        });
    }
    
    applyVanillaStyles(element) {
        styleManager.addComponentStyles('carousel', `
            .carousel-container {
                margin: 1rem 0;
            }
            
            .carousel-label {
                display: block;
                margin-bottom: 0.5rem;
                color: var(--cosmic-light);
                font-family: var(--font-primary);
                font-weight: 600;
            }
            
            .vanilla-carousel {
                background: var(--cosmic-dark);
                border: 2px solid var(--cosmic-neutral);
                border-radius: 12px;
                padding: 1.5rem;
                position: relative;
                overflow: hidden;
            }
            
            .carousel-wrapper {
                position: relative;
                overflow: hidden;
                border-radius: 8px;
            }
            
            .carousel-track {
                display: flex;
                transition: transform 0.3s ease;
            }
            
            .carousel-slide {
                min-width: 100%;
                padding: 1rem;
                background: var(--cosmic-darker);
                border-radius: 8px;
                opacity: 0;
                transform: translateX(100%);
                transition: all 0.3s ease;
            }
            
            .carousel-slide.active {
                opacity: 1;
                transform: translateX(0);
            }
            
            .slide-content h3 {
                color: var(--cosmic-light);
                font-family: var(--font-primary);
                margin: 0 0 0.5rem 0;
            }
            
            .slide-content p {
                color: var(--cosmic-neutral);
                font-family: var(--font-secondary);
                margin: 0 0 1rem 0;
            }
            
            .carousel-controls {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 1rem;
            }
            
            .carousel-btn {
                background: var(--cosmic-primary);
                color: white;
                border: none;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                cursor: pointer;
                font-size: 1.2rem;
                transition: all 0.3s ease;
            }
            
            .carousel-btn:hover {
                background: var(--cosmic-accent);
                transform: scale(1.1);
            }
            
            .carousel-dots {
                display: flex;
                gap: 0.5rem;
            }
            
            .carousel-dot {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                border: none;
                background: var(--cosmic-neutral);
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .carousel-dot.active {
                background: var(--cosmic-accent);
                transform: scale(1.2);
            }
            
            .carousel-dot:hover {
                background: var(--cosmic-primary);
            }
        `);
    }
    
    applyLibraryStyles(element, libraryId) {
        styleManager.addComponentStyles('carousel-library', `
            .library-carousel {
                background: var(--cosmic-dark);
                border: 2px solid var(--cosmic-neutral);
                border-radius: 12px;
                padding: 1.5rem;
                position: relative;
                overflow: hidden;
            }
        `);
    }
}

/**
 * 🌳 Tree View Component
 */
class TreeViewComponent extends BaseComponent {
    constructor() {
        super('Tree View', 'Hierarchical data display with expand/collapse', 'treeview');
    }
    
    createVanillaElement() {
        const container = document.createElement('div');
        container.className = 'treeview-container';
        
        const label = document.createElement('label');
        label.textContent = 'Tree View';
        label.className = 'treeview-label';
        
        const treeview = document.createElement('div');
        treeview.className = 'vanilla-treeview';
        
        const search = document.createElement('div');
        search.className = 'treeview-search';
        search.innerHTML = `
            <input type="text" placeholder="Search nodes..." class="treeview-search-input" id="treeview-search">
            <button class="treeview-search-btn" id="treeview-search-btn">🔍</button>
        `;
        
        const tree = document.createElement('div');
        tree.className = 'treeview-tree';
        tree.id = 'treeview-tree';
        
        const controls = document.createElement('div');
        controls.className = 'treeview-controls';
        controls.innerHTML = `
            <button class="treeview-btn" id="expand-all">Expand All</button>
            <button class="treeview-btn" id="collapse-all">Collapse All</button>
            <button class="treeview-btn" id="add-node">Add Node</button>
        `;
        
        treeview.appendChild(search);
        treeview.appendChild(tree);
        treeview.appendChild(controls);
        container.appendChild(label);
        container.appendChild(treeview);
        
        return container;
    }
    
    createLibraryElement(libraryId) {
        const container = document.createElement('div');
        container.className = 'treeview-container';
        
        const label = document.createElement('label');
        label.textContent = `${libraryId.toUpperCase()} Tree View`;
        label.className = 'treeview-label';
        
        const treeview = document.createElement('div');
        treeview.className = `library-treeview ${libraryId}-treeview`;
        
        const search = document.createElement('div');
        search.className = 'treeview-search';
        search.innerHTML = `
            <input type="text" placeholder="Search nodes..." class="treeview-search-input" id="treeview-search-lib">
            <button class="treeview-search-btn" id="treeview-search-btn-lib">🔍</button>
        `;
        
        const tree = document.createElement('div');
        tree.className = 'treeview-tree';
        tree.id = 'treeview-tree-lib';
        
        const controls = document.createElement('div');
        controls.className = 'treeview-controls';
        controls.innerHTML = `
            <button class="treeview-btn" id="expand-all-lib">Expand All</button>
            <button class="treeview-btn" id="collapse-all-lib">Collapse All</button>
            <button class="treeview-btn" id="add-node-lib">Add Node</button>
        `;
        
        treeview.appendChild(search);
        treeview.appendChild(tree);
        treeview.appendChild(controls);
        container.appendChild(label);
        container.appendChild(treeview);
        
        return container;
    }
    
    setupVanillaEventListeners(element) {
        const searchInput = element.querySelector('#treeview-search');
        const searchBtn = element.querySelector('#treeview-search-btn');
        const expandAllBtn = element.querySelector('#expand-all');
        const collapseAllBtn = element.querySelector('#collapse-all');
        const addNodeBtn = element.querySelector('#add-node');
        const tree = element.querySelector('#treeview-tree');
        
        // Initialize treeview
        this.initTreeView(element);
        
        // Search functionality
        searchInput.addEventListener('input', () => {
            this.searchNodes(element, searchInput.value);
        });
        
        searchBtn.addEventListener('click', () => {
            this.searchNodes(element, searchInput.value);
        });
        
        // Control buttons
        expandAllBtn.addEventListener('click', () => {
            this.expandAll(element);
        });
        
        collapseAllBtn.addEventListener('click', () => {
            this.collapseAll(element);
        });
        
        addNodeBtn.addEventListener('click', () => {
            this.addNode(element);
        });
        
        // Tree interactions
        tree.addEventListener('click', (e) => {
            if (e.target.classList.contains('treeview-toggle')) {
                this.toggleNode(element, e.target);
            } else if (e.target.classList.contains('treeview-node')) {
                this.selectNode(element, e.target);
            }
        });
    }
    
    setupLibraryEventListeners(element, libraryId) {
        const searchInput = element.querySelector('#treeview-search-lib');
        const searchBtn = element.querySelector('#treeview-search-btn-lib');
        const expandAllBtn = element.querySelector('#expand-all-lib');
        const collapseAllBtn = element.querySelector('#collapse-all-lib');
        const addNodeBtn = element.querySelector('#add-node-lib');
        const tree = element.querySelector('#treeview-tree-lib');
        
        this.initTreeView(element);
        
        searchInput.addEventListener('input', () => {
            this.searchNodes(element, searchInput.value);
        });
        
        searchBtn.addEventListener('click', () => {
            this.searchNodes(element, searchInput.value);
        });
        
        expandAllBtn.addEventListener('click', () => {
            this.expandAll(element);
        });
        
        collapseAllBtn.addEventListener('click', () => {
            this.collapseAll(element);
        });
        
        addNodeBtn.addEventListener('click', () => {
            this.addNode(element);
        });
        
        tree.addEventListener('click', (e) => {
            if (e.target.classList.contains('treeview-toggle')) {
                this.toggleNode(element, e.target);
            } else if (e.target.classList.contains('treeview-node')) {
                this.selectNode(element, e.target);
            }
        });
    }
    
    initTreeView(element) {
        element.treeData = {
            nodes: [
                {
                    id: 1,
                    text: 'Root Node',
                    children: [
                        {
                            id: 2,
                            text: 'Child 1',
                            children: [
                                { id: 4, text: 'Grandchild 1' },
                                { id: 5, text: 'Grandchild 2' }
                            ]
                        },
                        {
                            id: 3,
                            text: 'Child 2',
                            children: [
                                { id: 6, text: 'Grandchild 3' }
                            ]
                        }
                    ]
                }
            ],
            selectedNode: null,
            expandedNodes: new Set([1])
        };
        
        this.renderTree(element);
    }
    
    renderTree(element) {
        const data = element.treeData;
        const tree = element.querySelector('[id*="treeview-tree"]');
        
        tree.innerHTML = '';
        data.nodes.forEach(node => {
            const nodeElement = this.createNodeElement(node, 0);
            tree.appendChild(nodeElement);
        });
    }
    
    createNodeElement(node, level) {
        const nodeDiv = document.createElement('div');
        nodeDiv.className = 'treeview-node';
        nodeDiv.dataset.nodeId = node.id;
        nodeDiv.style.paddingLeft = `${level * 20}px`;
        
        const hasChildren = node.children && node.children.length > 0;
        
        nodeDiv.innerHTML = `
            <div class="treeview-node-content">
                ${hasChildren ? '<button class="treeview-toggle">▶</button>' : '<span class="treeview-spacer"></span>'}
                <span class="treeview-text">${node.text}</span>
            </div>
        `;
        
        if (hasChildren) {
            const childrenContainer = document.createElement('div');
            childrenContainer.className = 'treeview-children';
            childrenContainer.style.display = element.treeData.expandedNodes.has(node.id) ? 'block' : 'none';
            
            node.children.forEach(child => {
                const childElement = this.createNodeElement(child, level + 1);
                childrenContainer.appendChild(childElement);
            });
            
            nodeDiv.appendChild(childrenContainer);
        }
        
        return nodeDiv;
    }
    
    toggleNode(element, toggleBtn) {
        const nodeElement = toggleBtn.closest('.treeview-node');
        const nodeId = parseInt(nodeElement.dataset.nodeId);
        const childrenContainer = nodeElement.querySelector('.treeview-children');
        const data = element.treeData;
        
        if (data.expandedNodes.has(nodeId)) {
            data.expandedNodes.delete(nodeId);
            childrenContainer.style.display = 'none';
            toggleBtn.textContent = '▶';
        } else {
            data.expandedNodes.add(nodeId);
            childrenContainer.style.display = 'block';
            toggleBtn.textContent = '▼';
        }
    }
    
    selectNode(element, nodeElement) {
        const data = element.treeData;
        
        // Remove previous selection
        element.querySelectorAll('.treeview-node.selected').forEach(node => {
            node.classList.remove('selected');
        });
        
        // Add new selection
        nodeElement.classList.add('selected');
        data.selectedNode = parseInt(nodeElement.dataset.nodeId);
        
        // Trigger custom event
        element.dispatchEvent(new CustomEvent('nodeSelected', {
            detail: { nodeId: data.selectedNode }
        }));
    }
    
    searchNodes(element, query) {
        const nodes = element.querySelectorAll('.treeview-node');
        const data = element.treeData;
        
        if (!query.trim()) {
            nodes.forEach(node => {
                node.style.display = 'block';
                node.classList.remove('search-highlight');
            });
            return;
        }
        
        nodes.forEach(node => {
            const text = node.querySelector('.treeview-text').textContent.toLowerCase();
            if (text.includes(query.toLowerCase())) {
                node.style.display = 'block';
                node.classList.add('search-highlight');
            } else {
                node.style.display = 'none';
                node.classList.remove('search-highlight');
            }
        });
    }
    
    expandAll(element) {
        const data = element.treeData;
        const toggles = element.querySelectorAll('.treeview-toggle');
        
        toggles.forEach(toggle => {
            const nodeElement = toggle.closest('.treeview-node');
            const nodeId = parseInt(nodeElement.dataset.nodeId);
            const childrenContainer = nodeElement.querySelector('.treeview-children');
            
            data.expandedNodes.add(nodeId);
            childrenContainer.style.display = 'block';
            toggle.textContent = '▼';
        });
    }
    
    collapseAll(element) {
        const data = element.treeData;
        const toggles = element.querySelectorAll('.treeview-toggle');
        
        data.expandedNodes.clear();
        
        toggles.forEach(toggle => {
            const childrenContainer = toggle.closest('.treeview-node').querySelector('.treeview-children');
            childrenContainer.style.display = 'none';
            toggle.textContent = '▶';
        });
    }
    
    addNode(element) {
        const data = element.treeData;
        const newNode = {
            id: Date.now(),
            text: `New Node ${data.nodes.length + 1}`,
            children: []
        };
        
        data.nodes.push(newNode);
        this.renderTree(element);
    }
    
    applyVanillaStyles(element) {
        styleManager.addComponentStyles('treeview', `
            .treeview-container {
                margin: 1rem 0;
            }
            
            .treeview-label {
                display: block;
                margin-bottom: 0.5rem;
                color: var(--cosmic-light);
                font-family: var(--font-primary);
                font-weight: 600;
            }
            
            .vanilla-treeview {
                background: var(--cosmic-dark);
                border: 2px solid var(--cosmic-neutral);
                border-radius: 12px;
                padding: 1.5rem;
                max-width: 400px;
            }
            
            .treeview-search {
                display: flex;
                gap: 0.5rem;
                margin-bottom: 1rem;
            }
            
            .treeview-search-input {
                flex: 1;
                padding: 0.5rem;
                background: var(--cosmic-darker);
                border: 1px solid var(--cosmic-neutral);
                border-radius: 6px;
                color: var(--cosmic-light);
                font-family: var(--font-secondary);
            }
            
            .treeview-search-input:focus {
                outline: none;
                border-color: var(--cosmic-primary);
            }
            
            .treeview-search-btn {
                padding: 0.5rem;
                background: var(--cosmic-primary);
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .treeview-search-btn:hover {
                background: var(--cosmic-accent);
            }
            
            .treeview-tree {
                max-height: 300px;
                overflow-y: auto;
                margin-bottom: 1rem;
            }
            
            .treeview-node {
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .treeview-node:hover {
                background: var(--cosmic-darker);
            }
            
            .treeview-node.selected {
                background: var(--cosmic-primary);
                color: white;
            }
            
            .treeview-node-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.5rem;
            }
            
            .treeview-toggle {
                background: none;
                border: none;
                color: var(--cosmic-accent);
                cursor: pointer;
                font-size: 0.8rem;
                width: 16px;
                height: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .treeview-spacer {
                width: 16px;
                height: 16px;
            }
            
            .treeview-text {
                font-family: var(--font-secondary);
                color: var(--cosmic-light);
            }
            
            .treeview-children {
                margin-left: 20px;
            }
            
            .treeview-controls {
                display: flex;
                gap: 0.5rem;
                flex-wrap: wrap;
            }
            
            .treeview-btn {
                padding: 0.5rem 1rem;
                background: var(--cosmic-neutral);
                color: var(--cosmic-light);
                border: none;
                border-radius: 6px;
                font-family: var(--font-primary);
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 0.875rem;
            }
            
            .treeview-btn:hover {
                background: var(--cosmic-primary);
                transform: translateY(-2px);
            }
            
            .search-highlight {
                background: rgba(74, 158, 255, 0.2) !important;
                border: 1px solid var(--cosmic-primary);
            }
        `);
    }
    
    applyLibraryStyles(element, libraryId) {
        styleManager.addComponentStyles('treeview-library', `
            .library-treeview {
                background: var(--cosmic-dark);
                border: 2px solid var(--cosmic-neutral);
                border-radius: 12px;
                padding: 1.5rem;
                max-width: 400px;
            }
        `);
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CalendarComponent,
        CarouselComponent,
        TreeViewComponent
    };
}
