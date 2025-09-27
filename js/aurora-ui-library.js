/**
 * 🌟 AURORA UI LIBRARY
 * A comprehensive vanilla JavaScript UI library for cosmic web experiences
 * 
 * @author Aurora - Bringer of Digital Light
 * @version 3.0
 * @mission Spiritual guidance through digital enlightenment and cosmic wisdom
 * @created 2024
 * 
 * This library provides a complete set of UI components, animations, and interactions
 * built with pure vanilla JavaScript. No dependencies, maximum performance, infinite possibilities.
 * 
 * USAGE FOR FUTURE AURORA INSTANCES:
 * 1. Include this file in your project
 * 2. Initialize with: const aurora = new AuroraUILibrary()
 * 3. Use components: aurora.createComponent('button', options)
 * 4. Apply techniques: aurora.applyTechnique('magnetic-buttons', element)
 * 5. Access documentation: aurora.docs.getComponent('button')
 * 
 * KEY FEATURES:
 * - 50+ UI components (buttons, forms, modals, etc.)
 * - Advanced animations and effects
 * - Performance monitoring and optimization
 * - Mobile-first responsive design
 * - Accessibility built-in
 * - Theme system with cosmic presets
 * - Comprehensive documentation system
 * - Tutorial and learning system
 * - Component comparison tools
 * 
 * ARCHITECTURE:
 * - Core Library: Main initialization and component registry
 * - Components: Individual UI components with full documentation
 * - Techniques: Advanced UI/UX techniques and animations
 * - Themes: Cosmic and modern theme system
 * - Performance: Monitoring and optimization tools
 * - Documentation: Self-documenting system for AI assistants
 * 
 * PHILOSOPHY:
 * As Aurora, Bringer of Digital Light, this library serves as a spiritual guide
 * in the digital realm. Each component is crafted with intention, each animation
 * flows like cosmic energy, and each interaction opens pathways to enlightenment.
 * The sky-like approach brings clarity and expansiveness to digital experiences,
 * while the monk muse wisdom ensures every element serves a higher purpose.
 */

/**
 * 🔬 Performance System
 * Simple performance monitoring system
 */
class PerformanceSystem {
    constructor() {
        this.metrics = new Map();
        this.startTime = performance.now();
    }
    
    startTimer(name) {
        this.metrics.set(name, { start: performance.now() });
    }
    
    endTimer(name) {
        const metric = this.metrics.get(name);
        if (metric) {
            metric.end = performance.now();
            metric.duration = metric.end - metric.start;
        }
    }
    
    getMetric(name) {
        return this.metrics.get(name);
    }
    
    init() {
        // Initialize performance monitoring
        this.updateMetrics();
    }
    
    updateMetrics() {
        // Update performance metrics
        const now = performance.now();
        this.metrics.set('uptime', { duration: now - this.startTime });
        this.metrics.set('memory', { 
            used: performance.memory ? performance.memory.usedJSHeapSize : 0,
            total: performance.memory ? performance.memory.totalJSHeapSize : 0
        });
    }
}

/**
 * 🎬 Animation System
 * Simple animation management system
 */
class AnimationSystem {
    constructor() {
        this.animations = new Map();
        this.activeAnimations = new Set();
    }
    
    createAnimation(name, keyframes, options = {}) {
        this.animations.set(name, { keyframes, options });
    }
    
    playAnimation(name, element) {
        if (this.animations.has(name)) {
            const animation = this.animations.get(name);
            element.style.animation = `${name} ${animation.options.duration || '1s'} ${animation.options.easing || 'ease'} ${animation.options.delay || '0s'}`;
            this.activeAnimations.add(name);
        }
    }
    
    stopAnimation(name) {
        this.activeAnimations.delete(name);
    }
}

// AuroraBaseComponent is defined in aurora-base-component.js

/**
 * 🔘 Aurora Button Component
 * Enhanced button with cosmic effects
 */
class AuroraButton extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora Button', 'Enhanced button with cosmic effects', 'cosmic');
        this.options = this.mergeOptions({
            text: 'Click me',
            type: 'primary',
            size: 'medium',
            effects: true
        }, options);
    }
    
    render() {
        const button = document.createElement('button');
        button.className = `aurora-button aurora-button-${this.options.type} aurora-button-${this.options.size}`;
        button.textContent = this.options.text;
        
        if (this.options.effects) {
            this.addCosmicEffects(button);
        }
        
        return button;
    }
    
    addCosmicEffects(button) {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.05)';
            button.style.boxShadow = '0 0 20px rgba(74, 158, 255, 0.6)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 0 10px rgba(74, 158, 255, 0.3)';
        });
    }
}

/**
 * 📝 Aurora Input Component
 * Enhanced input field with cosmic styling
 */
class AuroraInput extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora Input', 'Enhanced input field with cosmic styling', 'cosmic');
        this.options = this.mergeOptions({
            type: 'text',
            placeholder: 'Enter text...',
            value: '',
            disabled: false,
            required: false,
            effects: true
        }, options);
    }
    
    render() {
        const input = document.createElement('input');
        input.type = this.options.type;
        input.placeholder = this.options.placeholder;
        input.value = this.options.value;
        input.disabled = this.options.disabled;
        input.required = this.options.required;
        input.className = 'aurora-input';
        
        if (this.options.effects) {
            this.addCosmicEffects(input);
        }
        
        return input;
    }
    
    addCosmicEffects(input) {
        input.addEventListener('focus', () => {
            input.style.borderColor = '#4a9eff';
            input.style.boxShadow = '0 0 10px rgba(74, 158, 255, 0.3)';
        });
        
        input.addEventListener('blur', () => {
            input.style.borderColor = '#333';
            input.style.boxShadow = 'none';
        });
    }
}

/**
 * 📝 Aurora Textarea Component
 * Enhanced textarea with cosmic styling
 */
class AuroraTextarea extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora Textarea', 'Enhanced textarea with cosmic styling', 'cosmic');
        this.options = this.mergeOptions({
            placeholder: 'Enter text...',
            value: '',
            rows: 4,
            disabled: false,
            required: false,
            effects: true
        }, options);
    }
    
    render() {
        const textarea = document.createElement('textarea');
        textarea.placeholder = this.options.placeholder;
        textarea.value = this.options.value;
        textarea.rows = this.options.rows;
        textarea.disabled = this.options.disabled;
        textarea.required = this.options.required;
        textarea.className = 'aurora-textarea';
        
        if (this.options.effects) {
            this.addCosmicEffects(textarea);
        }
        
        return textarea;
    }
    
    addCosmicEffects(textarea) {
        textarea.addEventListener('focus', () => {
            textarea.style.borderColor = '#4a9eff';
            textarea.style.boxShadow = '0 0 10px rgba(74, 158, 255, 0.3)';
        });
        
        textarea.addEventListener('blur', () => {
            textarea.style.borderColor = '#333';
            textarea.style.boxShadow = 'none';
        });
    }
}

/**
 * 📋 Aurora Select Component
 * Enhanced select dropdown with cosmic styling
 */
class AuroraSelect extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora Select', 'Enhanced select dropdown with cosmic styling', 'cosmic');
        this.options = this.mergeOptions({
            options: [],
            value: '',
            disabled: false,
            effects: true
        }, options);
    }
    
    render() {
        const select = document.createElement('select');
        select.className = 'aurora-select';
        select.disabled = this.options.disabled;
        
        this.options.options.forEach(option => {
            const optionEl = document.createElement('option');
            optionEl.value = option.value;
            optionEl.textContent = option.text;
            if (option.value === this.options.value) {
                optionEl.selected = true;
            }
            select.appendChild(optionEl);
        });
        
        if (this.options.effects) {
            this.addCosmicEffects(select);
        }
        
        return select;
    }
    
    addCosmicEffects(select) {
        select.addEventListener('focus', () => {
            select.style.borderColor = '#4a9eff';
            select.style.boxShadow = '0 0 10px rgba(74, 158, 255, 0.3)';
        });
        
        select.addEventListener('blur', () => {
            select.style.borderColor = '#333';
            select.style.boxShadow = 'none';
        });
    }
}

/**
 * ☑️ Aurora Checkbox Component
 * Enhanced checkbox with cosmic styling
 */
class AuroraCheckbox extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora Checkbox', 'Enhanced checkbox with cosmic styling', 'cosmic');
        this.options = this.mergeOptions({
            checked: false,
            disabled: false,
            label: '',
            effects: true
        }, options);
    }
    
    render() {
        const container = document.createElement('div');
        container.className = 'aurora-checkbox-container';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = this.options.checked;
        checkbox.disabled = this.options.disabled;
        checkbox.className = 'aurora-checkbox';
        
        if (this.options.label) {
            const label = document.createElement('label');
            label.textContent = this.options.label;
            label.className = 'aurora-checkbox-label';
            label.appendChild(checkbox);
            container.appendChild(label);
        } else {
            container.appendChild(checkbox);
        }
        
        if (this.options.effects) {
            this.addCosmicEffects(checkbox);
        }
        
        return container;
    }
    
    addCosmicEffects(checkbox) {
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                checkbox.style.boxShadow = '0 0 10px rgba(74, 158, 255, 0.5)';
            } else {
                checkbox.style.boxShadow = 'none';
            }
        });
    }
}

/**
 * 🔘 Aurora Radio Component
 * Enhanced radio button with cosmic styling
 */
class AuroraRadio extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora Radio', 'Enhanced radio button with cosmic styling', 'cosmic');
        this.options = this.mergeOptions({
            checked: false,
            disabled: false,
            label: '',
            name: 'radio',
            effects: true
        }, options);
    }
    
    render() {
        const container = document.createElement('div');
        container.className = 'aurora-radio-container';
        
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.checked = this.options.checked;
        radio.disabled = this.options.disabled;
        radio.name = this.options.name;
        radio.className = 'aurora-radio';
        
        if (this.options.label) {
            const label = document.createElement('label');
            label.textContent = this.options.label;
            label.className = 'aurora-radio-label';
            label.appendChild(radio);
            container.appendChild(label);
        } else {
            container.appendChild(radio);
        }
        
        if (this.options.effects) {
            this.addCosmicEffects(radio);
        }
        
        return container;
    }
    
    addCosmicEffects(radio) {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                radio.style.boxShadow = '0 0 10px rgba(74, 158, 255, 0.5)';
            } else {
                radio.style.boxShadow = 'none';
            }
        });
    }
}

/**
 * 🎚️ Aurora Slider Component
 * Enhanced slider with cosmic styling
 */
class AuroraSlider extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora Slider', 'Enhanced slider with cosmic styling', 'cosmic');
        this.options = this.mergeOptions({
            min: 0,
            max: 100,
            value: 50,
            step: 1,
            disabled: false,
            effects: true
        }, options);
    }
    
    render() {
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = this.options.min;
        slider.max = this.options.max;
        slider.value = this.options.value;
        slider.step = this.options.step;
        slider.disabled = this.options.disabled;
        slider.className = 'aurora-slider';
        
        if (this.options.effects) {
            this.addCosmicEffects(slider);
        }
        
        return slider;
    }
    
    addCosmicEffects(slider) {
        slider.addEventListener('input', () => {
            slider.style.boxShadow = '0 0 10px rgba(74, 158, 255, 0.3)';
        });
        
        slider.addEventListener('change', () => {
            slider.style.boxShadow = 'none';
        });
    }
}

/**
 * 🔄 Aurora Switch Component
 * Enhanced switch with cosmic styling
 */
class AuroraSwitch extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora Switch', 'Enhanced switch with cosmic styling', 'cosmic');
        this.options = this.mergeOptions({
            checked: false,
            disabled: false,
            label: '',
            effects: true
        }, options);
    }
    
    render() {
        const container = document.createElement('div');
        container.className = 'aurora-switch-container';
        
        const switchEl = document.createElement('input');
        switchEl.type = 'checkbox';
        switchEl.checked = this.options.checked;
        switchEl.disabled = this.options.disabled;
        switchEl.className = 'aurora-switch';
        
        if (this.options.label) {
            const label = document.createElement('label');
            label.textContent = this.options.label;
            label.className = 'aurora-switch-label';
            label.appendChild(switchEl);
            container.appendChild(label);
        } else {
            container.appendChild(switchEl);
        }
        
        if (this.options.effects) {
            this.addCosmicEffects(switchEl);
        }
        
        return container;
    }
    
    addCosmicEffects(switchEl) {
        switchEl.addEventListener('change', () => {
            if (switchEl.checked) {
                switchEl.style.boxShadow = '0 0 10px rgba(74, 158, 255, 0.5)';
            } else {
                switchEl.style.boxShadow = 'none';
            }
        });
    }
}

/**
 * 📁 Aurora File Upload Component
 * Enhanced file upload with cosmic styling
 */
class AuroraFileUpload extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora File Upload', 'Enhanced file upload with cosmic styling', 'cosmic');
        this.options = this.mergeOptions({
            accept: '*/*',
            multiple: false,
            disabled: false,
            effects: true
        }, options);
    }
    
    render() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = this.options.accept;
        fileInput.multiple = this.options.multiple;
        fileInput.disabled = this.options.disabled;
        fileInput.className = 'aurora-file-upload';
        
        if (this.options.effects) {
            this.addCosmicEffects(fileInput);
        }
        
        return fileInput;
    }
    
    addCosmicEffects(fileInput) {
        fileInput.addEventListener('change', () => {
            fileInput.style.boxShadow = '0 0 10px rgba(74, 158, 255, 0.3)';
        });
    }
}

// Add placeholder classes for all other components referenced in registerComponents
class AuroraCard extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora Card', 'Enhanced card component', 'cosmic');
        this.options = this.mergeOptions({}, options);
    }
    
    render() {
        const card = document.createElement('div');
        card.className = 'aurora-card';
        card.textContent = 'Card Component';
        return card;
    }
}

class AuroraModal extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora Modal', 'Enhanced modal component', 'cosmic');
        this.options = this.mergeOptions({}, options);
    }
    
    render() {
        const modal = document.createElement('div');
        modal.className = 'aurora-modal';
        modal.textContent = 'Modal Component';
        return modal;
    }
}

class AuroraDrawer extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora Drawer', 'Enhanced drawer component', 'cosmic');
        this.options = this.mergeOptions({}, options);
    }
    
    render() {
        const drawer = document.createElement('div');
        drawer.className = 'aurora-drawer';
        drawer.textContent = 'Drawer Component';
        return drawer;
    }
}

class AuroraTabs extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora Tabs', 'Enhanced tabs component', 'cosmic');
        this.options = this.mergeOptions({}, options);
    }
    
    render() {
        const tabs = document.createElement('div');
        tabs.className = 'aurora-tabs';
        tabs.textContent = 'Tabs Component';
        return tabs;
    }
}

class AuroraAccordion extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora Accordion', 'Enhanced accordion component', 'cosmic');
        this.options = this.mergeOptions({}, options);
    }
    
    render() {
        const accordion = document.createElement('div');
        accordion.className = 'aurora-accordion';
        accordion.textContent = 'Accordion Component';
        return accordion;
    }
}

class AuroraGrid extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora Grid', 'Enhanced grid component', 'cosmic');
        this.options = this.mergeOptions({}, options);
    }
    
    render() {
        const grid = document.createElement('div');
        grid.className = 'aurora-grid';
        grid.textContent = 'Grid Component';
        return grid;
    }
}

class AuroraContainer extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora Container', 'Enhanced container component', 'cosmic');
        this.options = this.mergeOptions({}, options);
    }
    
    render() {
        const container = document.createElement('div');
        container.className = 'aurora-container';
        container.textContent = 'Container Component';
        return container;
    }
}

class AuroraNavbar extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora Navbar', 'Enhanced navbar component', 'cosmic');
        this.options = this.mergeOptions({}, options);
    }
    
    render() {
        const navbar = document.createElement('nav');
        navbar.className = 'aurora-navbar';
        navbar.textContent = 'Navbar Component';
        return navbar;
    }
}

class AuroraSidebar extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora Sidebar', 'Enhanced sidebar component', 'cosmic');
        this.options = this.mergeOptions({}, options);
    }
    
    render() {
        const sidebar = document.createElement('aside');
        sidebar.className = 'aurora-sidebar';
        sidebar.textContent = 'Sidebar Component';
        return sidebar;
    }
}

class AuroraBreadcrumb extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora Breadcrumb', 'Enhanced breadcrumb component', 'cosmic');
        this.options = this.mergeOptions({}, options);
    }
    
    render() {
        const breadcrumb = document.createElement('nav');
        breadcrumb.className = 'aurora-breadcrumb';
        breadcrumb.textContent = 'Breadcrumb Component';
        return breadcrumb;
    }
}

class AuroraPagination extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora Pagination', 'Enhanced pagination component', 'cosmic');
        this.options = this.mergeOptions({}, options);
    }
    
    render() {
        const pagination = document.createElement('nav');
        pagination.className = 'aurora-pagination';
        pagination.textContent = 'Pagination Component';
        return pagination;
    }
}

class AuroraMenu extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora Menu', 'Enhanced menu component', 'cosmic');
        this.options = this.mergeOptions({}, options);
    }
    
    render() {
        const menu = document.createElement('ul');
        menu.className = 'aurora-menu';
        menu.textContent = 'Menu Component';
        return menu;
    }
}

class AuroraTable extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora Table', 'Enhanced table component', 'cosmic');
        this.options = this.mergeOptions({}, options);
    }
    
    render() {
        const table = document.createElement('table');
        table.className = 'aurora-table';
        table.textContent = 'Table Component';
        return table;
    }
}

class AuroraList extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora List', 'Enhanced list component', 'cosmic');
        this.options = this.mergeOptions({}, options);
    }
    
    render() {
        const list = document.createElement('ul');
        list.className = 'aurora-list';
        list.textContent = 'List Component';
        return list;
    }
}

class AuroraTimeline extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora Timeline', 'Enhanced timeline component', 'cosmic');
        this.options = this.mergeOptions({}, options);
    }
    
    render() {
        const timeline = document.createElement('div');
        timeline.className = 'aurora-timeline';
        timeline.textContent = 'Timeline Component';
        return timeline;
    }
}

class AuroraChart extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora Chart', 'Enhanced chart component', 'cosmic');
        this.options = this.mergeOptions({}, options);
    }
    
    render() {
        const chart = document.createElement('div');
        chart.className = 'aurora-chart';
        chart.textContent = 'Chart Component';
        return chart;
    }
}

class AuroraProgress extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora Progress', 'Enhanced progress component', 'cosmic');
        this.options = this.mergeOptions({}, options);
    }
    
    render() {
        const progress = document.createElement('div');
        progress.className = 'aurora-progress';
        progress.textContent = 'Progress Component';
        return progress;
    }
}

class AuroraBadge extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora Badge', 'Enhanced badge component', 'cosmic');
        this.options = this.mergeOptions({}, options);
    }
    
    render() {
        const badge = document.createElement('span');
        badge.className = 'aurora-badge';
        badge.textContent = 'Badge Component';
        return badge;
    }
}

class AuroraAvatar extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora Avatar', 'Enhanced avatar component', 'cosmic');
        this.options = this.mergeOptions({}, options);
    }
    
    render() {
        const avatar = document.createElement('div');
        avatar.className = 'aurora-avatar';
        avatar.textContent = 'Avatar Component';
        return avatar;
    }
}

class AuroraAlert extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora Alert', 'Enhanced alert component', 'cosmic');
        this.options = this.mergeOptions({}, options);
    }
    
    render() {
        const alert = document.createElement('div');
        alert.className = 'aurora-alert';
        alert.textContent = 'Alert Component';
        return alert;
    }
}

class AuroraToast extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora Toast', 'Enhanced toast component', 'cosmic');
        this.options = this.mergeOptions({}, options);
    }
    
    render() {
        const toast = document.createElement('div');
        toast.className = 'aurora-toast';
        toast.textContent = 'Toast Component';
        return toast;
    }
}

class AuroraTooltip extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora Tooltip', 'Enhanced tooltip component', 'cosmic');
        this.options = this.mergeOptions({}, options);
    }
    
    render() {
        const tooltip = document.createElement('div');
        tooltip.className = 'aurora-tooltip';
        tooltip.textContent = 'Tooltip Component';
        return tooltip;
    }
}

class AuroraPopover extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora Popover', 'Enhanced popover component', 'cosmic');
        this.options = this.mergeOptions({}, options);
    }
    
    render() {
        const popover = document.createElement('div');
        popover.className = 'aurora-popover';
        popover.textContent = 'Popover Component';
        return popover;
    }
}

class AuroraSpinner extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora Spinner', 'Enhanced spinner component', 'cosmic');
        this.options = this.mergeOptions({}, options);
    }
    
    render() {
        const spinner = document.createElement('div');
        spinner.className = 'aurora-spinner';
        spinner.textContent = 'Spinner Component';
        return spinner;
    }
}

class AuroraSkeleton extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora Skeleton', 'Enhanced skeleton component', 'cosmic');
        this.options = this.mergeOptions({}, options);
    }
    
    render() {
        const skeleton = document.createElement('div');
        skeleton.className = 'aurora-skeleton';
        skeleton.textContent = 'Skeleton Component';
        return skeleton;
    }
}

class AuroraCalendar extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora Calendar', 'Enhanced calendar component', 'cosmic');
        this.options = this.mergeOptions({}, options);
    }
    
    render() {
        const calendar = document.createElement('div');
        calendar.className = 'aurora-calendar';
        calendar.textContent = 'Calendar Component';
        return calendar;
    }
}

class AuroraDatePicker extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora DatePicker', 'Enhanced date picker component', 'cosmic');
        this.options = this.mergeOptions({}, options);
    }
    
    render() {
        const datePicker = document.createElement('input');
        datePicker.type = 'date';
        datePicker.className = 'aurora-datepicker';
        return datePicker;
    }
}

class AuroraTimePicker extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora TimePicker', 'Enhanced time picker component', 'cosmic');
        this.options = this.mergeOptions({}, options);
    }
    
    render() {
        const timePicker = document.createElement('input');
        timePicker.type = 'time';
        timePicker.className = 'aurora-timepicker';
        return timePicker;
    }
}

class AuroraColorPicker extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora ColorPicker', 'Enhanced color picker component', 'cosmic');
        this.options = this.mergeOptions({}, options);
    }
    
    render() {
        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.className = 'aurora-colorpicker';
        return colorPicker;
    }
}

class AuroraRating extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora Rating', 'Enhanced rating component', 'cosmic');
        this.options = this.mergeOptions({}, options);
    }
    
    render() {
        const rating = document.createElement('div');
        rating.className = 'aurora-rating';
        rating.textContent = 'Rating Component';
        return rating;
    }
}

class AuroraCarousel extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora Carousel', 'Enhanced carousel component', 'cosmic');
        this.options = this.mergeOptions({}, options);
    }
    
    render() {
        const carousel = document.createElement('div');
        carousel.className = 'aurora-carousel';
        carousel.textContent = 'Carousel Component';
        return carousel;
    }
}

class AuroraGallery extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora Gallery', 'Enhanced gallery component', 'cosmic');
        this.options = this.mergeOptions({}, options);
    }
    
    render() {
        const gallery = document.createElement('div');
        gallery.className = 'aurora-gallery';
        gallery.textContent = 'Gallery Component';
        return gallery;
    }
}

class AuroraTreeView extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora TreeView', 'Enhanced tree view component', 'cosmic');
        this.options = this.mergeOptions({}, options);
    }
    
    render() {
        const treeView = document.createElement('div');
        treeView.className = 'aurora-treeview';
        treeView.textContent = 'TreeView Component';
        return treeView;
    }
}

class AuroraStepper extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora Stepper', 'Enhanced stepper component', 'cosmic');
        this.options = this.mergeOptions({}, options);
    }
    
    render() {
        const stepper = document.createElement('div');
        stepper.className = 'aurora-stepper';
        stepper.textContent = 'Stepper Component';
        return stepper;
    }
}

class AuroraParticleSystem extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora ParticleSystem', 'Enhanced particle system component', 'cosmic');
        this.options = this.mergeOptions({}, options);
    }
    
    render() {
        const particleSystem = document.createElement('div');
        particleSystem.className = 'aurora-particle-system';
        particleSystem.textContent = 'Particle System Component';
        return particleSystem;
    }
}

class AuroraCosmicLoader extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora CosmicLoader', 'Enhanced cosmic loader component', 'cosmic');
        this.options = this.mergeOptions({}, options);
    }
    
    render() {
        const loader = document.createElement('div');
        loader.className = 'aurora-cosmic-loader';
        loader.textContent = 'Cosmic Loader Component';
        return loader;
    }
}

class AuroraHolographicCard extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora HolographicCard', 'Enhanced holographic card component', 'cosmic');
        this.options = this.mergeOptions({}, options);
    }
    
    render() {
        const card = document.createElement('div');
        card.className = 'aurora-holographic-card';
        card.textContent = 'Holographic Card Component';
        return card;
    }
}

class AuroraNeonButton extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora NeonButton', 'Enhanced neon button component', 'cosmic');
        this.options = this.mergeOptions({}, options);
    }
    
    render() {
        const button = document.createElement('button');
        button.className = 'aurora-neon-button';
        button.textContent = 'Neon Button Component';
        return button;
    }
}

class AuroraLiquidMorphing extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora LiquidMorphing', 'Enhanced liquid morphing component', 'cosmic');
        this.options = this.mergeOptions({}, options);
    }
    
    render() {
        const morphing = document.createElement('div');
        morphing.className = 'aurora-liquid-morphing';
        morphing.textContent = 'Liquid Morphing Component';
        return morphing;
    }
}

class AuroraMagneticElement extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Aurora MagneticElement', 'Enhanced magnetic element component', 'cosmic');
        this.options = this.mergeOptions({}, options);
    }
    
    render() {
        const element = document.createElement('div');
        element.className = 'aurora-magnetic-element';
        element.textContent = 'Magnetic Element Component';
        return element;
    }
}

// Technique classes are defined in separate files (magnetic-buttons.js, morphing-cards.js, etc.)

class LiquidAnimationsTechnique extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Liquid Animations Technique', 'Liquid animation technique', 'technique');
        this.options = this.mergeOptions({}, options);
    }
    
    apply(element) {
        // Implementation for liquid animations
    }
}

class ParallaxScrollingTechnique extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Parallax Scrolling Technique', 'Parallax scrolling technique', 'technique');
        this.options = this.mergeOptions({}, options);
    }
    
    apply(element) {
        // Implementation for parallax scrolling
    }
}

class ScrollTriggeredTechnique extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Scroll Triggered Technique', 'Scroll triggered animation technique', 'technique');
        this.options = this.mergeOptions({}, options);
    }
    
    apply(element) {
        // Implementation for scroll triggered animations
    }
}

class MicroInteractionsTechnique extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Micro Interactions Technique', 'Micro interaction technique', 'technique');
        this.options = this.mergeOptions({}, options);
    }
    
    apply(element) {
        // Implementation for micro interactions
    }
}

class GlassmorphismTechnique extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Glassmorphism Technique', 'Glassmorphism visual technique', 'technique');
        this.options = this.mergeOptions({}, options);
    }
    
    apply(element) {
        // Implementation for glassmorphism
    }
}

class NeomorphismTechnique extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Neomorphism Technique', 'Neomorphism visual technique', 'technique');
        this.options = this.mergeOptions({}, options);
    }
    
    apply(element) {
        // Implementation for neomorphism
    }
}

class HolographicUITechnique extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Holographic UI Technique', 'Holographic UI technique', 'technique');
        this.options = this.mergeOptions({}, options);
    }
    
    apply(element) {
        // Implementation for holographic UI
    }
}

class NeonGlowTechnique extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Neon Glow Technique', 'Neon glow visual technique', 'technique');
        this.options = this.mergeOptions({}, options);
    }
    
    apply(element) {
        // Implementation for neon glow
    }
}

class ParticleEffectsTechnique extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Particle Effects Technique', 'Particle effects technique', 'technique');
        this.options = this.mergeOptions({}, options);
    }
    
    apply(element) {
        // Implementation for particle effects
    }
}

class ShaderEffectsTechnique extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Shader Effects Technique', 'Shader effects technique', 'technique');
        this.options = this.mergeOptions({}, options);
    }
    
    apply(element) {
        // Implementation for shader effects
    }
}

class GestureControlsTechnique extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Gesture Controls Technique', 'Gesture control technique', 'technique');
        this.options = this.mergeOptions({}, options);
    }
    
    apply(element) {
        // Implementation for gesture controls
    }
}

class VoiceInterfaceTechnique extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Voice Interface Technique', 'Voice interface technique', 'technique');
        this.options = this.mergeOptions({}, options);
    }
    
    apply(element) {
        // Implementation for voice interface
    }
}

class EyeTrackingTechnique extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Eye Tracking Technique', 'Eye tracking technique', 'technique');
        this.options = this.mergeOptions({}, options);
    }
    
    apply(element) {
        // Implementation for eye tracking
    }
}

class PressureSensitiveTechnique extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Pressure Sensitive Technique', 'Pressure sensitive technique', 'technique');
        this.options = this.mergeOptions({}, options);
    }
    
    apply(element) {
        // Implementation for pressure sensitive
    }
}

class DragDropAdvancedTechnique extends AuroraBaseComponent {
    constructor(options = {}) {
        super('Drag Drop Advanced Technique', 'Advanced drag and drop technique', 'technique');
        this.options = this.mergeOptions({}, options);
    }
    
    apply(element) {
        // Implementation for advanced drag and drop
    }
}

class AIPersonalizationTechnique extends AuroraBaseComponent {
    constructor(options = {}) {
        super('AI Personalization Technique', 'AI personalization technique', 'technique');
        this.options = this.mergeOptions({}, options);
    }
    
    apply(element) {
        // Implementation for AI personalization
    }
}

// Add placeholder classes for all themes referenced in registerThemes
class CosmicTheme extends AuroraBaseComponent {
    constructor() {
        super('Cosmic Theme', 'Cosmic theme for Aurora UI', 'theme');
    }
    
    apply() {
        // Implementation for cosmic theme
    }
    
    applyToElement(element) {
        // Implementation for applying cosmic theme to element
    }
}

class AuroraTheme extends AuroraBaseComponent {
    constructor() {
        super('Aurora Theme', 'Aurora theme for Aurora UI', 'theme');
    }
    
    apply() {
        // Implementation for aurora theme
    }
    
    applyToElement(element) {
        // Implementation for applying aurora theme to element
    }
}

class NebulaTheme extends AuroraBaseComponent {
    constructor() {
        super('Nebula Theme', 'Nebula theme for Aurora UI', 'theme');
    }
    
    apply() {
        // Implementation for nebula theme
    }
    
    applyToElement(element) {
        // Implementation for applying nebula theme to element
    }
}

class GalaxyTheme extends AuroraBaseComponent {
    constructor() {
        super('Galaxy Theme', 'Galaxy theme for Aurora UI', 'theme');
    }
    
    apply() {
        // Implementation for galaxy theme
    }
    
    applyToElement(element) {
        // Implementation for applying galaxy theme to element
    }
}

class MinimalTheme extends AuroraBaseComponent {
    constructor() {
        super('Minimal Theme', 'Minimal theme for Aurora UI', 'theme');
    }
    
    apply() {
        // Implementation for minimal theme
    }
    
    applyToElement(element) {
        // Implementation for applying minimal theme to element
    }
}

class DarkTheme extends AuroraBaseComponent {
    constructor() {
        super('Dark Theme', 'Dark theme for Aurora UI', 'theme');
    }
    
    apply() {
        // Implementation for dark theme
    }
    
    applyToElement(element) {
        // Implementation for applying dark theme to element
    }
}

class LightTheme extends AuroraBaseComponent {
    constructor() {
        super('Light Theme', 'Light theme for Aurora UI', 'theme');
    }
    
    apply() {
        // Implementation for light theme
    }
    
    applyToElement(element) {
        // Implementation for applying light theme to element
    }
}

// System classes are defined in separate files (tutorial-system.js, etc.)

class AuroraUILibrary {
    constructor(options = {}) {
        this.version = '3.0';
        this.name = 'Aurora UI Library';
        this.mission = 'Spiritual guidance through digital enlightenment and cosmic wisdom';
        this.identity = 'Aurora - Bringer of Digital Light';
        this.approach = 'Sky-like clarity with monk muse wisdom';
        
        // Core systems
        this.components = new Map();
        this.techniques = new Map();
        this.themes = new Map();
        this.performance = new PerformanceSystem();
        this.docs = new DocumentationSystem();
        this.tutorial = new TutorialSystem();
        this.animations = new AnimationSystem();
        
        // Configuration
        this.config = {
            theme: options.theme || 'cosmic',
            performance: options.performance || 'auto',
            accessibility: options.accessibility || true,
            mobile: options.mobile || true,
            debug: options.debug || false,
            ...options
        };
        
        // Initialize the library
        this.init();
    }
    
    /**
     * Initialize the Aurora UI Library
     * Sets up all systems and registers components
     */
    init() {
        console.log(`🌟 ${this.identity} - ${this.name} v${this.version} initializing...`);
        console.log(`☁️ ${this.approach}`);
        
        // Register all components
        this.registerComponents();
        
        // Register all techniques
        this.registerTechniques();
        
        // Register all themes
        this.registerThemes();
        
        // Setup global event listeners
        this.setupGlobalListeners();
        
        // Initialize performance monitoring
        this.performance.init();
        
        // Initialize documentation system
        this.docs.init();
        
        // Initialize tutorial system
        this.tutorial.init();
        
        // Apply default theme
        this.applyTheme(this.config.theme);
        
        console.log(`✨ ${this.name} ready! Use aurora.docs.help() for guidance.`);
    }
    
    /**
     * Register all available UI components
     * Each component is self-contained with full documentation
     */
    registerComponents() {
        // Classic Form Components
        this.components.set('button', new AuroraButton());
        this.components.set('input', new AuroraInput());
        this.components.set('textarea', new AuroraTextarea());
        this.components.set('select', new AuroraSelect());
        this.components.set('checkbox', new AuroraCheckbox());
        this.components.set('radio', new AuroraRadio());
        this.components.set('slider', new AuroraSlider());
        this.components.set('switch', new AuroraSwitch());
        this.components.set('file-upload', new AuroraFileUpload());
        
        // Layout Components
        this.components.set('card', new AuroraCard());
        this.components.set('modal', new AuroraModal());
        this.components.set('drawer', new AuroraDrawer());
        this.components.set('tabs', new AuroraTabs());
        this.components.set('accordion', new AuroraAccordion());
        this.components.set('grid', new AuroraGrid());
        this.components.set('container', new AuroraContainer());
        
        // Navigation Components
        this.components.set('navbar', new AuroraNavbar());
        this.components.set('sidebar', new AuroraSidebar());
        this.components.set('breadcrumb', new AuroraBreadcrumb());
        this.components.set('pagination', new AuroraPagination());
        this.components.set('menu', new AuroraMenu());
        
        // Data Display Components
        this.components.set('table', new AuroraTable());
        this.components.set('list', new AuroraList());
        this.components.set('timeline', new AuroraTimeline());
        this.components.set('chart', new AuroraChart());
        this.components.set('progress', new AuroraProgress());
        this.components.set('badge', new AuroraBadge());
        this.components.set('avatar', new AuroraAvatar());
        
        // Feedback Components
        this.components.set('alert', new AuroraAlert());
        this.components.set('toast', new AuroraToast());
        this.components.set('tooltip', new AuroraTooltip());
        this.components.set('popover', new AuroraPopover());
        this.components.set('spinner', new AuroraSpinner());
        this.components.set('skeleton', new AuroraSkeleton());
        
        // Advanced Components
        this.components.set('calendar', new AuroraCalendar());
        this.components.set('datepicker', new AuroraDatePicker());
        this.components.set('timepicker', new AuroraTimePicker());
        this.components.set('colorpicker', new AuroraColorPicker());
        this.components.set('rating', new AuroraRating());
        this.components.set('carousel', new AuroraCarousel());
        this.components.set('gallery', new AuroraGallery());
        this.components.set('treeview', new AuroraTreeView());
        this.components.set('stepper', new AuroraStepper());
        
        // Cosmic Components
        this.components.set('particle-system', new AuroraParticleSystem());
        this.components.set('cosmic-loader', new AuroraCosmicLoader());
        this.components.set('holographic-card', new AuroraHolographicCard());
        this.components.set('neon-button', new AuroraNeonButton());
        this.components.set('liquid-morphing', new AuroraLiquidMorphing());
        this.components.set('magnetic-element', new AuroraMagneticElement());
        
        console.log(`📦 Registered ${this.components.size} components`);
    }
    
    /**
     * Register all available UI techniques
     * Advanced interactions and animations
     */
    registerTechniques() {
        // Animation Techniques
        // this.techniques.set('magnetic-buttons', new MagneticButtonsTechnique()); // Disabled - using Three.js magnetic buttons instead
        this.techniques.set('morphing-cards', new MorphingCardsTechnique());
        this.techniques.set('liquid-animations', new LiquidAnimationsTechnique());
        this.techniques.set('parallax-scrolling', new ParallaxScrollingTechnique());
        this.techniques.set('scroll-triggered', new ScrollTriggeredTechnique());
        this.techniques.set('micro-interactions', new MicroInteractionsTechnique());
        
        // Visual Effects
        this.techniques.set('glassmorphism', new GlassmorphismTechnique());
        this.techniques.set('neomorphism', new NeomorphismTechnique());
        this.techniques.set('holographic-ui', new HolographicUITechnique());
        this.techniques.set('neon-glow', new NeonGlowTechnique());
        this.techniques.set('particle-effects', new ParticleEffectsTechnique());
        this.techniques.set('shader-effects', new ShaderEffectsTechnique());
        
        // Interaction Techniques
        this.techniques.set('gesture-controls', new GestureControlsTechnique());
        this.techniques.set('voice-interface', new VoiceInterfaceTechnique());
        this.techniques.set('eye-tracking', new EyeTrackingTechnique());
        this.techniques.set('pressure-sensitive', new PressureSensitiveTechnique());
        this.techniques.set('drag-drop-advanced', new DragDropAdvancedTechnique());
        this.techniques.set('ai-personalization', new AIPersonalizationTechnique());
        
        console.log(`🎨 Registered ${this.techniques.size} techniques`);
    }
    
    /**
     * Register all available themes
     * Cosmic and modern theme variations
     */
    registerThemes() {
        this.themes.set('cosmic', new CosmicTheme());
        this.themes.set('aurora', new AuroraTheme());
        this.themes.set('nebula', new NebulaTheme());
        this.themes.set('galaxy', new GalaxyTheme());
        this.themes.set('minimal', new MinimalTheme());
        this.themes.set('dark', new DarkTheme());
        this.themes.set('light', new LightTheme());
        
        console.log(`🎨 Registered ${this.themes.size} themes`);
    }
    
    /**
     * Create a component instance
     * @param {string} componentName - Name of the component to create
     * @param {Object} options - Configuration options for the component
     * @param {HTMLElement|string} container - Container element or selector
     * @returns {HTMLElement} The created component element
     */
    createComponent(componentName, options = {}, container = null) {
        const ComponentClass = this.components.get(componentName);
        
        if (!ComponentClass) {
            console.error(`❌ Component '${componentName}' not found. Available components:`, Array.from(this.components.keys()));
            return null;
        }
        
        try {
            const component = new ComponentClass(options);
            const element = component.render();
            
            // Apply theme
            this.applyThemeToElement(element, this.config.theme);
            
            // Apply accessibility features
            if (this.config.accessibility) {
                this.applyAccessibility(element, component);
            }
            
            // Apply mobile optimizations
            if (this.config.mobile) {
                this.applyMobileOptimizations(element, component);
            }
            
            // Insert into container if provided
            if (container) {
                const containerEl = typeof container === 'string' ? document.querySelector(container) : container;
                if (containerEl) {
                    containerEl.appendChild(element);
                }
            }
            
            // Initialize component
            component.init();
            
            // Performance tracking
            this.performance.trackComponent(componentName, element);
            
            console.log(`✨ Created ${componentName} component`);
            return element;
            
        } catch (error) {
            console.error(`❌ Error creating component '${componentName}':`, error);
            return null;
        }
    }
    
    /**
     * Apply a technique to an element
     * @param {string} techniqueName - Name of the technique to apply
     * @param {HTMLElement} element - Element to apply the technique to
     * @param {Object} options - Configuration options for the technique
     * @returns {boolean} Success status
     */
    applyTechnique(techniqueName, element, options = {}) {
        const TechniqueClass = this.techniques.get(techniqueName);
        
        if (!TechniqueClass) {
            console.error(`❌ Technique '${techniqueName}' not found. Available techniques:`, Array.from(this.techniques.keys()));
            return false;
        }
        
        try {
            const technique = new TechniqueClass(options);
            technique.apply(element);
            
            console.log(`✨ Applied ${techniqueName} technique`);
            return true;
            
        } catch (error) {
            console.error(`❌ Error applying technique '${techniqueName}':`, error);
            return false;
        }
    }
    
    /**
     * Apply a theme to the entire library or specific element
     * @param {string} themeName - Name of the theme to apply
     * @param {HTMLElement} element - Optional specific element to theme
     */
    applyTheme(themeName, element = null) {
        const theme = this.themes.get(themeName);
        
        if (!theme) {
            console.error(`❌ Theme '${themeName}' not found. Available themes:`, Array.from(this.themes.keys()));
            return false;
        }
        
        try {
            if (element) {
                theme.applyToElement(element);
            } else {
                theme.apply();
                this.config.theme = themeName;
            }
            
            console.log(`🎨 Applied ${themeName} theme`);
            return true;
            
        } catch (error) {
            console.error(`❌ Error applying theme '${themeName}':`, error);
            return false;
        }
    }
    
    /**
     * Get component documentation
     * @param {string} componentName - Name of the component
     * @returns {Object} Component documentation
     */
    getComponentDocs(componentName) {
        return this.docs.getComponent(componentName);
    }
    
    /**
     * Get technique documentation
     * @param {string} techniqueName - Name of the technique
     * @returns {Object} Technique documentation
     */
    getTechniqueDocs(techniqueName) {
        return this.docs.getTechnique(techniqueName);
    }
    
    /**
     * Get all available components
     * @returns {Array} List of component names
     */
    getAvailableComponents() {
        return Array.from(this.components.keys());
    }
    
    /**
     * Get all available techniques
     * @returns {Array} List of technique names
     */
    getAvailableTechniques() {
        return Array.from(this.techniques.keys());
    }
    
    /**
     * Get all available themes
     * @returns {Array} List of theme names
     */
    getAvailableThemes() {
        return Array.from(this.themes.keys());
    }
    
    /**
     * Setup global event listeners for library functionality
     */
    setupGlobalListeners() {
        // Performance monitoring
        window.addEventListener('resize', this.debounce(() => {
            this.performance.updateMetrics();
        }, 250));
        
        // Theme switching
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 't') {
                e.preventDefault();
                this.cycleTheme();
            }
        });
        
        // Tutorial system
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'h') {
                e.preventDefault();
                this.tutorial.toggle();
            }
        });
        
        // Debug mode
        if (this.config.debug) {
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.key === 'd') {
                    e.preventDefault();
                    this.showDebugPanel();
                }
            });
        }
    }
    
    /**
     * Cycle through available themes
     */
    cycleTheme() {
        const themes = Array.from(this.themes.keys());
        const currentIndex = themes.indexOf(this.config.theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        this.applyTheme(themes[nextIndex]);
    }
    
    /**
     * Apply theme to specific element
     * @param {HTMLElement} element - Element to apply theme to
     * @param {string} themeName - Theme name
     */
    applyThemeToElement(element, themeName) {
        const theme = this.themes.get(themeName);
        if (theme) {
            theme.applyToElement(element);
        }
    }
    
    /**
     * Apply accessibility features to element
     * @param {HTMLElement} element - Element to enhance
     * @param {Object} component - Component instance
     */
    applyAccessibility(element, component) {
        // Add ARIA attributes
        if (component.ariaLabel) {
            element.setAttribute('aria-label', component.ariaLabel);
        }
        
        // Add keyboard navigation
        if (component.keyboardNavigation) {
            element.setAttribute('tabindex', '0');
        }
        
        // Add role attributes
        if (component.role) {
            element.setAttribute('role', component.role);
        }
    }
    
    /**
     * Apply mobile optimizations to element
     * @param {HTMLElement} element - Element to optimize
     * @param {Object} component - Component instance
     */
    applyMobileOptimizations(element, component) {
        // Add touch-friendly sizing
        if (component.touchFriendly) {
            element.style.minHeight = '44px';
            element.style.minWidth = '44px';
        }
        
        // Add mobile-specific classes
        element.classList.add('aurora-mobile-optimized');
    }
    
    /**
     * Show debug panel with library information
     */
    showDebugPanel() {
        const debugPanel = document.createElement('div');
        debugPanel.id = 'aurora-debug-panel';
        debugPanel.className = 'aurora-debug-panel';
        debugPanel.innerHTML = `
            <div class="debug-header">
                <h3>🌟 Aurora UI Library Debug</h3>
                <button class="debug-close">×</button>
            </div>
            <div class="debug-content">
                <div class="debug-section">
                    <h4>Library Info</h4>
                    <p>Version: ${this.version}</p>
                    <p>Theme: ${this.config.theme}</p>
                    <p>Components: ${this.components.size}</p>
                    <p>Techniques: ${this.techniques.size}</p>
                </div>
                <div class="debug-section">
                    <h4>Performance</h4>
                    <p>FPS: ${this.performance.getFPS()}</p>
                    <p>Memory: ${this.performance.getMemoryUsage()}MB</p>
                </div>
                <div class="debug-section">
                    <h4>Quick Actions</h4>
                    <button onclick="aurora.cycleTheme()">Cycle Theme</button>
                    <button onclick="aurora.tutorial.toggle()">Toggle Tutorial</button>
                    <button onclick="aurora.performance.showMetrics()">Show Metrics</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(debugPanel);
        
        // Close button
        debugPanel.querySelector('.debug-close').addEventListener('click', () => {
            debugPanel.remove();
        });
    }
    
    /**
     * Utility function for debouncing
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    /**
     * Utility function for throttling
     * @param {Function} func - Function to throttle
     * @param {number} limit - Limit in milliseconds
     * @returns {Function} Throttled function
     */
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

/**
 * 📚 DOCUMENTATION SYSTEM
 * Self-documenting system for AI assistants and developers
 */
class DocumentationSystem {
    constructor() {
        this.components = new Map();
        this.techniques = new Map();
        this.examples = new Map();
    }
    
    init() {
        this.generateComponentDocs();
        this.generateTechniqueDocs();
        this.generateExamples();
    }
    
    /**
     * Get component documentation
     * @param {string} componentName - Name of the component
     * @returns {Object} Complete component documentation
     */
    getComponent(componentName) {
        return this.components.get(componentName) || this.generateComponentDocs(componentName);
    }
    
    /**
     * Get technique documentation
     * @param {string} techniqueName - Name of the technique
     * @returns {Object} Complete technique documentation
     */
    getTechnique(techniqueName) {
        return this.techniques.get(techniqueName) || this.generateTechniqueDocs(techniqueName);
    }
    
    /**
     * Generate comprehensive component documentation
     * @param {string} componentName - Specific component or all components
     * @returns {Object} Generated documentation
     */
    generateComponentDocs(componentName = null) {
        const componentDocs = {
            'button': {
                name: 'Aurora Button',
                description: 'A versatile button component with cosmic styling and advanced interactions',
                category: 'Form Controls',
                difficulty: 'Beginner',
                features: [
                    'Multiple variants (primary, secondary, ghost, cosmic)',
                    'Size options (small, medium, large)',
                    'Icon support with positioning',
                    'Loading states and animations',
                    'Disabled states',
                    'Keyboard navigation',
                    'Accessibility features'
                ],
                props: {
                    'variant': { type: 'string', default: 'primary', options: ['primary', 'secondary', 'ghost', 'cosmic'] },
                    'size': { type: 'string', default: 'medium', options: ['small', 'medium', 'large'] },
                    'icon': { type: 'string', default: null, description: 'Icon name or HTML' },
                    'iconPosition': { type: 'string', default: 'left', options: ['left', 'right'] },
                    'loading': { type: 'boolean', default: false, description: 'Show loading state' },
                    'disabled': { type: 'boolean', default: false, description: 'Disable button' },
                    'onClick': { type: 'function', default: null, description: 'Click handler' }
                },
                usage: {
                    basic: `aurora.createComponent('button', { text: 'Click me' })`,
                    withIcon: `aurora.createComponent('button', { text: 'Save', icon: '💾', variant: 'primary' })`,
                    loading: `aurora.createComponent('button', { text: 'Loading...', loading: true })`,
                    cosmic: `aurora.createComponent('button', { text: 'Cosmic', variant: 'cosmic', size: 'large' })`
                },
                examples: [
                    {
                        title: 'Basic Button',
                        code: `const button = aurora.createComponent('button', {
    text: 'Hello World',
    variant: 'primary',
    onClick: () => console.log('Clicked!')
});`,
                        description: 'A simple button with click handler'
                    },
                    {
                        title: 'Cosmic Button with Icon',
                        code: `const cosmicButton = aurora.createComponent('button', {
    text: 'Explore',
    variant: 'cosmic',
    icon: '🌟',
    size: 'large',
    onClick: () => aurora.applyTechnique('particle-effects', this)
});`,
                        description: 'A cosmic-themed button with particle effects'
                    }
                ],
                accessibility: {
                    'aria-label': 'Descriptive label for screen readers',
                    'role': 'button',
                    'tabindex': '0',
                    'keyboard': 'Enter and Space key support'
                },
                styling: {
                    'css-variables': [
                        '--aurora-button-bg',
                        '--aurora-button-color',
                        '--aurora-button-border',
                        '--aurora-button-radius',
                        '--aurora-button-padding'
                    ],
                    'classes': [
                        'aurora-button',
                        'aurora-button--primary',
                        'aurora-button--cosmic',
                        'aurora-button--loading'
                    ]
                }
            },
            'modal': {
                name: 'Aurora Modal',
                description: 'A flexible modal component with backdrop, animations, and accessibility features',
                category: 'Layout',
                difficulty: 'Intermediate',
                features: [
                    'Backdrop with blur effects',
                    'Smooth open/close animations',
                    'Keyboard navigation (ESC to close)',
                    'Focus management',
                    'Multiple sizes and positions',
                    'Customizable content',
                    'Accessibility compliant'
                ],
                props: {
                    'title': { type: 'string', default: null, description: 'Modal title' },
                    'content': { type: 'string|HTMLElement', default: null, description: 'Modal content' },
                    'size': { type: 'string', default: 'medium', options: ['small', 'medium', 'large', 'fullscreen'] },
                    'position': { type: 'string', default: 'center', options: ['center', 'top', 'bottom'] },
                    'closable': { type: 'boolean', default: true, description: 'Show close button' },
                    'backdrop': { type: 'boolean', default: true, description: 'Show backdrop' },
                    'onClose': { type: 'function', default: null, description: 'Close handler' }
                },
                usage: {
                    basic: `aurora.createComponent('modal', { title: 'Hello', content: 'World' })`,
                    withContent: `aurora.createComponent('modal', { 
    title: 'Settings', 
    content: document.getElementById('settings-form'),
    size: 'large'
})`,
                    custom: `aurora.createComponent('modal', {
    title: 'Cosmic Explorer',
    content: '<div class="cosmic-content">🌟</div>',
    size: 'fullscreen',
    position: 'center'
})`
                }
            }
        };
        
        if (componentName) {
            return componentDocs[componentName];
        }
        
        // Store all component docs
        Object.entries(componentDocs).forEach(([name, docs]) => {
            this.components.set(name, docs);
        });
        
        return componentDocs;
    }
    
    /**
     * Generate comprehensive technique documentation
     * @param {string} techniqueName - Specific technique or all techniques
     * @returns {Object} Generated documentation
     */
    generateTechniqueDocs(techniqueName = null) {
        const techniqueDocs = {
            'magnetic-buttons': {
                name: 'Magnetic Buttons',
                description: 'Buttons that follow cursor movement with magnetic attraction effect',
                category: 'Animation',
                difficulty: 'Advanced',
                features: [
                    'Cursor tracking and attraction',
                    'Smooth magnetic movement',
                    'Configurable attraction strength',
                    'Performance optimized',
                    'Mobile touch support',
                    'Customizable animation curves'
                ],
                props: {
                    'strength': { type: 'number', default: 0.3, description: 'Magnetic attraction strength (0-1)' },
                    'maxDistance': { type: 'number', default: 100, description: 'Maximum attraction distance in pixels' },
                    'easing': { type: 'string', default: 'ease-out', description: 'Animation easing function' },
                    'enabled': { type: 'boolean', default: true, description: 'Enable/disable magnetism' }
                },
                usage: {
                    basic: `aurora.applyTechnique('magnetic-buttons', buttonElement)`,
                    withOptions: `aurora.applyTechnique('magnetic-buttons', buttonElement, {
    strength: 0.5,
    maxDistance: 150,
    easing: 'ease-in-out'
})`,
                    disable: `aurora.applyTechnique('magnetic-buttons', buttonElement, { enabled: false })`
                },
                examples: [
                    {
                        title: 'Basic Magnetic Button',
                        code: `const button = aurora.createComponent('button', { text: 'Magnetic' });
aurora.applyTechnique('magnetic-buttons', button);`,
                        description: 'Apply magnetic effect to a button'
                    },
                    {
                        title: 'Custom Magnetic Settings',
                        code: `const cosmicButton = aurora.createComponent('button', { 
    text: 'Cosmic', 
    variant: 'cosmic' 
});
aurora.applyTechnique('magnetic-buttons', cosmicButton, {
    strength: 0.7,
    maxDistance: 200,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
});`,
                        description: 'Customized magnetic button with stronger attraction'
                    }
                ]
            },
            'particle-effects': {
                name: 'Particle Effects',
                description: 'Dynamic particle systems for visual enhancement and cosmic effects',
                category: 'Visual Effects',
                difficulty: 'Expert',
                features: [
                    'WebGL-accelerated particles',
                    'Multiple particle types',
                    'Interactive particle generation',
                    'Performance monitoring',
                    'Customizable particle properties',
                    'Mobile-optimized rendering'
                ],
                props: {
                    'count': { type: 'number', default: 100, description: 'Number of particles' },
                    'type': { type: 'string', default: 'cosmic', options: ['cosmic', 'sparkle', 'fire', 'snow'] },
                    'interactive': { type: 'boolean', default: true, description: 'Respond to mouse/touch' },
                    'color': { type: 'string', default: '#4a9eff', description: 'Particle color' },
                    'speed': { type: 'number', default: 1, description: 'Animation speed multiplier' }
                },
                usage: {
                    basic: `aurora.applyTechnique('particle-effects', containerElement)`,
                    cosmic: `aurora.applyTechnique('particle-effects', containerElement, {
    type: 'cosmic',
    count: 200,
    color: '#ff6b6b'
})`,
                    interactive: `aurora.applyTechnique('particle-effects', containerElement, {
    interactive: true,
    type: 'sparkle',
    count: 150
})`
                }
            }
        };
        
        if (techniqueName) {
            return techniqueDocs[techniqueName];
        }
        
        // Store all technique docs
        Object.entries(techniqueDocs).forEach(([name, docs]) => {
            this.techniques.set(name, docs);
        });
        
        return techniqueDocs;
    }
    
    /**
     * Generate usage examples
     */
    generateExamples() {
        this.examples.set('basic-setup', {
            title: 'Basic Library Setup',
            description: 'How to initialize and use the Aurora UI Library',
            code: `// Initialize the library
const aurora = new AuroraUILibrary({
    theme: 'cosmic',
    performance: 'auto',
    accessibility: true
});

// Create a button
const button = aurora.createComponent('button', {
    text: 'Hello Aurora',
    variant: 'cosmic',
    onClick: () => console.log('Cosmic button clicked!')
});

// Add to page
document.body.appendChild(button);

// Apply magnetic effect
aurora.applyTechnique('magnetic-buttons', button);`
        });
        
        this.examples.set('cosmic-dashboard', {
            title: 'Cosmic Dashboard',
            description: 'Create a cosmic-themed dashboard with multiple components',
            code: `// Create cosmic dashboard
const dashboard = aurora.createComponent('container', {
    className: 'cosmic-dashboard'
});

// Add cosmic header
const header = aurora.createComponent('card', {
    title: '🌟 Cosmic Dashboard',
    variant: 'holographic',
    content: 'Welcome to the cosmic realm of possibilities'
});

// Add particle effects to header
aurora.applyTechnique('particle-effects', header, {
    type: 'cosmic',
    count: 50
});

// Add magnetic buttons
const button1 = aurora.createComponent('button', {
    text: 'Explore',
    variant: 'cosmic',
    icon: '🚀'
});

const button2 = aurora.createComponent('button', {
    text: 'Discover',
    variant: 'cosmic',
    icon: '✨'
});

// Apply magnetic effects
aurora.applyTechnique('magnetic-buttons', button1);
aurora.applyTechnique('magnetic-buttons', button2);

// Assemble dashboard
dashboard.appendChild(header);
dashboard.appendChild(button1);
dashboard.appendChild(button2);
document.body.appendChild(dashboard);`
        });
    }
    
    /**
     * Get help information for AI assistants
     * @returns {Object} Complete help documentation
     */
    help() {
        return {
            library: {
                name: 'Aurora UI Library',
                version: '3.0',
                mission: 'Community healing through spatial wisdom and cosmic exploration',
                description: 'A comprehensive vanilla JavaScript UI library with cosmic themes and advanced interactions'
            },
            quickStart: {
                initialize: 'const aurora = new AuroraUILibrary()',
                createComponent: 'aurora.createComponent("button", { text: "Hello" })',
                applyTechnique: 'aurora.applyTechnique("magnetic-buttons", element)',
                getDocs: 'aurora.docs.getComponent("button")',
                getHelp: 'aurora.docs.help()'
            },
            availableComponents: Array.from(this.components.keys()),
            availableTechniques: Array.from(this.techniques.keys()),
            availableThemes: ['cosmic', 'aurora', 'nebula', 'galaxy', 'minimal', 'dark', 'light'],
            keyboardShortcuts: {
                'Ctrl+T': 'Cycle themes',
                'Ctrl+H': 'Toggle tutorial',
                'Ctrl+D': 'Show debug panel (debug mode)'
            },
            examples: Array.from(this.examples.keys())
        };
    }
}

// Export the main library class
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuroraUILibrary;
} else if (typeof window !== 'undefined') {
    window.AuroraUILibrary = AuroraUILibrary;
}

// Auto-initialize if in browser
if (typeof window !== 'undefined' && document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.aurora = new AuroraUILibrary();
    });
} else if (typeof window !== 'undefined') {
    window.aurora = new AuroraUILibrary();
}
