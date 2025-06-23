// KonnectPro-GDS Main JavaScript File

// Función para búsqueda predictiva en tablas
function setupTableSearch(inputId, tableId) {
    const input = document.getElementById(inputId);
    const table = document.getElementById(tableId);
    
    if (!input || !table) return;
    
    input.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const rows = table.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            let rowMatches = false;
            
            cells.forEach(cell => {
                const cellText = cell.textContent.toLowerCase();
                if (cellText.includes(searchTerm)) {
                    rowMatches = true;
                }
            });
            
            row.style.display = rowMatches ? '' : 'none';
        });
    });
}

// Función para exportar tabla a CSV
function exportTableToCSV(tableId, filename) {
    const table = document.getElementById(tableId);
    if (!table) {
        console.error(`No se encontró la tabla con ID: ${tableId}`);
        return;
    }

    // Obtener filas de la tabla
    const rows = table.querySelectorAll('tr');
    let csv = [];
    
    // Recorrer filas
    for (let i = 0; i < rows.length; i++) {
        const row = [];
        const cols = rows[i].querySelectorAll('td, th');
        
        // Saltar filas vacías
        if (cols.length === 0) continue;
        
        // Recorrer celdas
        for (let j = 0; j < cols.length; j++) {
            // Obtener texto de la celda, eliminando botones y acciones
            const cellText = cols[j].cloneNode(true);
            // Eliminar botones y elementos de acción
            const buttons = cellText.querySelectorAll('button, a, .actions');
            buttons.forEach(btn => btn.remove());
            
            // Limpiar y formatear el texto
            let text = cellText.innerText.replace(/\s+/g, ' ').trim();
            // Escapar comillas dobles
            text = text.replace(/"/g, '""');
            // Si el texto contiene comas o saltos de línea, encerrar en comillas
            if (text.includes(',') || text.includes('\n') || text.includes('"')) {
                text = `"${text}"`;
            }
            row.push(text);
        }
        
        csv.push(row.join(','));
    }
    
    // Crear archivo CSV
    const csvContent = csv.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Crear enlace de descarga
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename || 'export'}_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    
    // Descargar archivo
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function initializeApp() {
    // Global variables
    const sidebar = document.getElementById('rightSidebar');
    const toggleButton = document.getElementById('toggleSidebar');
    const closeButton = document.getElementById('closeSidebar');
    const toggleIcon = toggleButton.querySelector('i');
    const menuItems = sidebar.querySelectorAll('a[data-page]');
    let isOpen = false;

    // Page content elements
    const pages = {
        'main': document.getElementById('main-content'),
        'destinations': document.getElementById('destinations-content'),
        'destination-mappings': document.getElementById('destination-mappings-content'),
        'boarding-stages': document.getElementById('boarding-stages-content'),
        'boarding-mappings': document.getElementById('boarding-mappings-content')
    };

    // Initialize sidebar functionality
    initializeSidebar();
    
    // Initialize modal functionality
    initializeModals();
    
    // Initialize search functionality
    initializeSearch();
    
    // Initialize CRUD operations
    initializeCRUD();
    
    // Initialize form handling
    initializeForms();
    
    // Show main page initially
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.classList.remove('hidden');
        mainContent.style.display = 'block';
        mainContent.style.visibility = 'visible';
        mainContent.style.opacity = '1';
        mainContent.style.height = 'auto';
        console.log('Main content should be visible now');
    }
    // Mostrar la página principal
    showPage('main');

    // Sidebar Functions
    function initializeSidebar() {
        // Menu item click handlers
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.getAttribute('data-page');
                showPage(page);
            });
        });

        // Sidebar toggle functionality
        function toggleSidebar() {
            const rightSidebar = document.getElementById('rightSidebar');
            const isSidebarOpen = rightSidebar.style.transform === 'translateX(0%)' || rightSidebar.style.transform === '';
            
            if (isSidebarOpen) {
                rightSidebar.style.transform = 'translateX(100%)';
                toggleIcon.className = 'ri-menu-fold-line';
            } else {
                rightSidebar.style.transform = 'translateX(0%)';
                toggleIcon.className = 'ri-menu-unfold-line';
            }
        }

        toggleButton.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleSidebar();
        });

        closeButton.addEventListener('click', function(e) {
            e.stopPropagation();
            const rightSidebar = document.getElementById('rightSidebar');
            rightSidebar.style.transform = 'translateX(100%)';
            toggleIcon.className = 'ri-menu-fold-line';
        });

        // Close sidebar when clicking outside
        document.addEventListener('click', function(e) {
            const rightSidebar = document.getElementById('rightSidebar');
            const isClickInsideSidebar = rightSidebar.contains(e.target);
            const isClickOnToggleButton = toggleButton.contains(e.target);
            
            if (!isClickInsideSidebar && !isClickOnToggleButton) {
                rightSidebar.style.transform = 'translateX(100%)';
                toggleIcon.className = 'ri-menu-fold-line';
            }
        });
    }

    // Page Navigation
    function showPage(pageId) {
        closeSidebar(); // Auto-hide right sidebar on page navigation
        console.log(`Attempting to show page: ${pageId}`); // DEBUG

        // Ocultar todas las páginas
        Object.values(pages).forEach(page => {
            if (page) {
                page.classList.add('hidden');
                page.style.display = 'none';
                console.log(`Hiding page: ${page.id}`);
            }
        });
        
        // Mostrar la página solicitada
        if (pages[pageId]) {
            console.log('Found page element:', pages[pageId]);
            // Eliminar la clase hidden y asegurar que se muestre
            pages[pageId].classList.remove('hidden');
            pages[pageId].style.display = 'block';
            pages[pageId].style.visibility = 'visible';
            pages[pageId].style.opacity = '1';
            pages[pageId].style.height = 'auto';
            
            console.log('classList after remove hidden:', pages[pageId].classList);
            
            // Forzar un reflow para asegurar que los estilos se apliquen
            void pages[pageId].offsetWidth;
            
            // Asegurar que el contenedor principal sea visible
            const mainContainer = document.querySelector('.flex-1.overflow-auto');
            if (mainContainer) {
                mainContainer.style.overflow = 'visible';
            }
        } else {
            console.error(`Page element not found for ID: ${pageId}`);
        }

        // Actualizar el ítem de menú activo
        menuItems.forEach(item => {
            item.classList.remove('bg-gray-100');
            if (item.getAttribute('data-page') === pageId) {
                item.classList.add('bg-gray-100');
            }
        });

        // Cargar datos para la página específica
        loadPageData(pageId);
    }

    // Make showPage globally available
    window.showPage = showPage;

    function closeSidebar() {
        const rightSidebar = document.getElementById('rightSidebar');
        if (rightSidebar) {
            rightSidebar.style.transform = 'translateX(100%)';
        }
        // If a global overlay for the sidebar exists, hide it here too.
        // e.g., const sidebarOverlay = document.getElementById('sidebarOverlay');
        // if (sidebarOverlay) sidebarOverlay.classList.add('hidden');
    }

    // Load data based on page
    function loadPageData(pageId) {
        switch(pageId) {
            case 'destinations':
                setupTableControls('destinationsTable', 'Destinos');
                break;
            case 'destination-mappings':
                setupTableControls('destinationMappingsTable', 'Mapeo de Destinos');
                break;
            case 'boarding-stages':
                setupTableControls('boardingStagesTable', 'Etapas de Abordaje');
                break;
            case 'boarding-mappings':
                setupTableControls('boardingMappingsTable', 'Mapeo de Etapas');
                break;
        }
    }
    
    // Add export button and search to table
    function setupTableControls(tableId, tableName) {
        const table = document.getElementById(tableId);
        if (!table) {
            console.error(`Table with ID ${tableId} not found for setupTableControls.`);
            return;
        }

        const tableWrapper = table.parentNode; // Expected: div.overflow-x-auto
        if (!tableWrapper || !tableWrapper.parentNode) {
            console.error(`Cannot find parent structure for table ${tableId}`);
            return;
        }
        const sectionContentDiv = tableWrapper.parentNode; // Expected: div.bg-white.p-4.rounded-b.shadow
        const headerDiv = sectionContentDiv.querySelector('div.flex.justify-between.items-center.mb-4');

        if (!headerDiv) {
            console.error(`Header div for table ${tableId} not found.`);
            return;
        }

        if (headerDiv.querySelector(`#${tableId}Search`)) {
            return; // Controls already set up for this header
        }

        const h3Title = headerDiv.querySelector('h3');
        const createNewButtonOriginal = headerDiv.querySelector('button[id^="create"]'); // e.g., createDestination

        // Create search input structure
        const searchDiv = document.createElement('div');
        searchDiv.className = 'relative'; // Width managed by input's class or flex container
        searchDiv.innerHTML = `
            <input type="text" 
                   id="${tableId}Search" 
                   class="w-full md:w-64 border border-gray-300 rounded py-1.5 px-3 pr-8 text-sm" 
                   placeholder="Buscar en ${tableName}...">
            <i class="ri-search-line absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        `;

        // Create export button
        const exportBtn = document.createElement('button');
        exportBtn.className = 'bg-green-500 hover:bg-green-600 text-white py-1.5 px-4 rounded text-sm flex items-center export-csv-button';
        exportBtn.innerHTML = '<i class="ri-download-line mr-1"></i> Exportar CSV';
        exportBtn.onclick = () => exportTableToCSV(tableId, tableName.toLowerCase().replace(/\s+/g, '_'));

        // Clear existing content of headerDiv to reconstruct it
        headerDiv.innerHTML = '';

        if (h3Title) {
            headerDiv.appendChild(h3Title);
        }
        headerDiv.appendChild(searchDiv); // Title, then Search

        // Container for action buttons (Crear Nuevo, Exportar)
        const actionButtonsContainer = document.createElement('div');
        actionButtonsContainer.className = 'flex items-center gap-2'; // For spacing

        if (createNewButtonOriginal) {
            actionButtonsContainer.appendChild(createNewButtonOriginal);
        }
        actionButtonsContainer.appendChild(exportBtn);

        headerDiv.appendChild(actionButtonsContainer); // Add button group to the header

        setupTableSearch(`${tableId}Search`, tableId);
    }

    // Modal Functions
    function initializeModals() {
        // Close modal event listeners
        document.querySelectorAll('.close-modal, .cancel-modal').forEach(button => {
            button.addEventListener('click', function() {
                const modal = this.closest('.fixed');
                modal.classList.add('hidden');
            });
        });

        // Close modal when clicking backdrop
        document.querySelectorAll('.fixed.inset-0').forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    this.classList.add('hidden');
                }
            });
        });

        // ESC key to close modals
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                document.querySelectorAll('.fixed.inset-0:not(.hidden)').forEach(modal => {
                    modal.classList.add('hidden');
                });
            }
        });
    }

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            // Focus first input
            const firstInput = modal.querySelector('input, select, textarea');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    // Make modal functions globally available
    window.openModal = openModal;
    window.closeModal = closeModal;

    // Search Functions
    function initializeSearch() {
        // Route search
        const routeSearchBtn = document.getElementById('routeSearchBtn');
        if (routeSearchBtn) {
            routeSearchBtn.addEventListener('click', function() {
                showNotification('Búsqueda de rutas iniciada', 'info');
            });
        }

        // Ticket search
        const ticketSearchBtn = document.getElementById('ticketSearchBtn');
        if (ticketSearchBtn) {
            ticketSearchBtn.addEventListener('click', function() {
                const ticketInput = document.getElementById('ticketNumber');
                const historyCheckbox = document.getElementById('history');
                
                if (ticketInput.value.trim() === '') {
                    showNotification('Por favor ingrese un número de boleto', 'warning');
                } else {
                    showNotification(`Buscando boleto: ${ticketInput.value}, Historial: ${historyCheckbox.checked ? 'Sí' : 'No'}`, 'info');
                }
            });
        }

        // Individual search buttons
        const searchButtons = {
            'searchDestinations': () => openSearchModal('destinations', 'Búsqueda de Destinos', [
                { name: 'country', label: 'País', type: 'select', options: ['Chile', 'México'] },
                { name: 'city', label: 'Ciudad', type: 'text' },
                { name: 'status', label: 'Estado', type: 'select', options: ['Activo', 'Inactivo'] },
                { name: 'priority', label: 'Es Prioritario', type: 'select', options: ['YES', 'NO'] }
            ]),
            'searchDestinationMappings': () => openSearchModal('destination-mappings', 'Búsqueda de Mapeos de Destinos', [
                { name: 'travel', label: 'Operador', type: 'select', options: ['Gama Bus', 'Turbus', 'Pullman Bus'] },
                { name: 'apiCity', label: 'Ciudad API', type: 'text' },
                { name: 'ourCity', label: 'Nuestra Ciudad', type: 'text' }
            ]),
            'searchBoardingStages': () => openSearchModal('boarding-stages', 'Búsqueda de Etapas de Embarque', [
                { name: 'country', label: 'País', type: 'select', options: ['México', 'Chile'] },
                { name: 'city', label: 'Ciudad', type: 'text' },
                { name: 'terminal', label: 'Terminal', type: 'text' },
                { name: 'hasCoordinates', label: 'Con Coordenadas', type: 'select', options: ['Sí', 'No'] }
            ]),
            'searchBoardingMappings': () => openSearchModal('boarding-mappings', 'Búsqueda de Mapeos de Embarque', [
                { name: 'travel', label: 'Operador', type: 'select', options: ['Gama Bus', 'Turbus', 'Pullman Bus'] },
                { name: 'ourStage', label: 'Nuestra Etapa', type: 'text' },
                { name: 'apiStage', label: 'Etapa API', type: 'text' }
            ])
        };

        Object.keys(searchButtons).forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.addEventListener('click', searchButtons[buttonId]);
            }
        });
    }

    function openSearchModal(type, title, fields) {
        // Create search modal dynamically
        const searchModal = createSearchModal(title, fields);
        document.body.appendChild(searchModal);
        
        // Show modal
        searchModal.classList.remove('hidden');
        
        // Add event listeners
        const form = searchModal.querySelector('form');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const searchParams = {};
            for (let [key, value] of formData.entries()) {
                if (value.trim()) searchParams[key] = value;
            }
            
            showNotification(`Búsqueda realizada con ${Object.keys(searchParams).length} filtros`, 'success');
            searchModal.remove();
        });

        // Close modal functionality
        searchModal.querySelector('.close-modal').addEventListener('click', () => {
            searchModal.remove();
        });
        
        searchModal.querySelector('.cancel-modal').addEventListener('click', () => {
            searchModal.remove();
        });
    }

    function createSearchModal(title, fields) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg w-[500px] p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-xl font-medium">${title}</h3>
                    <button class="close-modal text-gray-500 hover:text-gray-700">
                        <i class="ri-close-line ri-lg"></i>
                    </button>
                </div>
                <form class="space-y-4">
                    ${fields.map(field => `
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">${field.label}</label>
                            ${field.type === 'select' ? 
                                `<select name="${field.name}" class="w-full border border-gray-300 rounded p-2 text-sm">
                                    <option value="">Seleccionar ${field.label}</option>
                                    ${field.options.map(option => `<option value="${option}">${option}</option>`).join('')}
                                </select>` :
                                `<input type="text" name="${field.name}" class="w-full border border-gray-300 rounded p-2 text-sm" placeholder="Buscar por ${field.label.toLowerCase()}">`
                            }
                        </div>
                    `).join('')}
                    <div class="flex justify-end gap-2 mt-6">
                        <button type="button" class="cancel-modal px-4 py-2 border border-gray-300 rounded-button text-sm">Cancelar</button>
                        <button type="submit" class="px-4 py-2 bg-primary text-white rounded-button text-sm">Buscar</button>
                    </div>
                </form>
            </div>
        `;
        return modal;
    }

    // CRUD Operations
    function initializeCRUD() {
        // Create buttons
        const createButtons = {
            'createDestination': () => openModal('destinationCreateModal'),
            'createDestinationMapping': () => openModal('destinationMappingCreateModal'), 
            'createBoardingStage': () => openModal('boardingStageCreateModal'),
            'createBoardingMapping': () => openModal('boardingMappingCreateModal')
        };

        Object.keys(createButtons).forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.addEventListener('click', createButtons[buttonId]);
            }
        });

        // Edit buttons
        document.querySelectorAll('.edit-destination').forEach(button => {
            button.addEventListener('click', function() {
                const row = this.closest('tr');
                const cells = row.querySelectorAll('td');
                populateEditModal('destinationEditModal', {
                    country: cells[1]?.textContent.trim(),
                    state: cells[2]?.textContent.trim(),
                    city: cells[3]?.textContent.trim(),
                    status: cells[4]?.textContent.trim(),
                    wikipedia: cells[5]?.textContent.trim(),
                    aliases: cells[6]?.textContent.trim(),
                    priority: cells[7]?.textContent.trim(),
                    region: cells[8]?.textContent.trim()
                });
            });
        });

        document.querySelectorAll('.edit-boarding-stage').forEach(button => {
            button.addEventListener('click', function() {
                const row = this.closest('tr');
                const cells = row.querySelectorAll('td');
                populateEditModal('boardingStageEditModal', {
                    country: cells[0]?.textContent.trim(),
                    state: cells[1]?.textContent.trim(),
                    city: cells[2]?.textContent.trim(),
                    terminal: cells[3]?.textContent.trim(),
                    cityName: cells[4]?.textContent.trim(),
                    latitude: cells[5]?.textContent.trim(),
                    longitude: cells[6]?.textContent.trim(),
                    areaName: cells[7]?.textContent.trim()
                });
            });
        });

        // Delete buttons
        document.querySelectorAll('[class*="delete-"]').forEach(button => {
            button.addEventListener('click', function() {
                const type = getEntityType(this.className);
                if (confirm(`¿Está seguro de que desea eliminar este ${type}?`)) {
                    showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} eliminado exitosamente`, 'success');
                    this.closest('tr').remove();
                }
            });
        });

        // Show buttons
        document.querySelectorAll('[class*="show-"]').forEach(button => {
            button.addEventListener('click', function() {
                const row = this.closest('tr');
                const cells = row.querySelectorAll('td');
                const type = getEntityType(this.className);
                showDetailedView(type, cells);
            });
        });
    }

    function populateEditModal(modalId, data) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        const form = modal.querySelector('form');
        Object.keys(data).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field) {
                field.value = data[key] || '';
            }
        });

        openModal(modalId);
    }

    function getEntityType(className) {
        if (className.includes('destination') && !className.includes('mapping')) return 'destino';
        if (className.includes('destination') && className.includes('mapping')) return 'mapeo de destino';
        if (className.includes('boarding') && !className.includes('mapping')) return 'etapa de embarque';
        if (className.includes('boarding') && className.includes('mapping')) return 'mapeo de embarque';
        return 'elemento';
    }

    function showDetailedView(type, cells) {
        let data = [];
        
        if (type === 'destino') {
            data = [
                { label: 'ID', value: cells[0]?.textContent.trim() },
                { label: 'País', value: cells[1]?.textContent.trim() },
                { label: 'Estado', value: cells[2]?.textContent.trim() },
                { label: 'Ciudad', value: cells[3]?.textContent.trim() },
                { label: 'Estado del Registro', value: cells[4]?.textContent.trim() },
                { label: 'Nombre Wikipedia', value: cells[5]?.textContent.trim() },
                { label: 'Aliases', value: cells[6]?.textContent.trim() },
                { label: 'Es Prioritario', value: cells[7]?.textContent.trim() },
                { label: 'Región', value: cells[8]?.textContent.trim() }
            ];
        } else if (type === 'etapa de embarque') {
            data = [
                { label: 'País', value: cells[0]?.textContent.trim() },
                { label: 'Estado', value: cells[1]?.textContent.trim() },
                { label: 'Ciudad', value: cells[2]?.textContent.trim() },
                { label: 'Terminal/Ubicación', value: cells[3]?.textContent.trim() },
                { label: 'Nombre de Ciudad', value: cells[4]?.textContent.trim() },
                { label: 'Latitud', value: cells[5]?.textContent.trim() },
                { label: 'Longitud', value: cells[6]?.textContent.trim() },
                { label: 'Nombre de Área', value: cells[7]?.textContent.trim() }
            ];
        }

        createAndShowDetailModal(`Detalles del ${type}`, data);
    }

    function createAndShowDetailModal(title, data) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg w-[700px] p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-xl font-medium">${title}</h3>
                    <button class="close-modal text-gray-500 hover:text-gray-700">
                        <i class="ri-close-line ri-lg"></i>
                    </button>
                </div>
                <div class="space-y-4">
                    ${data.map(item => `
                        <div class="flex justify-between items-center py-2 border-b border-gray-200">
                            <span class="font-medium text-gray-700">${item.label}:</span>
                            <span class="text-gray-900">${item.value || '-'}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="flex justify-end mt-6">
                    <button class="close-modal px-4 py-2 bg-primary text-white rounded-button text-sm">Cerrar</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.classList.remove('hidden');

        // Add close functionality
        modal.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => modal.remove());
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    // Form Handling
    function initializeForms() {
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                if (!validateForm(this)) {
                    showNotification('Por favor complete todos los campos requeridos', 'error');
                    return;
                }

                const modal = this.closest('.fixed');
                const isEdit = modal.id.includes('Edit');
                const type = getFormType(modal.id);
                
                const action = isEdit ? 'actualizado' : 'creado';
                showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} ${action} exitosamente`, 'success');

                // Simulate adding new row for create operations
                if (!isEdit) {
                    const formData = new FormData(this);
                    addNewRowToTable(modal.id, formData);
                }

                modal.classList.add('hidden');
                this.reset();
            });
        });

        // Real-time validation
        document.querySelectorAll('input[required], select[required]').forEach(field => {
            field.addEventListener('blur', function() {
                validateField(this);
            });
        });
    }

    function validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('invalid');
                isValid = false;
            } else {
                field.classList.remove('invalid');
                field.classList.add('valid');
            }
        });

        return isValid;
    }

    function validateField(field) {
        if (field.hasAttribute('required') && !field.value.trim()) {
            field.classList.add('invalid');
            field.classList.remove('valid');
        } else {
            field.classList.remove('invalid');
            field.classList.add('valid');
        }
    }

    function getFormType(modalId) {
        if (modalId.includes('destination') && !modalId.includes('mapping')) return 'destino';
        if (modalId.includes('destination') && modalId.includes('mapping')) return 'mapeo de destino';
        if (modalId.includes('boarding') && !modalId.includes('mapping')) return 'etapa de embarque';
        if (modalId.includes('boarding') && modalId.includes('mapping')) return 'mapeo de embarque';
        return 'elemento';
    }

    function addNewRowToTable(modalId, formData) {
        // Implementation depends on the specific table structure
        // This is a simplified version
        const type = getFormType(modalId);
        showNotification(`Nueva fila agregada a la tabla de ${type}s`, 'info');
        
        // In a real application, you would:
        // 1. Send data to server
        // 2. Refresh the table or add the row dynamically
        // 3. Update pagination if needed
    }

    // Notification System
    function showNotification(message, type = 'info') {
        const colors = {
            info: 'bg-primary',
            success: 'bg-green-600',
            warning: 'bg-yellow-600',
            error: 'bg-red-600'
        };

        const icons = {
            info: 'ri-information-line',
            success: 'ri-check-line',
            warning: 'ri-alert-triangle-line',
            error: 'ri-error-warning-line'
        };

        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 ${colors[type]} text-white p-4 rounded-lg shadow-lg z-[60] transform transition-transform duration-300 notification`;
        notification.innerHTML = `
            <div class="flex items-center gap-2">
                <i class="${icons[type]}"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200">
                    <i class="ri-close-line"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 3000);
    }

    // Make notification function globally available
    window.showNotification = showNotification;

    // Pagination functionality
    document.querySelectorAll('.flex.items-center.justify-center.w-6.h-6').forEach(button => {
        button.addEventListener('click', function() {
            const isNext = this.querySelector('.ri-arrow-right-s-line');
            const isPrev = this.querySelector('.ri-arrow-left-s-line');
            if (isNext || isPrev) {
                showNotification(`${isNext ? 'Siguiente' : 'Anterior'} página cargada`, 'info');
            }
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            // Focus search input or open search modal
            const searchInput = document.querySelector('input[placeholder*="Boleto"]');
            if (searchInput) searchInput.focus();
        }

        // Ctrl/Cmd + N for new item
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            // Find and click the first "Crear Nuevo" button visible
            const createBtn = document.querySelector('#createDestination:not(.hidden), #createBoardingStage:not(.hidden)');
            if (createBtn) createBtn.click();
        }
    });

    // Initialize tooltips
    function initializeTooltips() {
        document.querySelectorAll('[title]').forEach(element => {
            element.addEventListener('mouseenter', function() {
                showTooltip(this, this.getAttribute('title'));
            });
            
            element.addEventListener('mouseleave', function() {
                hideTooltip();
            });
        });
    }

    function showTooltip(element, text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'absolute bg-gray-900 text-white text-xs rounded px-2 py-1 z-[70] pointer-events-none';
        tooltip.textContent = text;
        tooltip.id = 'tooltip';
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
    }

    function hideTooltip() {
        const tooltip = document.getElementById('tooltip');
        if (tooltip) tooltip.remove();
    }

    // Initialize tooltips
    initializeTooltips();

    // Performance monitoring
    function logPerformance() {
        if (window.performance) {
            const timing = window.performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            console.log(`Page load time: ${loadTime}ms`);
        }
    }

    // Log performance on load
    window.addEventListener('load', logPerformance);

    // Error handling
    window.addEventListener('error', function(e) {
        console.error('JavaScript error:', e.error);
        showNotification('Ha ocurrido un error. Por favor, recarga la página.', 'error');
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled promise rejection:', e.reason);
        showNotification('Error en la aplicación. Contacte al soporte técnico.', 'error');
    });

    // Mostrar la página principal (dashboard) por defecto
    if (typeof showPage === 'function') {
        showPage('main');
    } else {
        console.error('showPage function is not defined at the time of calling for default page load.');
    }
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});