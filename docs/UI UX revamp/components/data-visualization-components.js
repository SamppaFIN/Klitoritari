/**
 * 📊 Data Visualization Components
 * Advanced charts, graphs, and data display components
 * 
 * @author Aurora - The Dawn Bringer of Digital Light
 * @version 2.0
 */

/**
 * 📈 Chart Component
 */
class ChartComponent extends BaseComponent {
    constructor() {
        super('Chart', 'Interactive data visualization with Canvas', 'data');
    }
    
    createVanillaElement() {
        const container = document.createElement('div');
        container.className = 'chart-container';
        
        const label = document.createElement('label');
        label.textContent = 'Performance Chart';
        label.className = 'chart-label';
        
        const chartWrapper = document.createElement('div');
        chartWrapper.className = 'vanilla-chart-wrapper';
        
        const canvas = document.createElement('canvas');
        canvas.className = 'vanilla-chart-canvas';
        canvas.width = 400;
        canvas.height = 250;
        
        const controls = document.createElement('div');
        controls.className = 'chart-controls';
        controls.innerHTML = `
            <button class="chart-btn" data-type="line">📈 Line</button>
            <button class="chart-btn" data-type="bar">📊 Bar</button>
            <button class="chart-btn" data-type="pie">🥧 Pie</button>
            <button class="chart-btn" data-type="area">📉 Area</button>
        `;
        
        const legend = document.createElement('div');
        legend.className = 'chart-legend';
        
        chartWrapper.appendChild(canvas);
        container.appendChild(label);
        container.appendChild(chartWrapper);
        container.appendChild(controls);
        container.appendChild(legend);
        
        return container;
    }
    
    createLibraryElement(libraryId) {
        const container = document.createElement('div');
        container.className = 'chart-container';
        
        const label = document.createElement('label');
        label.textContent = `${libraryId.toUpperCase()} Chart`;
        label.className = 'chart-label';
        
        const chartWrapper = document.createElement('div');
        chartWrapper.className = `library-chart-wrapper ${libraryId}-chart-wrapper`;
        
        const canvas = document.createElement('canvas');
        canvas.className = `library-chart-canvas ${libraryId}-chart-canvas`;
        canvas.width = 400;
        canvas.height = 250;
        
        const controls = document.createElement('div');
        controls.className = 'chart-controls';
        controls.innerHTML = `
            <button class="chart-btn" data-type="line">📈 Line</button>
            <button class="chart-btn" data-type="bar">📊 Bar</button>
            <button class="chart-btn" data-type="pie">🥧 Pie</button>
            <button class="chart-btn" data-type="area">📉 Area</button>
        `;
        
        const legend = document.createElement('div');
        legend.className = 'chart-legend';
        
        chartWrapper.appendChild(canvas);
        container.appendChild(label);
        container.appendChild(chartWrapper);
        container.appendChild(controls);
        container.appendChild(legend);
        
        return container;
    }
    
    setupVanillaEventListeners(element) {
        const canvas = element.querySelector('.vanilla-chart-canvas');
        const controls = element.querySelectorAll('.chart-btn');
        const legend = element.querySelector('.chart-legend');
        
        // Sample data
        const chartData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                { label: 'Vanilla.js', data: [65, 59, 80, 81, 56, 55], color: '#4A9EFF' },
                { label: 'React', data: [28, 48, 40, 19, 86, 27], color: '#61DAFB' },
                { label: 'Vue', data: [18, 38, 30, 29, 76, 37], color: '#4FC08D' }
            ]
        };
        
        // Initialize chart
        this.initChart(canvas, chartData, legend);
        
        // Control handlers
        controls.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchChartType(canvas, chartData, e.target.dataset.type, legend);
                this.updateActiveButton(controls, e.target);
            });
        });
        
        // Mouse interaction
        canvas.addEventListener('mousemove', (e) => {
            this.handleChartHover(e, canvas, chartData);
        });
        
        canvas.addEventListener('mouseleave', () => {
            this.clearChartHover(canvas);
        });
    }
    
    setupLibraryEventListeners(element, libraryId) {
        const canvas = element.querySelector('.library-chart-canvas');
        const controls = element.querySelectorAll('.chart-btn');
        const legend = element.querySelector('.chart-legend');
        
        const chartData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                { label: 'Vanilla.js', data: [65, 59, 80, 81, 56, 55], color: '#4A9EFF' },
                { label: 'React', data: [28, 48, 40, 19, 86, 27], color: '#61DAFB' },
                { label: 'Vue', data: [18, 38, 30, 29, 76, 37], color: '#4FC08D' }
            ]
        };
        
        this.initChart(canvas, chartData, legend);
        
        controls.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchChartType(canvas, chartData, e.target.dataset.type, legend);
                this.updateActiveButton(controls, e.target);
            });
        });
        
        canvas.addEventListener('mousemove', (e) => {
            this.handleChartHover(e, canvas, chartData);
        });
        
        canvas.addEventListener('mouseleave', () => {
            this.clearChartHover(canvas);
        });
    }
    
    initChart(canvas, data, legend) {
        const ctx = canvas.getContext('2d');
        canvas.chartData = data;
        canvas.chartType = 'line';
        
        this.drawChart(canvas, data, 'line');
        this.updateLegend(legend, data.datasets);
    }
    
    drawChart(canvas, data, type) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const padding = 40;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Set background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, width, height);
        
        // Draw grid
        this.drawGrid(ctx, padding, chartWidth, chartHeight);
        
        // Draw chart based on type
        switch(type) {
            case 'line':
                this.drawLineChart(ctx, data, padding, chartWidth, chartHeight);
                break;
            case 'bar':
                this.drawBarChart(ctx, data, padding, chartWidth, chartHeight);
                break;
            case 'pie':
                this.drawPieChart(ctx, data, width / 2, height / 2, Math.min(width, height) / 3);
                break;
            case 'area':
                this.drawAreaChart(ctx, data, padding, chartWidth, chartHeight);
                break;
        }
        
        // Draw labels
        this.drawLabels(ctx, data.labels, padding, chartWidth, chartHeight);
    }
    
    drawGrid(ctx, padding, width, height) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        
        // Vertical lines
        for (let i = 0; i <= 5; i++) {
            const x = padding + (width / 5) * i;
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, padding + height);
            ctx.stroke();
        }
        
        // Horizontal lines
        for (let i = 0; i <= 4; i++) {
            const y = padding + (height / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(padding + width, y);
            ctx.stroke();
        }
    }
    
    drawLineChart(ctx, data, padding, width, height) {
        data.datasets.forEach((dataset, index) => {
            ctx.strokeStyle = dataset.color;
            ctx.lineWidth = 3;
            ctx.beginPath();
            
            dataset.data.forEach((value, i) => {
                const x = padding + (width / (data.labels.length - 1)) * i;
                const y = padding + height - (value / 100) * height;
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            
            ctx.stroke();
            
            // Draw points
            ctx.fillStyle = dataset.color;
            dataset.data.forEach((value, i) => {
                const x = padding + (width / (data.labels.length - 1)) * i;
                const y = padding + height - (value / 100) * height;
                
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fill();
            });
        });
    }
    
    drawBarChart(ctx, data, padding, width, height) {
        const barWidth = width / (data.labels.length * data.datasets.length) * 0.8;
        const groupWidth = width / data.labels.length;
        
        data.datasets.forEach((dataset, datasetIndex) => {
            ctx.fillStyle = dataset.color;
            
            dataset.data.forEach((value, i) => {
                const x = padding + i * groupWidth + datasetIndex * barWidth;
                const barHeight = (value / 100) * height;
                const y = padding + height - barHeight;
                
                ctx.fillRect(x, y, barWidth, barHeight);
            });
        });
    }
    
    drawPieChart(ctx, data, centerX, centerY, radius) {
        const total = data.datasets[0].data.reduce((sum, value) => sum + value, 0);
        let currentAngle = 0;
        
        data.datasets[0].data.forEach((value, i) => {
            const sliceAngle = (value / total) * 2 * Math.PI;
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = data.datasets[0].color;
            ctx.fill();
            
            // Draw label
            const labelAngle = currentAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(labelAngle) * (radius + 20);
            const labelY = centerY + Math.sin(labelAngle) * (radius + 20);
            
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(data.labels[i], labelX, labelY);
            
            currentAngle += sliceAngle;
        });
    }
    
    drawAreaChart(ctx, data, padding, width, height) {
        data.datasets.forEach((dataset, index) => {
            ctx.fillStyle = dataset.color + '40';
            ctx.strokeStyle = dataset.color;
            ctx.lineWidth = 2;
            
            ctx.beginPath();
            dataset.data.forEach((value, i) => {
                const x = padding + (width / (data.labels.length - 1)) * i;
                const y = padding + height - (value / 100) * height;
                
                if (i === 0) {
                    ctx.moveTo(x, padding + height);
                    ctx.lineTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            
            ctx.lineTo(padding + width, padding + height);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        });
    }
    
    drawLabels(ctx, labels, padding, width, height) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        
        labels.forEach((label, i) => {
            const x = padding + (width / (labels.length - 1)) * i;
            const y = padding + height + 20;
            ctx.fillText(label, x, y);
        });
    }
    
    switchChartType(canvas, data, type, legend) {
        canvas.chartType = type;
        this.drawChart(canvas, data, type);
    }
    
    updateActiveButton(buttons, activeButton) {
        buttons.forEach(btn => btn.classList.remove('active'));
        activeButton.classList.add('active');
    }
    
    handleChartHover(e, canvas, data) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Add hover effect
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(x - 10, y - 10, 20, 20);
    }
    
    clearChartHover(canvas) {
        // Redraw chart to clear hover effects
        this.drawChart(canvas, canvas.chartData, canvas.chartType);
    }
    
    updateLegend(legend, datasets) {
        legend.innerHTML = datasets.map(dataset => `
            <div class="legend-item">
                <div class="legend-color" style="background: ${dataset.color}"></div>
                <span class="legend-label">${dataset.label}</span>
            </div>
        `).join('');
    }
    
    applyVanillaStyles(element) {
        styleManager.addComponentStyles('chart', `
            .chart-container {
                margin: 1rem 0;
            }
            
            .chart-label {
                display: block;
                margin-bottom: 0.5rem;
                color: var(--cosmic-light);
                font-family: var(--font-primary);
                font-weight: 600;
            }
            
            .vanilla-chart-wrapper {
                background: var(--cosmic-dark);
                border: 2px solid var(--cosmic-neutral);
                border-radius: 8px;
                padding: 1rem;
                margin-bottom: 1rem;
            }
            
            .vanilla-chart-canvas {
                display: block;
                width: 100%;
                height: 250px;
                cursor: crosshair;
            }
            
            .chart-controls {
                display: flex;
                gap: 0.5rem;
                margin-bottom: 1rem;
                justify-content: center;
            }
            
            .chart-btn {
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
            
            .chart-btn:hover {
                background: var(--cosmic-primary);
                transform: translateY(-2px);
            }
            
            .chart-btn.active {
                background: var(--cosmic-accent);
                color: var(--cosmic-dark);
            }
            
            .chart-legend {
                display: flex;
                gap: 1rem;
                justify-content: center;
                flex-wrap: wrap;
            }
            
            .legend-item {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .legend-color {
                width: 12px;
                height: 12px;
                border-radius: 2px;
            }
            
            .legend-label {
                color: var(--cosmic-light);
                font-family: var(--font-secondary);
                font-size: 0.875rem;
            }
        `);
    }
    
    applyLibraryStyles(element, libraryId) {
        styleManager.addComponentStyles('chart-library', `
            .library-chart-wrapper {
                background: var(--cosmic-dark);
                border: 2px solid var(--cosmic-neutral);
                border-radius: 8px;
                padding: 1rem;
                margin-bottom: 1rem;
            }
            
            .library-chart-canvas {
                display: block;
                width: 100%;
                height: 250px;
                cursor: crosshair;
            }
        `);
    }
}

/**
 * 📋 Data Table Component
 */
class DataTableComponent extends BaseComponent {
    constructor() {
        super('Data Table', 'Sortable and filterable data grid', 'data');
    }
    
    createVanillaElement() {
        const container = document.createElement('div');
        container.className = 'data-table-container';
        
        const label = document.createElement('label');
        label.textContent = 'Performance Data';
        label.className = 'table-label';
        
        const tableWrapper = document.createElement('div');
        tableWrapper.className = 'vanilla-table-wrapper';
        
        const searchBox = document.createElement('div');
        searchBox.className = 'table-search';
        searchBox.innerHTML = `
            <input type="text" class="search-input" placeholder="Search data...">
            <button class="search-btn">🔍</button>
        `;
        
        const table = document.createElement('table');
        table.className = 'vanilla-data-table';
        
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th data-sort="name">Name <span class="sort-icon">↕️</span></th>
                <th data-sort="performance">Performance <span class="sort-icon">↕️</span></th>
                <th data-sort="bundle">Bundle Size <span class="sort-icon">↕️</span></th>
                <th data-sort="rating">Rating <span class="sort-icon">↕️</span></th>
                <th>Actions</th>
            </tr>
        `;
        
        const tbody = document.createElement('tbody');
        tbody.innerHTML = `
            <tr>
                <td>Vanilla.js</td>
                <td>95%</td>
                <td>0 KB</td>
                <td>⭐⭐⭐⭐⭐</td>
                <td><button class="action-btn">Edit</button></td>
            </tr>
            <tr>
                <td>React</td>
                <td>88%</td>
                <td>42 KB</td>
                <td>⭐⭐⭐⭐</td>
                <td><button class="action-btn">Edit</button></td>
            </tr>
            <tr>
                <td>Vue.js</td>
                <td>92%</td>
                <td>34 KB</td>
                <td>⭐⭐⭐⭐</td>
                <td><button class="action-btn">Edit</button></td>
            </tr>
            <tr>
                <td>Angular</td>
                <td>85%</td>
                <td>143 KB</td>
                <td>⭐⭐⭐</td>
                <td><button class="action-btn">Edit</button></td>
            </tr>
            <tr>
                <td>Svelte</td>
                <td>90%</td>
                <td>12 KB</td>
                <td>⭐⭐⭐⭐⭐</td>
                <td><button class="action-btn">Edit</button></td>
            </tr>
        `;
        
        table.appendChild(thead);
        table.appendChild(tbody);
        tableWrapper.appendChild(searchBox);
        tableWrapper.appendChild(table);
        
        const pagination = document.createElement('div');
        pagination.className = 'table-pagination';
        pagination.innerHTML = `
            <button class="page-btn" disabled>← Previous</button>
            <span class="page-info">Page 1 of 1</span>
            <button class="page-btn" disabled>Next →</button>
        `;
        
        container.appendChild(label);
        container.appendChild(tableWrapper);
        container.appendChild(pagination);
        
        return container;
    }
    
    createLibraryElement(libraryId) {
        const container = document.createElement('div');
        container.className = 'data-table-container';
        
        const label = document.createElement('label');
        label.textContent = `${libraryId.toUpperCase()} Data Table`;
        label.className = 'table-label';
        
        const tableWrapper = document.createElement('div');
        tableWrapper.className = `library-table-wrapper ${libraryId}-table-wrapper`;
        
        const searchBox = document.createElement('div');
        searchBox.className = 'table-search';
        searchBox.innerHTML = `
            <input type="text" class="search-input" placeholder="Search data...">
            <button class="search-btn">🔍</button>
        `;
        
        const table = document.createElement('table');
        table.className = `library-data-table ${libraryId}-data-table`;
        
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th data-sort="name">Name <span class="sort-icon">↕️</span></th>
                <th data-sort="performance">Performance <span class="sort-icon">↕️</span></th>
                <th data-sort="bundle">Bundle Size <span class="sort-icon">↕️</span></th>
                <th data-sort="rating">Rating <span class="sort-icon">↕️</span></th>
                <th>Actions</th>
            </tr>
        `;
        
        const tbody = document.createElement('tbody');
        tbody.innerHTML = `
            <tr>
                <td>Vanilla.js</td>
                <td>95%</td>
                <td>0 KB</td>
                <td>⭐⭐⭐⭐⭐</td>
                <td><button class="action-btn">Edit</button></td>
            </tr>
            <tr>
                <td>React</td>
                <td>88%</td>
                <td>42 KB</td>
                <td>⭐⭐⭐⭐</td>
                <td><button class="action-btn">Edit</button></td>
            </tr>
            <tr>
                <td>Vue.js</td>
                <td>92%</td>
                <td>34 KB</td>
                <td>⭐⭐⭐⭐</td>
                <td><button class="action-btn">Edit</button></td>
            </tr>
            <tr>
                <td>Angular</td>
                <td>85%</td>
                <td>143 KB</td>
                <td>⭐⭐⭐</td>
                <td><button class="action-btn">Edit</button></td>
            </tr>
            <tr>
                <td>Svelte</td>
                <td>90%</td>
                <td>12 KB</td>
                <td>⭐⭐⭐⭐⭐</td>
                <td><button class="action-btn">Edit</button></td>
            </tr>
        `;
        
        table.appendChild(thead);
        table.appendChild(tbody);
        tableWrapper.appendChild(searchBox);
        tableWrapper.appendChild(table);
        
        const pagination = document.createElement('div');
        pagination.className = 'table-pagination';
        pagination.innerHTML = `
            <button class="page-btn" disabled>← Previous</button>
            <span class="page-info">Page 1 of 1</span>
            <button class="page-btn" disabled>Next →</button>
        `;
        
        container.appendChild(label);
        container.appendChild(tableWrapper);
        container.appendChild(pagination);
        
        return container;
    }
    
    setupVanillaEventListeners(element) {
        const table = element.querySelector('.vanilla-data-table');
        const searchInput = element.querySelector('.search-input');
        const searchBtn = element.querySelector('.search-btn');
        const headers = element.querySelectorAll('th[data-sort]');
        const actionBtns = element.querySelectorAll('.action-btn');
        
        // Search functionality
        searchInput.addEventListener('input', () => {
            this.filterTable(table, searchInput.value);
        });
        
        searchBtn.addEventListener('click', () => {
            this.filterTable(table, searchInput.value);
        });
        
        // Sorting functionality
        headers.forEach(header => {
            header.addEventListener('click', () => {
                this.sortTable(table, header.dataset.sort, header);
            });
        });
        
        // Action buttons
        actionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleAction(e.target);
            });
        });
        
        // Row hover effects
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            row.addEventListener('mouseenter', () => {
                row.style.backgroundColor = 'rgba(74, 158, 255, 0.1)';
            });
            
            row.addEventListener('mouseleave', () => {
                row.style.backgroundColor = '';
            });
        });
    }
    
    setupLibraryEventListeners(element, libraryId) {
        const table = element.querySelector('.library-data-table');
        const searchInput = element.querySelector('.search-input');
        const searchBtn = element.querySelector('.search-btn');
        const headers = element.querySelectorAll('th[data-sort]');
        const actionBtns = element.querySelectorAll('.action-btn');
        
        searchInput.addEventListener('input', () => {
            this.filterTable(table, searchInput.value);
        });
        
        searchBtn.addEventListener('click', () => {
            this.filterTable(table, searchInput.value);
        });
        
        headers.forEach(header => {
            header.addEventListener('click', () => {
                this.sortTable(table, header.dataset.sort, header);
            });
        });
        
        actionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleAction(e.target);
            });
        });
        
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            row.addEventListener('mouseenter', () => {
                row.style.backgroundColor = 'rgba(138, 43, 226, 0.1)';
            });
            
            row.addEventListener('mouseleave', () => {
                row.style.backgroundColor = '';
            });
        });
    }
    
    filterTable(table, searchTerm) {
        const rows = table.querySelectorAll('tbody tr');
        const term = searchTerm.toLowerCase();
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const isVisible = text.includes(term);
            row.style.display = isVisible ? '' : 'none';
        });
    }
    
    sortTable(table, column, header) {
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const isAscending = !header.classList.contains('sort-asc');
        
        // Clear all sort classes
        table.querySelectorAll('th').forEach(th => {
            th.classList.remove('sort-asc', 'sort-desc');
            th.querySelector('.sort-icon').textContent = '↕️';
        });
        
        // Sort rows
        rows.sort((a, b) => {
            const aValue = a.querySelector(`td:nth-child(${this.getColumnIndex(column)})`).textContent;
            const bValue = b.querySelector(`td:nth-child(${this.getColumnIndex(column)})`).textContent;
            
            let comparison = 0;
            if (aValue < bValue) comparison = -1;
            if (aValue > bValue) comparison = 1;
            
            return isAscending ? comparison : -comparison;
        });
        
        // Reorder DOM
        rows.forEach(row => tbody.appendChild(row));
        
        // Update header
        header.classList.add(isAscending ? 'sort-asc' : 'sort-desc');
        header.querySelector('.sort-icon').textContent = isAscending ? '↑' : '↓';
    }
    
    getColumnIndex(column) {
        const columnMap = {
            'name': 1,
            'performance': 2,
            'bundle': 3,
            'rating': 4
        };
        return columnMap[column] || 1;
    }
    
    handleAction(button) {
        const row = button.closest('tr');
        const name = row.querySelector('td:first-child').textContent;
        
        // Show action feedback
        button.textContent = '✓ Done';
        button.style.background = 'var(--cosmic-accent)';
        
        setTimeout(() => {
            button.textContent = 'Edit';
            button.style.background = '';
        }, 1000);
    }
    
    applyVanillaStyles(element) {
        styleManager.addComponentStyles('data-table', `
            .data-table-container {
                margin: 1rem 0;
            }
            
            .table-label {
                display: block;
                margin-bottom: 0.5rem;
                color: var(--cosmic-light);
                font-family: var(--font-primary);
                font-weight: 600;
            }
            
            .vanilla-table-wrapper {
                background: var(--cosmic-dark);
                border: 2px solid var(--cosmic-neutral);
                border-radius: 8px;
                padding: 1rem;
                margin-bottom: 1rem;
            }
            
            .table-search {
                display: flex;
                gap: 0.5rem;
                margin-bottom: 1rem;
            }
            
            .search-input {
                flex: 1;
                padding: 0.5rem 1rem;
                background: var(--cosmic-darker);
                border: 1px solid var(--cosmic-neutral);
                border-radius: 6px;
                color: var(--cosmic-light);
                font-family: var(--font-secondary);
            }
            
            .search-input:focus {
                outline: none;
                border-color: var(--cosmic-primary);
            }
            
            .search-btn {
                padding: 0.5rem 1rem;
                background: var(--cosmic-primary);
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .search-btn:hover {
                background: var(--cosmic-accent);
            }
            
            .vanilla-data-table {
                width: 100%;
                border-collapse: collapse;
                font-family: var(--font-secondary);
            }
            
            .vanilla-data-table th {
                background: var(--cosmic-darker);
                color: var(--cosmic-light);
                padding: 1rem;
                text-align: left;
                font-weight: 600;
                cursor: pointer;
                user-select: none;
                transition: all 0.3s ease;
                border-bottom: 2px solid var(--cosmic-neutral);
            }
            
            .vanilla-data-table th:hover {
                background: var(--cosmic-neutral);
            }
            
            .vanilla-data-table th.sort-asc,
            .vanilla-data-table th.sort-desc {
                background: var(--cosmic-primary);
                color: white;
            }
            
            .vanilla-data-table td {
                padding: 1rem;
                color: var(--cosmic-light);
                border-bottom: 1px solid var(--cosmic-neutral);
                transition: all 0.3s ease;
            }
            
            .vanilla-data-table tbody tr {
                transition: all 0.3s ease;
            }
            
            .vanilla-data-table tbody tr:hover {
                background: rgba(74, 158, 255, 0.05);
            }
            
            .action-btn {
                padding: 0.25rem 0.75rem;
                background: var(--cosmic-neutral);
                color: var(--cosmic-light);
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-family: var(--font-secondary);
                font-size: 0.875rem;
                transition: all 0.3s ease;
            }
            
            .action-btn:hover {
                background: var(--cosmic-primary);
                color: white;
            }
            
            .table-pagination {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 1rem;
                margin-top: 1rem;
            }
            
            .page-btn {
                padding: 0.5rem 1rem;
                background: var(--cosmic-neutral);
                color: var(--cosmic-light);
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-family: var(--font-primary);
                transition: all 0.3s ease;
            }
            
            .page-btn:hover:not(:disabled) {
                background: var(--cosmic-primary);
            }
            
            .page-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            
            .page-info {
                color: var(--cosmic-neutral);
                font-family: var(--font-secondary);
            }
        `);
    }
    
    applyLibraryStyles(element, libraryId) {
        styleManager.addComponentStyles('data-table-library', `
            .library-table-wrapper {
                background: var(--cosmic-dark);
                border: 2px solid var(--cosmic-neutral);
                border-radius: 8px;
                padding: 1rem;
                margin-bottom: 1rem;
            }
            
            .library-data-table th:hover {
                background: var(--cosmic-secondary);
            }
            
            .library-data-table th.sort-asc,
            .library-data-table th.sort-desc {
                background: var(--cosmic-secondary);
                color: white;
            }
        `);
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ChartComponent,
        DataTableComponent
    };
}
