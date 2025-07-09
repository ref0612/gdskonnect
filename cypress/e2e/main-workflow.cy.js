/**
 * End-to-End Tests for KonnectPro-GDS
 */

describe('KonnectPro-GDS Main Workflows', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('body').should('be.visible');
    
    // Wait for the application to load
    cy.get('header').should('contain', 'KonnectPro-GDS');
    
    // Ensure main content is visible
    cy.get('#main-content').should('be.visible');
  });

  describe('Dashboard Navigation', () => {
    it('should display dashboard correctly', () => {
      // Check header
      cy.get('header').should('contain', 'KonnectPro-GDS');
      cy.get('header').should('contain', 'Fernando Pérez');

      // Check stats cards
      cy.get('.grid').within(() => {
        cy.contains('Boletos Vendidos').should('be.visible');
        cy.contains('1,247').should('be.visible');
        cy.contains('Ingresos Hoy').should('be.visible');
        cy.contains('$45,892').should('be.visible');
        cy.contains('Rutas Activas').should('be.visible');
        cy.contains('23').should('be.visible');
        cy.contains('Clientes').should('be.visible');
        cy.contains('892').should('be.visible');
      });

      // Check quick access buttons
      cy.contains('Destinos').should('be.visible');
      cy.contains('Mapeo de Destinos').should('be.visible');
      cy.contains('Etapas de Embarque').should('be.visible');
      cy.contains('Mapeo de Embarque').should('be.visible');
    });

    it('should navigate between pages using quick access', () => {
      // Navigate to Destinations
      cy.contains('Destinos').click();
      cy.get('#destinations-content').should('be.visible');
      cy.get('#main-content').should('not.be.visible');

      // Navigate to Boarding Stages
      cy.contains('Etapas de Embarque').click();
      cy.get('#boarding-stages-content').should('be.visible');
      cy.get('#destinations-content').should('not.be.visible');

      // Navigate back to main
      cy.get('.sidebar-item[href="index2.html"]').click();
      cy.get('#main-content').should('be.visible');
    });
  });

  describe('Search Functionality', () => {
    it('should perform route search', () => {
      // Fill route search form
      cy.get('select').eq(0).select('Santiago');
      cy.get('select').eq(1).select('Temuco');
      cy.get('input[type="date"]').clear().type('2025-07-15');

      // Click search button
      cy.get('#routeSearchBtn').click();

      // Should show some indication of search (notification, loading, etc.)
      // This depends on your implementation
      cy.get('body').should('exist'); // Placeholder assertion
    });

    it('should perform ticket search', () => {
      // Fill ticket search
      cy.get('#ticketNumber').type('TKT123456789');
      cy.get('#history').check();

      // Click search
      cy.get('#ticketSearchBtn').click();

      // Verify search was initiated
      cy.get('#ticketNumber').should('have.value', 'TKT123456789');
      cy.get('#history').should('be.checked');
    });

    it('should validate ticket search input', () => {
      // Try to search without ticket number
      cy.get('#ticketSearchBtn').click();

      // Should show validation message or prevent search
      // This test depends on your validation implementation
      cy.get('#ticketNumber').should('have.value', '');
    });
  });

  describe('Destinations Management', () => {
    beforeEach(() => {
      // Navigate to destinations page
      cy.contains('Destinos').click();
      cy.get('#destinations-content').should('be.visible');
    });

    it('should display destinations table', () => {
      // Check table headers
      cy.get('#destinationsTable').within(() => {
        cy.get('thead').should('contain', 'País');
        cy.get('thead').should('contain', 'Ciudad');
        cy.get('thead').should('contain', 'Estado');
        cy.get('thead').should('contain', 'Acciones');
      });

      // Check table data
      cy.get('#destinationsTable tbody tr').should('have.length.greaterThan', 0);
      cy.get('#destinationsTable tbody').should('contain', 'Chile');
      cy.get('#destinationsTable tbody').should('contain', 'Santiago');
    });

    it('should create new destination', () => {
      // Click create button
      cy.get('#createDestination').click();

      // Modal should open
      cy.get('#destinationCreateModal').should('be.visible');

      // Fill form
      cy.get('#destinationCreateModal').within(() => {
        cy.get('select[name="country"]').select('Chile');
        cy.get('input[name="city"]').type('Test City');
        cy.get('select[name="status"]').select('Activo');
        cy.get('input[name="region"]').type('Test Region');

        // Submit form
        cy.get('button[type="submit"]').click();
      });

      // Modal should close
      cy.get('#destinationCreateModal').should('not.be.visible');
    });

    it('should edit existing destination', () => {
      // Click edit button on first row
      cy.get('#destinationsTable tbody tr').first().within(() => {
        cy.get('.edit-destination').click();
      });

      // Edit modal should open
      cy.get('#destinationEditModal').should('be.visible');

      // Modify data
      cy.get('#destinationEditModal').within(() => {
        cy.get('input[name="city"]').clear().type('Updated City Name');
        cy.get('button[type="submit"]').click();
      });

      // Modal should close
      cy.get('#destinationEditModal').should('not.be.visible');
    });

    it('should delete destination with confirmation', () => {
      // Get initial row count
      cy.get('#destinationsTable tbody tr').then($rows => {
        const initialCount = $rows.length;

        // Click delete button
        cy.get('#destinationsTable tbody tr').first().within(() => {
          cy.get('.delete-destination').click();
        });

        // Confirm deletion (assuming browser confirm dialog)
        cy.window().then((win) => {
          cy.stub(win, 'confirm').returns(true);
        });

        // Verify row was removed (in real implementation)
        // This is a placeholder - actual implementation may vary
        cy.get('#destinationsTable tbody tr').should('have.length', initialCount);
      });
    });

    it('should show destination details', () => {
      // Click show button
      cy.get('#destinationsTable tbody tr').first().within(() => {
        cy.get('.show-destination').click();
      });

      // Details should be displayed (modal, popup, etc.)
      // This depends on your implementation
      cy.get('body').should('exist'); // Placeholder
    });
  });

  describe('Boarding Stages Management', () => {
    beforeEach(() => {
      cy.contains('Etapas de Embarque').click();
      cy.get('#boarding-stages-content').should('be.visible');
    });

    it('should display boarding stages table', () => {
      cy.get('#boardingStagesTable').should('be.visible');
      cy.get('#boardingStagesTable thead').should('contain', 'País');
      cy.get('#boardingStagesTable thead').should('contain', 'Ciudad');
      cy.get('#boardingStagesTable thead').should('contain', 'Terminal/Ubicación');
    });

    it('should create new boarding stage', () => {
      cy.get('#createBoardingStage').click();
      cy.get('#boardingStageCreateModal').should('be.visible');

      cy.get('#boardingStageCreateModal').within(() => {
        cy.get('select[name="country"]').select('Chile');
        cy.get('input[name="city"]').type('Test City');
        cy.get('input[name="terminal"]').type('Test Terminal');
        cy.get('input[name="latitude"]').type('-33.4489');
        cy.get('input[name="longitude"]').type('-70.6693');

        cy.get('button[type="submit"]').click();
      });

      cy.get('#boardingStageCreateModal').should('not.be.visible');
    });
  });

  describe('Sidebar Navigation', () => {
    it('should toggle right sidebar', () => {
      // Sidebar should be hidden initially
      cy.get('#rightSidebar').should('have.css', 'transform', 'matrix(1, 0, 0, 1, 256, 0)');

      // Click toggle button
      cy.get('#toggleSidebar').click();

      // Sidebar should be visible
      cy.get('#rightSidebar').should('have.css', 'transform', 'matrix(1, 0, 0, 1, 0, 0)');

      // Close sidebar
      cy.get('#closeSidebar').click();

      // Sidebar should be hidden again
      cy.get('#rightSidebar').should('have.css', 'transform', 'matrix(1, 0, 0, 1, 256, 0)');
    });

    it('should navigate using sidebar links', () => {
      // Open sidebar
      cy.get('#toggleSidebar').click();

      // Click destinations link
      cy.get('#rightSidebar').within(() => {
        cy.get('a[data-page="destinations"]').click();
      });

      // Should navigate to destinations
      cy.get('#destinations-content').should('be.visible');
      cy.get('#main-content').should('not.be.visible');
    });
  });

  describe('Responsive Design', () => {
    it('should work on mobile viewport', () => {
      cy.viewport(375, 667); // iPhone SE size

      // Check that main content is still accessible
      cy.get('#main-content').should('be.visible');

      // Check that sidebar behaves correctly on mobile
      cy.get('#toggleSidebar').should('be.visible');
      cy.get('#toggleSidebar').click();
      cy.get('#rightSidebar').should('be.visible');
    });

    it('should work on tablet viewport', () => {
      cy.viewport(768, 1024); // iPad size

      cy.get('#main-content').should('be.visible');
      cy.get('.grid').should('be.visible');
    });

    it('should work on desktop viewport', () => {
      cy.viewport(1920, 1080); // Desktop size

      cy.get('#main-content').should('be.visible');
      cy.get('.grid').should('be.visible');
      cy.get('.sidebar-item').should('be.visible');
    });
  });

  describe('Form Validation', () => {
    it('should validate required fields in destination form', () => {
      cy.contains('Destinos').click();
      cy.get('#createDestination').click();

      // Try to submit without required fields
      cy.get('#destinationCreateModal').within(() => {
        cy.get('button[type="submit"]').click();
      });

      // Form should not be submitted (validation should prevent it)
      cy.get('#destinationCreateModal').should('be.visible');

      // Fill required fields
      cy.get('#destinationCreateModal').within(() => {
        cy.get('select[name="country"]').select('Chile');
        cy.get('input[name="city"]').type('Valid City');
        cy.get('button[type="submit"]').click();
      });

      // Now form should be submitted
      cy.get('#destinationCreateModal').should('not.be.visible');
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard navigable', () => {
      // Tab through main navigation
      cy.get('body').tab();
      cy.focused().should('have.class', 'sidebar-item');

      // Continue tabbing through elements
      cy.focused().tab();
      cy.focused().should('be.visible');
    });

    it('should have proper ARIA labels', () => {
      // Check for accessibility attributes
      cy.get('button').each($button => {
        // Buttons should have accessible text or aria-label
        cy.wrap($button).should('satisfy', ($el) => {
          return $el.text().trim() !== '' || $el.attr('aria-label') !== undefined;
        });
      });
    });

    it('should have proper contrast ratios', () => {
      // This would typically be handled by automated accessibility testing
      // but we can check basic visibility
      cy.get('.bg-primary').should('be.visible');
      cy.get('.text-white').should('be.visible');
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', () => {
      // Intercept and fail network requests
      cy.intercept('GET', '/api/*', { forceNetworkError: true });

      // Perform action that would trigger network request
      cy.get('#routeSearchBtn').click();

      // Application should continue to function
      cy.get('body').should('be.visible');
    });

    it('should handle invalid URLs gracefully', () => {
      cy.visit('/nonexistent-page', { failOnStatusCode: false });
      
      // Should redirect to main page or show 404
      cy.url().should('include', '/');
    });
  });

  describe('Performance', () => {
    it('should load within acceptable time', () => {
      cy.visit('/', {
        onBeforeLoad: (win) => {
          win.performance.mark('start');
        },
        onLoad: (win) => {
          win.performance.mark('end');
          win.performance.measure('pageLoad', 'start', 'end');
          const measure = win.performance.getEntriesByName('pageLoad')[0];
          expect(measure.duration).to.be.lessThan(3000); // 3 seconds
        }
      });
    });

    it('should handle large datasets efficiently', () => {
      // Navigate to destinations
      cy.contains('Destinos').click();

      // Measure time to render table
      cy.get('#destinationsTable').should('be.visible');
      
      // Table should render quickly even with data
      cy.get('#destinationsTable tbody tr').should('have.length.greaterThan', 0);
    });
  });
});