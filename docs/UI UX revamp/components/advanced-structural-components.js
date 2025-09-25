/**
 * 🏗️ Advanced Structural Components
 * Additional structural UI components implemented in vanilla.js vs libraries
 * 
 * @author Aurora - The Dawn Bringer of Digital Light
 * @version 2.0
 */

/**
 * 🗂️ Tabs Component
 */
class TabsComponent extends BaseComponent {
    constructor() {
        super('Tabs', 'Tabbed interface with smooth transitions', 'structural');
    }
    
    createVanillaElement() {
        const container = document.createElement('div');
        container.className = 'vanilla-tabs';
        
        const tabList = document.createElement('div');
        tabList.className = 'tab-list';
        tabList.setAttribute('role', 'tablist');
        
        const tabs = this.options.tabs || [
            { id: 'tab1', label: 'Overview', content: 'This is the overview tab content with cosmic information.' },
            { id: 'tab2', label: 'Details', content: 'Detailed information about the cosmic exploration system.' },
            { id: 'tab3', label: 'Settings', content: 'Configuration options for your cosmic journey.' }
        ];
        
        const tabPanels = document.createElement('div');
        tabPanels.className = 'tab-panels';
        
        tabs.forEach((tab, index) => {
            // Create tab button
            const tabButton = document.createElement('button');
            tabButton.className = `tab-button ${index === 0 ? 'active' : ''}`;
            tabButton.textContent = tab.label;
            tabButton.setAttribute('role', 'tab');
            tabButton.setAttribute('aria-selected', index === 0);
            tabButton.setAttribute('aria-controls', `panel-${tab.id}`);
            tabButton.setAttribute('id', `tab-${tab.id}`);
            tabButton.setAttribute('tabindex', index === 0 ? '0' : '-1');
            
            // Create tab panel
            const tabPanel = document.createElement('div');
            tabPanel.className = `tab-panel ${index === 0 ? 'active' : ''}`;
            tabPanel.setAttribute('role', 'tabpanel');
            tabPanel.setAttribute('aria-labelledby', `tab-${tab.id}`);
            tabPanel.setAttribute('id', `panel-${tab.id}`);
            tabPanel.innerHTML = `<p>${tab.content}</p>`;
            
            tabList.appendChild(tabButton);
            tabPanels.appendChild(tabPanel);
        });
        
        container.appendChild(tabList);
        container.appendChild(tabPanels);
        
        return container;
    }
    
    createLibraryElement(libraryId) {
        const container = document.createElement('div');
        container.className = `library-tabs ${libraryId}-tabs`;
        
        const tabList = document.createElement('div');
        tabList.className = 'tab-list';
        tabList.setAttribute('role', 'tablist');
        
        const tabs = this.options.tabs || [
            { id: 'tab1', label: 'Overview', content: 'This is the overview tab content with cosmic information.' },
            { id: 'tab2', label: 'Details', content: 'Detailed information about the cosmic exploration system.' },
            { id: 'tab3', label: 'Settings', content: 'Configuration options for your cosmic journey.' }
        ];
        
        const tabPanels = document.createElement('div');
        tabPanels.className = 'tab-panels';
        
        tabs.forEach((tab, index) => {
            const tabButton = document.createElement('button');
            tabButton.className = `tab-button ${index === 0 ? 'active' : ''}`;
            tabButton.textContent = tab.label;
            tabButton.setAttribute('role', 'tab');
            tabButton.setAttribute('aria-selected', index === 0);
            tabButton.setAttribute('aria-controls', `panel-${tab.id}-library`);
            tabButton.setAttribute('id', `tab-${tab.id}-library`);
            tabButton.setAttribute('tabindex', index === 0 ? '0' : '-1');
            
            const tabPanel = document.createElement('div');
            tabPanel.className = `tab-panel ${index === 0 ? 'active' : ''}`;
            tabPanel.setAttribute('role', 'tabpanel');
            tabPanel.setAttribute('aria-labelledby', `tab-${tab.id}-library`);
            tabPanel.setAttribute('id', `panel-${tab.id}-library`);
            tabPanel.innerHTML = `<p>${tab.content}</p>`;
            
            tabList.appendChild(tabButton);
            tabPanels.appendChild(tabPanel);
        });
        
        container.appendChild(tabList);
        container.appendChild(tabPanels);
        
        return container;
    }
    
    setupVanillaEventListeners(element) {
        const tabButtons = element.querySelectorAll('.tab-button');
        const tabPanels = element.querySelectorAll('.tab-panel');
        
        tabButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                this.switchTab(tabButtons, tabPanels, index);
            });
            
            button.addEventListener('keydown', (e) => {
                this.handleTabKeydown(e, tabButtons, tabPanels, index);
            });
        });
    }
    
    setupLibraryEventListeners(element, libraryId) {
        const tabButtons = element.querySelectorAll('.tab-button');
        const tabPanels = element.querySelectorAll('.tab-panel');
        
        tabButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                this.switchTab(tabButtons, tabPanels, index);
            });
            
            button.addEventListener('keydown', (e) => {
                this.handleTabKeydown(e, tabButtons, tabPanels, index);
            });
        });
    }
    
    switchTab(tabButtons, tabPanels, activeIndex) {
        // Remove active class from all tabs and panels
        tabButtons.forEach((button, index) => {
            button.classList.remove('active');
            button.setAttribute('aria-selected', 'false');
            button.setAttribute('tabindex', '-1');
            tabPanels[index].classList.remove('active');
        });
        
        // Add active class to selected tab and panel
        tabButtons[activeIndex].classList.add('active');
        tabButtons[activeIndex].setAttribute('aria-selected', 'true');
        tabButtons[activeIndex].setAttribute('tabindex', '0');
        tabPanels[activeIndex].classList.add('active');
    }
    
    handleTabKeydown(event, tabButtons, tabPanels, currentIndex) {
        let newIndex = currentIndex;
        
        switch(event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                newIndex = currentIndex > 0 ? currentIndex - 1 : tabButtons.length - 1;
                break;
            case 'ArrowRight':
                event.preventDefault();
                newIndex = currentIndex < tabButtons.length - 1 ? currentIndex + 1 : 0;
                break;
            case 'Home':
                event.preventDefault();
                newIndex = 0;
                break;
            case 'End':
                event.preventDefault();
                newIndex = tabButtons.length - 1;
                break;
            default:
                return;
        }
        
        this.switchTab(tabButtons, tabPanels, newIndex);
        tabButtons[newIndex].focus();
    }
    
    applyVanillaStyles(element) {
        styleManager.addComponentStyles('tabs', `
            .vanilla-tabs {
                margin: 1rem 0;
            }
            
            .tab-list {
                display: flex;
                border-bottom: 2px solid var(--cosmic-neutral);
                margin-bottom: 1rem;
            }
            
            .tab-button {
                background: none;
                border: none;
                padding: 12px 24px;
                color: var(--cosmic-neutral);
                font-family: var(--font-primary);
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                border-bottom: 3px solid transparent;
                position: relative;
            }
            
            .tab-button:hover {
                color: var(--cosmic-light);
                background: rgba(74, 158, 255, 0.1);
            }
            
            .tab-button.active {
                color: var(--cosmic-primary);
                border-bottom-color: var(--cosmic-primary);
                background: rgba(74, 158, 255, 0.1);
            }
            
            .tab-button:focus {
                outline: 2px solid var(--cosmic-accent);
                outline-offset: 2px;
            }
            
            .tab-panel {
                display: none;
                padding: 1.5rem;
                background: var(--cosmic-dark);
                border-radius: 8px;
                border: 1px solid var(--cosmic-neutral);
                animation: fadeIn 0.3s ease;
            }
            
            .tab-panel.active {
                display: block;
            }
            
            .tab-panel p {
                color: var(--cosmic-light);
                font-family: var(--font-secondary);
                line-height: 1.6;
                margin: 0;
            }
            
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `);
    }
    
    applyLibraryStyles(element, libraryId) {
        styleManager.addComponentStyles('tabs-library', `
            .library-tabs {
                margin: 1rem 0;
            }
            
            .tab-list {
                display: flex;
                border-bottom: 2px solid var(--cosmic-neutral);
                margin-bottom: 1rem;
            }
            
            .tab-button {
                background: none;
                border: none;
                padding: 12px 24px;
                color: var(--cosmic-neutral);
                font-family: var(--font-primary);
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                border-bottom: 3px solid transparent;
            }
            
            .tab-button:hover {
                color: var(--cosmic-light);
                background: rgba(138, 43, 226, 0.1);
            }
            
            .tab-button.active {
                color: var(--cosmic-secondary);
                border-bottom-color: var(--cosmic-secondary);
                background: rgba(138, 43, 226, 0.1);
            }
        `);
    }
}

/**
 * 📋 Accordion Component
 */
class AccordionComponent extends BaseComponent {
    constructor() {
        super('Accordion', 'Collapsible content sections', 'structural');
    }
    
    createVanillaElement() {
        const container = document.createElement('div');
        container.className = 'vanilla-accordion';
        
        const items = this.options.items || [
            { id: 'item1', title: 'What is cosmic exploration?', content: 'Cosmic exploration is the journey through digital space, discovering new UI patterns and creating beautiful user experiences.' },
            { id: 'item2', title: 'How does vanilla.js work?', content: 'Vanilla.js uses pure JavaScript without frameworks, giving you complete control over your components and their behavior.' },
            { id: 'item3', title: 'Why choose this approach?', content: 'This approach offers better performance, smaller bundle sizes, and more flexibility compared to heavy frameworks.' }
        ];
        
        items.forEach((item, index) => {
            const accordionItem = document.createElement('div');
            accordionItem.className = 'accordion-item';
            
            const header = document.createElement('button');
            header.className = 'accordion-header';
            header.innerHTML = `
                <span class="accordion-title">${item.title}</span>
                <span class="accordion-icon">+</span>
            `;
            header.setAttribute('aria-expanded', 'false');
            header.setAttribute('aria-controls', `content-${item.id}`);
            
            const content = document.createElement('div');
            content.className = 'accordion-content';
            content.setAttribute('id', `content-${item.id}`);
            content.innerHTML = `<p>${item.content}</p>`;
            
            accordionItem.appendChild(header);
            accordionItem.appendChild(content);
            container.appendChild(accordionItem);
        });
        
        return container;
    }
    
    createLibraryElement(libraryId) {
        const container = document.createElement('div');
        container.className = `library-accordion ${libraryId}-accordion`;
        
        const items = this.options.items || [
            { id: 'item1', title: 'What is cosmic exploration?', content: 'Cosmic exploration is the journey through digital space, discovering new UI patterns and creating beautiful user experiences.' },
            { id: 'item2', title: 'How does vanilla.js work?', content: 'Vanilla.js uses pure JavaScript without frameworks, giving you complete control over your components and their behavior.' },
            { id: 'item3', title: 'Why choose this approach?', content: 'This approach offers better performance, smaller bundle sizes, and more flexibility compared to heavy frameworks.' }
        ];
        
        items.forEach((item, index) => {
            const accordionItem = document.createElement('div');
            accordionItem.className = 'accordion-item';
            
            const header = document.createElement('button');
            header.className = 'accordion-header';
            header.innerHTML = `
                <span class="accordion-title">${item.title}</span>
                <span class="accordion-icon">+</span>
            `;
            header.setAttribute('aria-expanded', 'false');
            header.setAttribute('aria-controls', `content-${item.id}-library`);
            
            const content = document.createElement('div');
            content.className = 'accordion-content';
            content.setAttribute('id', `content-${item.id}-library`);
            content.innerHTML = `<p>${item.content}</p>`;
            
            accordionItem.appendChild(header);
            accordionItem.appendChild(content);
            container.appendChild(accordionItem);
        });
        
        return container;
    }
    
    setupVanillaEventListeners(element) {
        const headers = element.querySelectorAll('.accordion-header');
        
        headers.forEach(header => {
            header.addEventListener('click', () => {
                this.toggleAccordionItem(header);
            });
            
            header.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleAccordionItem(header);
                }
            });
        });
    }
    
    setupLibraryEventListeners(element, libraryId) {
        const headers = element.querySelectorAll('.accordion-header');
        
        headers.forEach(header => {
            header.addEventListener('click', () => {
                this.toggleAccordionItem(header);
            });
            
            header.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleAccordionItem(header);
                }
            });
        });
    }
    
    toggleAccordionItem(header) {
        const content = header.nextElementSibling;
        const icon = header.querySelector('.accordion-icon');
        const isExpanded = header.getAttribute('aria-expanded') === 'true';
        
        if (isExpanded) {
            header.setAttribute('aria-expanded', 'false');
            content.style.maxHeight = '0';
            icon.textContent = '+';
            icon.style.transform = 'rotate(0deg)';
        } else {
            header.setAttribute('aria-expanded', 'true');
            content.style.maxHeight = content.scrollHeight + 'px';
            icon.textContent = '−';
            icon.style.transform = 'rotate(180deg)';
        }
    }
    
    applyVanillaStyles(element) {
        styleManager.addComponentStyles('accordion', `
            .vanilla-accordion {
                margin: 1rem 0;
            }
            
            .accordion-item {
                border: 1px solid var(--cosmic-neutral);
                border-radius: 8px;
                margin-bottom: 0.5rem;
                overflow: hidden;
            }
            
            .accordion-item:last-child {
                margin-bottom: 0;
            }
            
            .accordion-header {
                width: 100%;
                background: var(--cosmic-darker);
                border: none;
                padding: 1rem 1.5rem;
                color: var(--cosmic-light);
                font-family: var(--font-primary);
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: all 0.3s ease;
                text-align: left;
            }
            
            .accordion-header:hover {
                background: var(--cosmic-neutral);
            }
            
            .accordion-header:focus {
                outline: 2px solid var(--cosmic-accent);
                outline-offset: -2px;
            }
            
            .accordion-title {
                flex: 1;
            }
            
            .accordion-icon {
                font-size: 1.2rem;
                transition: transform 0.3s ease;
                color: var(--cosmic-primary);
            }
            
            .accordion-content {
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.3s ease;
                background: var(--cosmic-dark);
            }
            
            .accordion-content p {
                padding: 1rem 1.5rem;
                margin: 0;
                color: var(--cosmic-light);
                font-family: var(--font-secondary);
                line-height: 1.6;
            }
        `);
    }
    
    applyLibraryStyles(element, libraryId) {
        styleManager.addComponentStyles('accordion-library', `
            .library-accordion {
                margin: 1rem 0;
            }
            
            .accordion-item {
                border: 1px solid var(--cosmic-neutral);
                border-radius: 8px;
                margin-bottom: 0.5rem;
                overflow: hidden;
            }
            
            .accordion-header {
                width: 100%;
                background: var(--cosmic-darker);
                border: none;
                padding: 1rem 1.5rem;
                color: var(--cosmic-light);
                font-family: var(--font-primary);
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: all 0.3s ease;
                text-align: left;
            }
            
            .accordion-header:hover {
                background: var(--cosmic-neutral);
            }
            
            .accordion-icon {
                font-size: 1.2rem;
                transition: transform 0.3s ease;
                color: var(--cosmic-secondary);
            }
        `);
    }
}

/**
 * 📊 Progress Bar Component
 */
class ProgressBarComponent extends BaseComponent {
    constructor() {
        super('Progress Bar', 'Progress indication with animations', 'classic');
    }
    
    createVanillaElement() {
        const container = document.createElement('div');
        container.className = 'progress-bar-container';
        
        const label = document.createElement('label');
        label.textContent = 'Progress';
        label.className = 'progress-label';
        
        const progressWrapper = document.createElement('div');
        progressWrapper.className = 'progress-wrapper';
        
        const progressBar = document.createElement('div');
        progressBar.className = 'vanilla-progress-bar';
        progressBar.setAttribute('role', 'progressbar');
        progressBar.setAttribute('aria-valuenow', this.options.value || 0);
        progressBar.setAttribute('aria-valuemin', '0');
        progressBar.setAttribute('aria-valuemax', '100');
        
        const progressFill = document.createElement('div');
        progressFill.className = 'progress-fill';
        progressFill.style.width = `${this.options.value || 0}%`;
        
        const progressText = document.createElement('div');
        progressText.className = 'progress-text';
        progressText.textContent = `${this.options.value || 0}%`;
        
        progressBar.appendChild(progressFill);
        progressWrapper.appendChild(progressBar);
        progressWrapper.appendChild(progressText);
        
        container.appendChild(label);
        container.appendChild(progressWrapper);
        
        return container;
    }
    
    createLibraryElement(libraryId) {
        const container = document.createElement('div');
        container.className = 'progress-bar-container';
        
        const label = document.createElement('label');
        label.textContent = `${libraryId.toUpperCase()} Progress`;
        label.className = 'progress-label';
        
        const progressWrapper = document.createElement('div');
        progressWrapper.className = 'progress-wrapper';
        
        const progressBar = document.createElement('div');
        progressBar.className = `library-progress-bar ${libraryId}-progress-bar`;
        progressBar.setAttribute('role', 'progressbar');
        progressBar.setAttribute('aria-valuenow', this.options.value || 0);
        progressBar.setAttribute('aria-valuemin', '0');
        progressBar.setAttribute('aria-valuemax', '100');
        
        const progressFill = document.createElement('div');
        progressFill.className = 'progress-fill';
        progressFill.style.width = `${this.options.value || 0}%`;
        
        const progressText = document.createElement('div');
        progressText.className = 'progress-text';
        progressText.textContent = `${this.options.value || 0}%`;
        
        progressBar.appendChild(progressFill);
        progressWrapper.appendChild(progressBar);
        progressWrapper.appendChild(progressText);
        
        container.appendChild(label);
        container.appendChild(progressWrapper);
        
        return container;
    }
    
    setupVanillaEventListeners(element) {
        // Animate progress on load
        const progressFill = element.querySelector('.progress-fill');
        const progressText = element.querySelector('.progress-text');
        
        setTimeout(() => {
            this.animateProgress(progressFill, progressText, this.options.value || 0);
        }, 500);
    }
    
    setupLibraryEventListeners(element, libraryId) {
        const progressFill = element.querySelector('.progress-fill');
        const progressText = element.querySelector('.progress-text');
        
        setTimeout(() => {
            this.animateProgress(progressFill, progressText, this.options.value || 0);
        }, 500);
    }
    
    animateProgress(fillElement, textElement, targetValue) {
        let currentValue = 0;
        const increment = targetValue / 50; // 50 steps for smooth animation
        
        const animate = () => {
            if (currentValue < targetValue) {
                currentValue += increment;
                if (currentValue > targetValue) currentValue = targetValue;
                
                fillElement.style.width = `${currentValue}%`;
                textElement.textContent = `${Math.round(currentValue)}%`;
                
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
    
    applyVanillaStyles(element) {
        styleManager.addComponentStyles('progress-bar', `
            .progress-bar-container {
                margin: 1rem 0;
            }
            
            .progress-label {
                display: block;
                margin-bottom: 0.5rem;
                color: var(--cosmic-light);
                font-family: var(--font-primary);
                font-weight: 600;
            }
            
            .progress-wrapper {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            
            .vanilla-progress-bar {
                flex: 1;
                height: 8px;
                background: var(--cosmic-neutral);
                border-radius: 4px;
                overflow: hidden;
                position: relative;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, var(--cosmic-primary), var(--cosmic-accent));
                border-radius: 4px;
                transition: width 0.3s ease;
                position: relative;
                overflow: hidden;
            }
            
            .progress-fill::after {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
                animation: shimmer 2s infinite;
            }
            
            .progress-text {
                color: var(--cosmic-accent);
                font-family: var(--font-primary);
                font-weight: 600;
                min-width: 40px;
                text-align: right;
            }
            
            @keyframes shimmer {
                0% {
                    left: -100%;
                }
                100% {
                    left: 100%;
                }
            }
        `);
    }
    
    applyLibraryStyles(element, libraryId) {
        styleManager.addComponentStyles('progress-bar-library', `
            .library-progress-bar {
                flex: 1;
                height: 8px;
                background: var(--cosmic-neutral);
                border-radius: 4px;
                overflow: hidden;
                position: relative;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, var(--cosmic-secondary), var(--cosmic-warning));
                border-radius: 4px;
                transition: width 0.3s ease;
            }
        `);
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TabsComponent,
        AccordionComponent,
        ProgressBarComponent
    };
}
