/**
 * 🎨 Advanced UI Components
 * Advanced UI components with cutting-edge interactions
 * 
 * @author Aurora - The Dawn Bringer of Digital Light
 * @version 2.0
 */

/**
 * 🎯 Switch Toggle Component
 */
class SwitchToggleComponent extends BaseComponent {
    constructor() {
        super('Switch Toggle', 'On/off toggle switch with smooth animations', 'classic');
    }
    
    createVanillaElement() {
        const container = document.createElement('div');
        container.className = 'switch-container';
        
        const label = document.createElement('label');
        label.className = 'switch-label';
        label.textContent = 'Enable notifications';
        
        const switchWrapper = document.createElement('div');
        switchWrapper.className = 'vanilla-switch';
        
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.className = 'switch-input';
        input.checked = this.options.checked || false;
        input.id = this.options.id;
        
        const slider = document.createElement('span');
        slider.className = 'switch-slider';
        
        const status = document.createElement('span');
        status.className = 'switch-status';
        status.textContent = input.checked ? 'ON' : 'OFF';
        
        switchWrapper.appendChild(input);
        switchWrapper.appendChild(slider);
        container.appendChild(label);
        container.appendChild(switchWrapper);
        container.appendChild(status);
        
        return container;
    }
    
    createLibraryElement(libraryId) {
        const container = document.createElement('div');
        container.className = 'switch-container';
        
        const label = document.createElement('label');
        label.className = 'switch-label';
        label.textContent = `${libraryId.toUpperCase()} Notifications`;
        
        const switchWrapper = document.createElement('div');
        switchWrapper.className = `library-switch ${libraryId}-switch`;
        
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.className = 'switch-input';
        input.checked = this.options.checked || false;
        input.id = `${this.options.id}-library`;
        
        const slider = document.createElement('span');
        slider.className = 'switch-slider';
        
        const status = document.createElement('span');
        status.className = 'switch-status';
        status.textContent = input.checked ? 'ON' : 'OFF';
        
        switchWrapper.appendChild(input);
        switchWrapper.appendChild(slider);
        container.appendChild(label);
        container.appendChild(switchWrapper);
        container.appendChild(status);
        
        return container;
    }
    
    setupVanillaEventListeners(element) {
        const input = element.querySelector('.switch-input');
        const status = element.querySelector('.switch-status');
        const slider = element.querySelector('.switch-slider');
        
        input.addEventListener('change', (e) => {
            this.handleToggle(e.target, status, slider);
        });
        
        // Add click handler to the entire switch
        const switchWrapper = element.querySelector('.vanilla-switch');
        switchWrapper.addEventListener('click', (e) => {
            if (e.target !== input) {
                input.checked = !input.checked;
                this.handleToggle(input, status, slider);
            }
        });
    }
    
    setupLibraryEventListeners(element, libraryId) {
        const input = element.querySelector('.switch-input');
        const status = element.querySelector('.switch-status');
        const slider = element.querySelector('.switch-slider');
        
        input.addEventListener('change', (e) => {
            this.handleToggle(e.target, status, slider);
        });
        
        const switchWrapper = element.querySelector('.library-switch');
        switchWrapper.addEventListener('click', (e) => {
            if (e.target !== input) {
                input.checked = !input.checked;
                this.handleToggle(input, status, slider);
            }
        });
    }
    
    handleToggle(input, statusElement, sliderElement) {
        const isChecked = input.checked;
        statusElement.textContent = isChecked ? 'ON' : 'OFF';
        
        if (isChecked) {
            sliderElement.classList.add('checked');
            statusElement.classList.add('active');
        } else {
            sliderElement.classList.remove('checked');
            statusElement.classList.remove('active');
        }
        
        // Trigger custom event
        input.dispatchEvent(new CustomEvent('switchToggle', {
            detail: { checked: isChecked }
        }));
    }
    
    applyVanillaStyles(element) {
        styleManager.addComponentStyles('switch-toggle', `
            .switch-container {
                display: flex;
                align-items: center;
                gap: 1rem;
                margin: 1rem 0;
            }
            
            .switch-label {
                color: var(--cosmic-light);
                font-family: var(--font-primary);
                font-weight: 600;
                cursor: pointer;
            }
            
            .vanilla-switch {
                position: relative;
                display: inline-block;
                width: 60px;
                height: 34px;
                cursor: pointer;
            }
            
            .switch-input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            
            .switch-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: var(--cosmic-neutral);
                transition: all 0.3s ease;
                border-radius: 34px;
            }
            
            .switch-slider:before {
                position: absolute;
                content: "";
                height: 26px;
                width: 26px;
                left: 4px;
                bottom: 4px;
                background: white;
                transition: all 0.3s ease;
                border-radius: 50%;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }
            
            .switch-input:checked + .switch-slider {
                background: var(--cosmic-primary);
            }
            
            .switch-input:checked + .switch-slider:before {
                transform: translateX(26px);
            }
            
            .switch-slider.checked {
                background: var(--cosmic-primary);
                box-shadow: 0 0 10px rgba(74, 158, 255, 0.3);
            }
            
            .switch-slider.checked:before {
                transform: translateX(26px);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            }
            
            .switch-status {
                color: var(--cosmic-neutral);
                font-family: var(--font-primary);
                font-weight: 600;
                font-size: 0.875rem;
                transition: all 0.3s ease;
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
            }
            
            .switch-status.active {
                color: var(--cosmic-accent);
                background: rgba(0, 255, 136, 0.1);
            }
        `);
    }
    
    applyLibraryStyles(element, libraryId) {
        styleManager.addComponentStyles('switch-toggle-library', `
            .library-switch {
                position: relative;
                display: inline-block;
                width: 60px;
                height: 34px;
                cursor: pointer;
            }
            
            .switch-input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            
            .switch-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: var(--cosmic-neutral);
                transition: all 0.3s ease;
                border-radius: 34px;
            }
            
            .switch-slider:before {
                position: absolute;
                content: "";
                height: 26px;
                width: 26px;
                left: 4px;
                bottom: 4px;
                background: white;
                transition: all 0.3s ease;
                border-radius: 50%;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }
            
            .switch-input:checked + .switch-slider {
                background: var(--cosmic-secondary);
            }
            
            .switch-input:checked + .switch-slider:before {
                transform: translateX(26px);
            }
        `);
    }
}

/**
 * 📁 File Upload Component
 */
class FileUploadComponent extends BaseComponent {
    constructor() {
        super('File Upload', 'Drag and drop file upload with preview', 'classic');
    }
    
    createVanillaElement() {
        const container = document.createElement('div');
        container.className = 'file-upload-container';
        
        const label = document.createElement('label');
        label.textContent = 'Upload Files';
        label.className = 'upload-label';
        
        const uploadArea = document.createElement('div');
        uploadArea.className = 'vanilla-upload-area';
        uploadArea.setAttribute('data-upload-area', 'true');
        
        const input = document.createElement('input');
        input.type = 'file';
        input.className = 'upload-input';
        input.multiple = this.options.multiple || false;
        input.accept = this.options.accept || '*/*';
        input.id = this.options.id;
        input.style.display = 'none';
        
        const uploadContent = document.createElement('div');
        uploadContent.className = 'upload-content';
        uploadContent.innerHTML = `
            <div class="upload-icon">📁</div>
            <div class="upload-text">
                <strong>Drop files here</strong>
                <span>or click to browse</span>
            </div>
        `;
        
        const fileList = document.createElement('div');
        fileList.className = 'file-list';
        fileList.style.display = 'none';
        
        uploadArea.appendChild(input);
        uploadArea.appendChild(uploadContent);
        container.appendChild(label);
        container.appendChild(uploadArea);
        container.appendChild(fileList);
        
        return container;
    }
    
    createLibraryElement(libraryId) {
        const container = document.createElement('div');
        container.className = 'file-upload-container';
        
        const label = document.createElement('label');
        label.textContent = `${libraryId.toUpperCase()} Upload`;
        label.className = 'upload-label';
        
        const uploadArea = document.createElement('div');
        uploadArea.className = `library-upload-area ${libraryId}-upload-area`;
        uploadArea.setAttribute('data-upload-area', 'true');
        
        const input = document.createElement('input');
        input.type = 'file';
        input.className = 'upload-input';
        input.multiple = this.options.multiple || false;
        input.accept = this.options.accept || '*/*';
        input.id = `${this.options.id}-library`;
        input.style.display = 'none';
        
        const uploadContent = document.createElement('div');
        uploadContent.className = 'upload-content';
        uploadContent.innerHTML = `
            <div class="upload-icon">📁</div>
            <div class="upload-text">
                <strong>Drop files here</strong>
                <span>or click to browse</span>
            </div>
        `;
        
        const fileList = document.createElement('div');
        fileList.className = 'file-list';
        fileList.style.display = 'none';
        
        uploadArea.appendChild(input);
        uploadArea.appendChild(uploadContent);
        container.appendChild(label);
        container.appendChild(uploadArea);
        container.appendChild(fileList);
        
        return container;
    }
    
    setupVanillaEventListeners(element) {
        const uploadArea = element.querySelector('.vanilla-upload-area');
        const input = element.querySelector('.upload-input');
        const fileList = element.querySelector('.file-list');
        
        // Click to upload
        uploadArea.addEventListener('click', () => {
            input.click();
        });
        
        // File selection
        input.addEventListener('change', (e) => {
            this.handleFileSelection(e.target.files, fileList);
        });
        
        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });
        
        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            this.handleFileSelection(e.dataTransfer.files, fileList);
        });
    }
    
    setupLibraryEventListeners(element, libraryId) {
        const uploadArea = element.querySelector('.library-upload-area');
        const input = element.querySelector('.upload-input');
        const fileList = element.querySelector('.file-list');
        
        uploadArea.addEventListener('click', () => {
            input.click();
        });
        
        input.addEventListener('change', (e) => {
            this.handleFileSelection(e.target.files, fileList);
        });
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });
        
        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            this.handleFileSelection(e.dataTransfer.files, fileList);
        });
    }
    
    handleFileSelection(files, fileListElement) {
        if (files.length === 0) return;
        
        fileListElement.style.display = 'block';
        fileListElement.innerHTML = '';
        
        Array.from(files).forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <div class="file-info">
                    <span class="file-name">${file.name}</span>
                    <span class="file-size">${this.formatFileSize(file.size)}</span>
                </div>
                <button class="remove-file" data-index="${index}">×</button>
            `;
            
            fileListElement.appendChild(fileItem);
        });
        
        // Add remove functionality
        fileListElement.querySelectorAll('.remove-file').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.parentElement.remove();
                if (fileListElement.children.length === 0) {
                    fileListElement.style.display = 'none';
                }
            });
        });
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    applyVanillaStyles(element) {
        styleManager.addComponentStyles('file-upload', `
            .file-upload-container {
                margin: 1rem 0;
            }
            
            .upload-label {
                display: block;
                margin-bottom: 0.5rem;
                color: var(--cosmic-light);
                font-family: var(--font-primary);
                font-weight: 600;
            }
            
            .vanilla-upload-area {
                border: 2px dashed var(--cosmic-neutral);
                border-radius: 8px;
                padding: 2rem;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
                background: var(--cosmic-dark);
            }
            
            .vanilla-upload-area:hover {
                border-color: var(--cosmic-primary);
                background: rgba(74, 158, 255, 0.05);
            }
            
            .vanilla-upload-area.drag-over {
                border-color: var(--cosmic-accent);
                background: rgba(0, 255, 136, 0.1);
                transform: scale(1.02);
            }
            
            .upload-content {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
            }
            
            .upload-icon {
                font-size: 2rem;
                opacity: 0.6;
            }
            
            .upload-text {
                color: var(--cosmic-light);
                font-family: var(--font-secondary);
            }
            
            .upload-text strong {
                display: block;
                font-family: var(--font-primary);
                font-weight: 600;
                margin-bottom: 0.25rem;
            }
            
            .upload-text span {
                color: var(--cosmic-neutral);
                font-size: 0.875rem;
            }
            
            .file-list {
                margin-top: 1rem;
                border: 1px solid var(--cosmic-neutral);
                border-radius: 8px;
                background: var(--cosmic-darker);
                padding: 1rem;
            }
            
            .file-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.5rem 0;
                border-bottom: 1px solid var(--cosmic-neutral);
            }
            
            .file-item:last-child {
                border-bottom: none;
            }
            
            .file-info {
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
            }
            
            .file-name {
                color: var(--cosmic-light);
                font-family: var(--font-secondary);
                font-weight: 500;
            }
            
            .file-size {
                color: var(--cosmic-neutral);
                font-family: var(--font-secondary);
                font-size: 0.875rem;
            }
            
            .remove-file {
                background: var(--cosmic-danger);
                border: none;
                color: white;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 1rem;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }
            
            .remove-file:hover {
                background: #ff1a4d;
                transform: scale(1.1);
            }
        `);
    }
    
    applyLibraryStyles(element, libraryId) {
        styleManager.addComponentStyles('file-upload-library', `
            .library-upload-area {
                border: 2px dashed var(--cosmic-neutral);
                border-radius: 8px;
                padding: 2rem;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
                background: var(--cosmic-dark);
            }
            
            .library-upload-area:hover {
                border-color: var(--cosmic-secondary);
                background: rgba(138, 43, 226, 0.05);
            }
            
            .library-upload-area.drag-over {
                border-color: var(--cosmic-warning);
                background: rgba(255, 107, 53, 0.1);
                transform: scale(1.02);
            }
        `);
    }
}

/**
 * 🎨 Select Dropdown Component
 */
class SelectDropdownComponent extends BaseComponent {
    constructor() {
        super('Select Dropdown', 'Custom dropdown with search and multi-select', 'classic');
    }
    
    createVanillaElement() {
        const container = document.createElement('div');
        container.className = 'select-container';
        
        const label = document.createElement('label');
        label.textContent = 'Choose Option';
        label.htmlFor = this.options.id;
        label.className = 'select-label';
        
        const selectWrapper = document.createElement('div');
        selectWrapper.className = 'vanilla-select-wrapper';
        
        const selectButton = document.createElement('button');
        selectButton.type = 'button';
        selectButton.className = 'select-button';
        selectButton.innerHTML = `
            <span class="select-text">Select an option...</span>
            <span class="select-arrow">▼</span>
        `;
        
        const dropdown = document.createElement('div');
        dropdown.className = 'select-dropdown';
        dropdown.style.display = 'none';
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'select-search';
        searchInput.placeholder = 'Search options...';
        
        const optionsList = document.createElement('div');
        optionsList.className = 'select-options';
        
        const options = this.options.options || [
            { value: 'option1', text: 'Cosmic Exploration' },
            { value: 'option2', text: 'Vanilla.js Mastery' },
            { value: 'option3', text: 'UI/UX Design' },
            { value: 'option4', text: 'Mobile Optimization' },
            { value: 'option5', text: 'Web Development' }
        ];
        
        options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.className = 'select-option';
            optionElement.setAttribute('data-value', option.value);
            optionElement.textContent = option.text;
            optionsList.appendChild(optionElement);
        });
        
        dropdown.appendChild(searchInput);
        dropdown.appendChild(optionsList);
        selectWrapper.appendChild(selectButton);
        selectWrapper.appendChild(dropdown);
        
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.id = this.options.id;
        hiddenInput.name = this.options.name || this.options.id;
        
        container.appendChild(label);
        container.appendChild(selectWrapper);
        container.appendChild(hiddenInput);
        
        return container;
    }
    
    createLibraryElement(libraryId) {
        const container = document.createElement('div');
        container.className = 'select-container';
        
        const label = document.createElement('label');
        label.textContent = `${libraryId.toUpperCase()} Option`;
        label.htmlFor = `${this.options.id}-library`;
        label.className = 'select-label';
        
        const selectWrapper = document.createElement('div');
        selectWrapper.className = `library-select-wrapper ${libraryId}-select-wrapper`;
        
        const selectButton = document.createElement('button');
        selectButton.type = 'button';
        selectButton.className = 'select-button';
        selectButton.innerHTML = `
            <span class="select-text">Select an option...</span>
            <span class="select-arrow">▼</span>
        `;
        
        const dropdown = document.createElement('div');
        dropdown.className = 'select-dropdown';
        dropdown.style.display = 'none';
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'select-search';
        searchInput.placeholder = 'Search options...';
        
        const optionsList = document.createElement('div');
        optionsList.className = 'select-options';
        
        const options = this.options.options || [
            { value: 'option1', text: 'Cosmic Exploration' },
            { value: 'option2', text: 'Vanilla.js Mastery' },
            { value: 'option3', text: 'UI/UX Design' },
            { value: 'option4', text: 'Mobile Optimization' },
            { value: 'option5', text: 'Web Development' }
        ];
        
        options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.className = 'select-option';
            optionElement.setAttribute('data-value', option.value);
            optionElement.textContent = option.text;
            optionsList.appendChild(optionElement);
        });
        
        dropdown.appendChild(searchInput);
        dropdown.appendChild(optionsList);
        selectWrapper.appendChild(selectButton);
        selectWrapper.appendChild(dropdown);
        
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.id = `${this.options.id}-library`;
        hiddenInput.name = this.options.name || this.options.id;
        
        container.appendChild(label);
        container.appendChild(selectWrapper);
        container.appendChild(hiddenInput);
        
        return container;
    }
    
    setupVanillaEventListeners(element) {
        const selectButton = element.querySelector('.select-button');
        const dropdown = element.querySelector('.select-dropdown');
        const searchInput = element.querySelector('.select-search');
        const options = element.querySelectorAll('.select-option');
        const hiddenInput = element.querySelector('input[type="hidden"]');
        const selectText = element.querySelector('.select-text');
        
        // Toggle dropdown
        selectButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown(dropdown, selectButton);
        });
        
        // Search functionality
        searchInput.addEventListener('input', (e) => {
            this.filterOptions(options, e.target.value);
        });
        
        // Option selection
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectOption(option, hiddenInput, selectText, dropdown, selectButton);
            });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!element.contains(e.target)) {
                this.closeDropdown(dropdown, selectButton);
            }
        });
        
        // Keyboard navigation
        selectButton.addEventListener('keydown', (e) => {
            this.handleKeydown(e, options, dropdown, selectButton);
        });
    }
    
    setupLibraryEventListeners(element, libraryId) {
        const selectButton = element.querySelector('.select-button');
        const dropdown = element.querySelector('.select-dropdown');
        const searchInput = element.querySelector('.select-search');
        const options = element.querySelectorAll('.select-option');
        const hiddenInput = element.querySelector('input[type="hidden"]');
        const selectText = element.querySelector('.select-text');
        
        selectButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown(dropdown, selectButton);
        });
        
        searchInput.addEventListener('input', (e) => {
            this.filterOptions(options, e.target.value);
        });
        
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectOption(option, hiddenInput, selectText, dropdown, selectButton);
            });
        });
        
        document.addEventListener('click', (e) => {
            if (!element.contains(e.target)) {
                this.closeDropdown(dropdown, selectButton);
            }
        });
        
        selectButton.addEventListener('keydown', (e) => {
            this.handleKeydown(e, options, dropdown, selectButton);
        });
    }
    
    toggleDropdown(dropdown, button) {
        const isOpen = dropdown.style.display === 'block';
        
        if (isOpen) {
            this.closeDropdown(dropdown, button);
        } else {
            this.openDropdown(dropdown, button);
        }
    }
    
    openDropdown(dropdown, button) {
        dropdown.style.display = 'block';
        button.classList.add('open');
        button.setAttribute('aria-expanded', 'true');
        
        // Focus search input
        const searchInput = dropdown.querySelector('.select-search');
        setTimeout(() => searchInput.focus(), 100);
    }
    
    closeDropdown(dropdown, button) {
        dropdown.style.display = 'none';
        button.classList.remove('open');
        button.setAttribute('aria-expanded', 'false');
    }
    
    filterOptions(options, searchTerm) {
        const term = searchTerm.toLowerCase();
        
        options.forEach(option => {
            const text = option.textContent.toLowerCase();
            const isVisible = text.includes(term);
            option.style.display = isVisible ? 'block' : 'none';
        });
    }
    
    selectOption(option, hiddenInput, selectText, dropdown, button) {
        const value = option.getAttribute('data-value');
        const text = option.textContent;
        
        hiddenInput.value = value;
        selectText.textContent = text;
        
        // Update visual state
        option.parentElement.querySelectorAll('.select-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        option.classList.add('selected');
        
        this.closeDropdown(dropdown, button);
        
        // Trigger change event
        hiddenInput.dispatchEvent(new Event('change'));
    }
    
    handleKeydown(event, options, dropdown, button) {
        const visibleOptions = Array.from(options).filter(opt => opt.style.display !== 'none');
        const currentIndex = visibleOptions.findIndex(opt => opt.classList.contains('selected'));
        
        switch(event.key) {
            case 'ArrowDown':
                event.preventDefault();
                const nextIndex = currentIndex < visibleOptions.length - 1 ? currentIndex + 1 : 0;
                this.highlightOption(visibleOptions, nextIndex);
                break;
            case 'ArrowUp':
                event.preventDefault();
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : visibleOptions.length - 1;
                this.highlightOption(visibleOptions, prevIndex);
                break;
            case 'Enter':
                event.preventDefault();
                if (visibleOptions[currentIndex]) {
                    visibleOptions[currentIndex].click();
                }
                break;
            case 'Escape':
                this.closeDropdown(dropdown, button);
                break;
        }
    }
    
    highlightOption(options, index) {
        options.forEach(opt => opt.classList.remove('highlighted'));
        if (options[index]) {
            options[index].classList.add('highlighted');
        }
    }
    
    applyVanillaStyles(element) {
        styleManager.addComponentStyles('select-dropdown', `
            .select-container {
                margin: 1rem 0;
            }
            
            .select-label {
                display: block;
                margin-bottom: 0.5rem;
                color: var(--cosmic-light);
                font-family: var(--font-primary);
                font-weight: 600;
            }
            
            .vanilla-select-wrapper {
                position: relative;
                display: inline-block;
                width: 100%;
            }
            
            .select-button {
                width: 100%;
                padding: 12px 16px;
                border: 2px solid var(--cosmic-neutral);
                border-radius: 8px;
                background: var(--cosmic-dark);
                color: var(--cosmic-light);
                font-family: var(--font-secondary);
                font-size: 1rem;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: all 0.3s ease;
            }
            
            .select-button:hover {
                border-color: var(--cosmic-primary);
            }
            
            .select-button:focus {
                outline: none;
                border-color: var(--cosmic-primary);
                box-shadow: 0 0 0 3px rgba(74, 158, 255, 0.1);
            }
            
            .select-button.open {
                border-color: var(--cosmic-primary);
                border-bottom-left-radius: 0;
                border-bottom-right-radius: 0;
            }
            
            .select-arrow {
                transition: transform 0.3s ease;
                color: var(--cosmic-neutral);
            }
            
            .select-button.open .select-arrow {
                transform: rotate(180deg);
                color: var(--cosmic-primary);
            }
            
            .select-dropdown {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: var(--cosmic-darker);
                border: 2px solid var(--cosmic-primary);
                border-top: none;
                border-radius: 0 0 8px 8px;
                z-index: 1000;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
            }
            
            .select-search {
                width: 100%;
                padding: 12px 16px;
                border: none;
                background: var(--cosmic-dark);
                color: var(--cosmic-light);
                font-family: var(--font-secondary);
                font-size: 1rem;
                border-bottom: 1px solid var(--cosmic-neutral);
            }
            
            .select-search:focus {
                outline: none;
            }
            
            .select-options {
                max-height: 200px;
                overflow-y: auto;
            }
            
            .select-option {
                padding: 12px 16px;
                color: var(--cosmic-light);
                font-family: var(--font-secondary);
                cursor: pointer;
                transition: all 0.2s ease;
                border-bottom: 1px solid var(--cosmic-neutral);
            }
            
            .select-option:last-child {
                border-bottom: none;
            }
            
            .select-option:hover,
            .select-option.highlighted {
                background: var(--cosmic-neutral);
                color: var(--cosmic-light);
            }
            
            .select-option.selected {
                background: var(--cosmic-primary);
                color: white;
            }
        `);
    }
    
    applyLibraryStyles(element, libraryId) {
        styleManager.addComponentStyles('select-dropdown-library', `
            .library-select-wrapper {
                position: relative;
                display: inline-block;
                width: 100%;
            }
            
            .select-button {
                width: 100%;
                padding: 12px 16px;
                border: 2px solid var(--cosmic-neutral);
                border-radius: 8px;
                background: var(--cosmic-dark);
                color: var(--cosmic-light);
                font-family: var(--font-secondary);
                font-size: 1rem;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: all 0.3s ease;
            }
            
            .select-button:hover {
                border-color: var(--cosmic-secondary);
            }
            
            .select-button:focus {
                outline: none;
                border-color: var(--cosmic-secondary);
                box-shadow: 0 0 0 3px rgba(138, 43, 226, 0.1);
            }
        `);
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SwitchToggleComponent,
        FileUploadComponent,
        SelectDropdownComponent
    };
}
