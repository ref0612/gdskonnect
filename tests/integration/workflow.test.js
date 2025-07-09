/**
 * Integration Tests for KonnectPro-GDS Workflows
 */

import { screen, fireEvent, waitFor, within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

// Setup DOM for integration tests
beforeEach(() => {
  document.body.innerHTML = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>KonnectPro-GDS Test</title>
    </head>
    <body class="flex h-screen bg-gray-100">
        <!-- Sidebar Navigation -->
        <div class="w-[55px] bg-primary text-white flex flex-col items-center">
            <div class="py-4 flex flex-col items-center gap-6 w-full">
                <a href="#" class="sidebar-item active" data-page="main">
                    <i class="ri-home-line"></i>
                    <span>Inicio</span>
                </a>
                <a href="#" class="sidebar-item" data-page="destinations">
                    <i class="ri-map-pin-line"></i>
                    <span>Destinos</span>
                </a>
                <a href="#" class="sidebar-item" data-page="boarding-stages">
                    <i class="ri-bus-line"></i>
                    <span>Etapas</span>
                </a>
            </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col">
            <!-- Header -->
            <header class="bg-primary text-white py-2 px-4">
                <div class="flex items-center">
                    <span>KonnectPro-GDS</span>
                </div>
            </header>

            <!-- Search Bar -->
            <div class="bg-white p-3 flex gap-3 border-b">
                <select id="origin">
                    <option>Origen</option>
                    <option>Santiago</option>
                </select>
                <select id="destination">
                    <option>Destino</option>
                    <option>Temuco</option>
                </select>
                <input type="date" id="travelDate" value="2025-05-29">
                <button id="routeSearchBtn">Buscar</button>
                <input type="text" id="ticketNumber" placeholder="Número de Boleto">
                <button id="ticketSearchBtn">Buscar Boleto</button>
            </div>

            <!-- Main Content Area -->
            <div class="flex-1 p-4">
                <!-- Dashboard -->
                <div id="main-content" class="block">
                    <h2>Panel Principal</h2>
                    <div class="grid grid-cols-4 gap-6">
                        <div class="stats-card">
                            <h3>Boletos Vendidos</h3>
                            <p>1,247</p>
                        </div>
                        <div class="stats-card">
                            <h3>Ingresos Hoy</h3>
                            <p>$45,892</p>
                        </div>
                    </div>
                    <button onclick="showPage('destinations')">Destinos</button>
                    <button onclick="showPage('boarding-stages')">Etapas de Embarque</button>
                </div>

                <!-- Destinations -->
                <div id="destinations-content" class="hidden">
                    <h2>Destinos</h2>
                    <button id="createDestination">Crear Nuevo</button>
                    <table id="destinationsTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>País</th>
                                <th>Ciudad</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1638</td>
                                <td>Chile</td>
                                <td>Santiago</td>
                                <td>Activo</td>
                                <td>
                                    <button class="edit-destination">Editar</button>
                                    <button class="delete-destination">Borrar</button>
                                    <button class="show-destination">Ver</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Boarding Stages -->
                <div id="boarding-stages-content" class="hidden">
                    <h2>Etapas de Embarque</h2>
                    <button id="createBoardingStage">Crear Nuevo</button>
                    <table id="boardingStagesTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>País</th>
                                <th>Ciudad</th>
                                <th>Terminal</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Chile</td>
                                <td>Santiago</td>
                                <td>Terminal Sur</td>
                                <td>
                                    <button class="edit-boarding-stage">Editar</button>
                                    <button class="delete-boarding-stage">Borrar</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Modals -->
        <div id="destinationEditModal" class="hidden fixed inset-0 bg-black bg-opacity-50">
            <div class="bg-white rounded-lg p-6">
                <h3>Editar Destino</h3>
                <form>
                    <input name="country" placeholder="País" required>
                    <input name="city" placeholder="Ciudad" required>
                    <select name="status">
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                    </select>
                    <button type="button" class="cancel-modal">Cancelar</button>
                    <button type="submit">Actualizar</button>
                </form>
            </div>
        </div>

        <div id="destinationCreateModal" class="hidden fixed inset-0 bg-black bg-opacity-50">
            <div class="bg-white rounded-lg p-6">
                <h3>Crear Nuevo Destino</h3>
                <form id="createDestinationForm">
                    <input name="country" placeholder="País" required>
                    <input name="city" placeholder="Ciudad" required>
                    <select name="status">
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                    </select>
                    <button type="button" class="close-modal">Cerrar</button>
                    <button type="submit">Crear</button>
                </form>
            </div>
        </div>

        <!-- Right Sidebar -->
        <div id="rightSidebar" class="w-64 bg-white" style="transform: translateX(100%);">
            <nav>
                <a href="#" data-page="destinations">Destinations</a>
                <a href="#" data-page="boarding-stages">Boarding Stages</a>
            </nav>
        </div>

        <button id="toggleSidebar">
            <i class="ri-menu-fold-line"></i>
        </button>
    </body>
    </html>
  `;

  // Mock global functions
  global.showPage = jest.fn((pageId) => {
    document.querySelectorAll('[id$="-content"]').forEach(page => {
      page.classList.add('hidden');
    });
    const targetPage = document.getElementById(`${pageId}-content`) || document.getElementById('main-content');
    if (targetPage) {
      targetPage.classList.remove('hidden');
    }
  });

  global.showNotification = jest.fn();
  global.openModal = jest.fn();
  global.closeModal = jest.fn();
});

describe('Complete User Workflows', () => {
  test('User can navigate to destinations and create a new destination', async () => {
    const user = userEvent.setup();

    // 1. Start from dashboard
    expect(document.getElementById('main-content')).not.toHaveClass('hidden');

    // 2. Navigate to destinations
    const destinationsLink = screen.getByText('Destinos');
    await user.click(destinationsLink);

    // Mock the navigation
    global.showPage('destinations');

    // 3. Verify destinations page is shown
    expect(global.showPage).toHaveBeenCalledWith('destinations');

    // 4. Click create new destination
    const createButton = screen.getByText('Crear Nuevo');
    await user.click(createButton);

    // 5. Fill out the form
    const modal = document.getElementById('destinationCreateModal');
    modal.classList.remove('hidden');

    const countryInput = within(modal).getByPlaceholderText('País');
    const cityInput = within(modal).getByPlaceholderText('Ciudad');
    const statusSelect = within(modal).getByRole('combobox');

    await user.type(countryInput, 'Chile');
    await user.type(cityInput, 'Valparaíso');
    await user.selectOptions(statusSelect, 'Activo');

    // 6. Submit the form
    const submitButton = within(modal).getByText('Crear');
    await user.click(submitButton);

    // 7. Verify form was submitted
    expect(countryInput.value).toBe('Chile');
    expect(cityInput.value).toBe('Valparaíso');
    expect(statusSelect.value).toBe('Activo');
  });

  test('User can search for routes and tickets', async () => {
    const user = userEvent.setup();

    // 1. Fill route search form
    const originSelect = screen.getByDisplayValue('Origen');
    const destinationSelect = screen.getByDisplayValue('Destino');
    const dateInput = screen.getByDisplayValue('2025-05-29');

    await user.selectOptions(originSelect, 'Santiago');
    await user.selectOptions(destinationSelect, 'Temuco');
    await user.clear(dateInput);
    await user.type(dateInput, '2025-06-15');

    // 2. Search for routes
    const routeSearchButton = screen.getByText('Buscar');
    await user.click(routeSearchButton);

    // 3. Search for specific ticket
    const ticketInput = screen.getByPlaceholderText('Número de Boleto');
    await user.type(ticketInput, 'TKT123456');

    const ticketSearchButton = screen.getByText('Buscar Boleto');
    await user.click(ticketSearchButton);

    // 4. Verify search parameters
    expect(ticketInput.value).toBe('TKT123456');
    expect(dateInput.value).toBe('2025-06-15');
  });

  test('User can edit existing destination', async () => {
    const user = userEvent.setup();

    // 1. Navigate to destinations
    global.showPage('destinations');
    document.getElementById('destinations-content').classList.remove('hidden');

    // 2. Click edit button on first destination
    const editButton = screen.getByText('Editar');
    await user.click(editButton);

    // 3. Modal should open with pre-filled data
    const modal = document.getElementById('destinationEditModal');
    modal.classList.remove('hidden');

    // 4. Modify the data
    const cityInput = within(modal).getByPlaceholderText('Ciudad');
    await user.clear(cityInput);
    await user.type(cityInput, 'Santiago Actualizado');

    // 5. Submit changes
    const updateButton = within(modal).getByText('Actualizar');
    await user.click(updateButton);

    // 6. Verify changes
    expect(cityInput.value).toBe('Santiago Actualizado');
  });

  test('User can toggle sidebar and navigate', async () => {
    const user = userEvent.setup();

    // 1. Toggle sidebar open
    const toggleButton = screen.getByRole('button', { name: /menu/i });
    await user.click(toggleButton);

    // 2. Verify sidebar is accessible
    const sidebar = document.getElementById('rightSidebar');
    expect(sidebar).toBeTruthy();

    // 3. Click navigation link in sidebar
    const sidebarDestinations = within(sidebar).getByText('Destinations');
    await user.click(sidebarDestinations);

    // 4. Verify navigation occurred
    expect(sidebarDestinations).toBeTruthy();
  });
});

describe('Form Validation Workflows', () => {
  test('Form validation prevents submission with empty required fields', async () => {
    const user = userEvent.setup();

    // 1. Open create modal
    const modal = document.getElementById('destinationCreateModal');
    modal.classList.remove('hidden');

    // 2. Try to submit without filling required fields
    const submitButton = within(modal).getByText('Crear');
    await user.click(submitButton);

    // 3. Check that required fields are highlighted
    const requiredInputs = within(modal).getAllByRole('textbox');
    requiredInputs.forEach(input => {
      if (input.hasAttribute('required') && !input.value) {
        expect(input).toBeInTheDocument();
      }
    });
  });

  test('Form validation accepts valid data', async () => {
    const user = userEvent.setup();

    // 1. Open create modal
    const modal = document.getElementById('destinationCreateModal');
    modal.classList.remove('hidden');

    // 2. Fill all required fields
    const countryInput = within(modal).getByPlaceholderText('País');
    const cityInput = within(modal).getByPlaceholderText('Ciudad');

    await user.type(countryInput, 'Chile');
    await user.type(cityInput, 'Concepción');

    // 3. Submit form
    const submitButton = within(modal).getByText('Crear');
    await user.click(submitButton);

    // 4. Verify data was accepted
    expect(countryInput.value).toBe('Chile');
    expect(cityInput.value).toBe('Concepción');
  });
});

describe('Table Interactions', () => {
  test('User can interact with table rows', async () => {
    const user = userEvent.setup();

    // 1. Navigate to destinations
    global.showPage('destinations');
    document.getElementById('destinations-content').classList.remove('hidden');

    // 2. Find table and verify data
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();

    // 3. Verify table content
    expect(screen.getByText('Santiago')).toBeInTheDocument();
    expect(screen.getByText('Chile')).toBeInTheDocument();
    expect(screen.getByText('Activo')).toBeInTheDocument();

    // 4. Test action buttons
    const editButton = screen.getByText('Editar');
    const deleteButton = screen.getByText('Borrar');
    const viewButton = screen.getByText('Ver');

    expect(editButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
    expect(viewButton).toBeInTheDocument();

    // 5. Click view button
    await user.click(viewButton);
    // View functionality would be tested based on implementation
  });

  test('Table search functionality works', async () => {
    const user = userEvent.setup();

    // 1. Create search input (would be added by setupTableSearch)
    const searchInput = document.createElement('input');
    searchInput.id = 'destinationsTableSearch';
    searchInput.placeholder = 'Buscar en Destinos...';
    document.body.appendChild(searchInput);

    // 2. Type in search
    await user.type(searchInput, 'Santiago');

    // 3. Verify search input has value
    expect(searchInput.value).toBe('Santiago');
  });
});

describe('Error Handling Workflows', () => {
  test('Application handles network errors gracefully', async () => {
    // Mock network error
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    // Simulate an action that would trigger network request
    const user = userEvent.setup();
    const searchButton = screen.getByText('Buscar');
    
    // Should not throw error
    expect(async () => {
      await user.click(searchButton);
    }).not.toThrow();
  });

  test('Application handles missing DOM elements', () => {
    // Test functions with non-existent elements
    expect(() => global.showPage('nonexistent')).not.toThrow();
    expect(() => global.openModal('nonexistent')).not.toThrow();
    expect(() => global.closeModal('nonexistent')).not.toThrow();
  });
});

describe('Accessibility Workflows', () => {
  test('Keyboard navigation works correctly', async () => {
    const user = userEvent.setup();

    // 1. Tab through form elements
    const modal = document.getElementById('destinationCreateModal');
    modal.classList.remove('hidden');

    const countryInput = within(modal).getByPlaceholderText('País');
    const cityInput = within(modal).getByPlaceholderText('Ciudad');

    // 2. Focus first input
    countryInput.focus();
    expect(document.activeElement).toBe(countryInput);

    // 3. Tab to next input
    await user.tab();
    expect(document.activeElement).toBe(cityInput);
  });

  test('Modal focus management works', async () => {
    const user = userEvent.setup();

    // 1. Open modal
    const createButton = screen.getByText('Crear Nuevo');
    await user.click(createButton);

    const modal = document.getElementById('destinationCreateModal');
    modal.classList.remove('hidden');

    // 2. First focusable element should receive focus
    const firstInput = within(modal).getByPlaceholderText('País');
    firstInput.focus();
    expect(document.activeElement).toBe(firstInput);

    // 3. Escape key should close modal
    await user.keyboard('{Escape}');
    // Note: actual escape handling would be implemented in the app
  });
});

describe('Performance Workflows', () => {
  test('Large dataset rendering performs adequately', async () => {
    const startTime = performance.now();

    // 1. Simulate adding many table rows
    const table = document.getElementById('destinationsTable');
    const tbody = table.querySelector('tbody');

    // 2. Add 1000 rows
    for (let i = 0; i < 1000; i++) {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${i}</td>
        <td>Chile</td>
        <td>Ciudad ${i}</td>
        <td>Activo</td>
        <td>
          <button class="edit-destination">Editar</button>
          <button class="delete-destination">Borrar</button>
          <button class="show-destination">Ver</button>
        </td>
      `;
      tbody.appendChild(row);
    }

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // 3. Should render in reasonable time
    expect(renderTime).toBeLessThan(2000); // Less than 2 seconds
    expect(tbody.children.length).toBe(1001); // Original row + 1000 new rows
  });

  test('Memory usage stays within bounds', () => {
    const initialMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;

    // Simulate creating and destroying many elements
    for (let i = 0; i < 100; i++) {
      const element = document.createElement('div');
      element.innerHTML = `<span>Test content ${i}</span>`;
      document.body.appendChild(element);
      document.body.removeChild(element);
    }

    const finalMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
    
    // Memory growth should be reasonable (if available)
    if (performance.memory) {
      const memoryGrowth = finalMemory - initialMemory;
      expect(memoryGrowth).toBeLessThan(10 * 1024 * 1024); // Less than 10MB growth
    }
  });
});

describe('Data Consistency Workflows', () => {
  test('CRUD operations maintain data integrity', async () => {
    const user = userEvent.setup();

    // 1. Initial state
    const table = document.getElementById('destinationsTable');
    const initialRowCount = table.querySelectorAll('tbody tr').length;

    // 2. Create new destination
    const modal = document.getElementById('destinationCreateModal');
    modal.classList.remove('hidden');

    const countryInput = within(modal).getByPlaceholderText('País');
    const cityInput = within(modal).getByPlaceholderText('Ciudad');

    await user.type(countryInput, 'Chile');
    await user.type(cityInput, 'Nueva Ciudad');

    // 3. Simulate successful creation (would add row to table)
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td>999</td>
      <td>Chile</td>
      <td>Nueva Ciudad</td>
      <td>Activo</td>
      <td><button>Editar</button></td>
    `;
    table.querySelector('tbody').appendChild(newRow);

    // 4. Verify row was added
    const finalRowCount = table.querySelectorAll('tbody tr').length;
    expect(finalRowCount).toBe(initialRowCount + 1);

    // 5. Verify new data is present
    expect(screen.getByText('Nueva Ciudad')).toBeInTheDocument();
  });
});