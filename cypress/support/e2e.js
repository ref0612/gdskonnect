// Cypress support file with custom commands and global configuration

import 'cypress-axe';

// Custom Commands for KonnectPro-GDS

/**
 * Navigate to specific page in the application
 */
Cypress.Commands.add('navigateToPage', (pageName) => {
  cy.contains(pageName).click();
  cy.get(`#${pageName.toLowerCase().replace(/\s+/g, '-')}-content`).should('be.visible');
});

/**
 * Fill and submit destination form
 */
Cypress.Commands.add('fillDestinationForm', (destinationData) => {
  cy.get('select[name="country"]').select(destinationData.country);
  cy.get('input[name="city"]').type(destinationData.city);
  if (destinationData.state) {
    cy.get('input[name="state"]').type(destinationData.state);
  }
  cy.get('select[name="status"]').select(destinationData.status || 'Activo');
  if (destinationData.region) {
    cy.get('input[name="region"]').type(destinationData.region);
  }
  if (destinationData.wikipedia) {
    cy.get('input[name="wikipedia"]').type(destinationData.wikipedia);
  }
  if (destinationData.aliases) {
    cy.get('input[name="aliases"]').type(destinationData.aliases);
  }
  if (destinationData.priority) {
    cy.get('select[name="priority"]').select(destinationData.priority);
  }
});

/**
 * Fill and submit boarding stage form
 */
Cypress.Commands.add('fillBoardingStageForm', (stageData) => {
  cy.get('select[name="country"]').select(stageData.country);
  cy.get('input[name="city"]').type(stageData.city);
  cy.get('input[name="terminal"]').type(stageData.terminal);
  if (stageData.state) {
    cy.get('input[name="state"]').type(stageData.state);
  }
  if (stageData.cityName) {
    cy.get('input[name="cityName"]').type(stageData.cityName);
  }
  if (stageData.latitude) {
    cy.get('input[name="latitude"]').type(stageData.latitude);
  }
  if (stageData.longitude) {
    cy.get('input[name="longitude"]').type(stageData.longitude);
  }
  if (stageData.areaName) {
    cy.get('input[name="areaName"]').type(stageData.areaName);
  }
});

/**
 * Wait for notification to appear and verify message
 */
Cypress.Commands.add('checkNotification', (message, type = 'info') => {
  cy.get('.notification').should('be.visible');
  if (message) {
    cy.get('.notification').should('contain', message);
  }
  // Wait for notification to disappear
  cy.get('.notification', { timeout: 5000 }).should('not.exist');
});

/**
 * Open and verify modal
 */
Cypress.Commands.add('openModal', (modalId) => {
  cy.get(`#${modalId}`).should('be.visible');
  cy.get(`#${modalId}`).should('not.have.class', 'hidden');
});

/**
 * Close modal and verify it's hidden
 */
Cypress.Commands.add('closeModal', (modalId) => {
  cy.get(`#${modalId} .close-modal`).click();
  cy.get(`#${modalId}`).should('have.class', 'hidden');
});

/**
 * Perform table search
 */
Cypress.Commands.add('searchInTable', (tableId, searchTerm) => {
  cy.get(`#${tableId}Search`).type(searchTerm);
  cy.wait(500); // Wait for search to filter results
});

/**
 * Verify table row count
 */
Cypress.Commands.add('verifyTableRowCount', (tableId, expectedCount) => {
  cy.get(`#${tableId} tbody tr:visible`).should('have.length', expectedCount);
});

/**
 * Login command (for future authentication implementation)
 */
Cypress.Commands.add('login', (username, password) => {
  cy.session([username, password], () => {
    // Implementation depends on your auth system
    cy.visit('/login');
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('not.include', '/login');
  });
});

/**
 * Check accessibility violations
 */
Cypress.Commands.add('checkA11y', (selector, options) => {
  cy.injectAxe();
  cy.checkA11y(selector, options);
});

/**
 * Take screenshot with timestamp
 */
Cypress.Commands.add('screenshotWithTimestamp', (name) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  cy.screenshot(`${name}-${timestamp}`);
});

/**
 * Wait for page to be fully loaded
 */
Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('body').should('be.visible');
  cy.get('header').should('contain', 'KonnectPro-GDS');
  cy.get('#main-content').should('be.visible');
});

/**
 * Check responsive design at different viewports
 */
Cypress.Commands.add('checkResponsive', (callback) => {
  const viewports = [
    { width: 375, height: 667, name: 'mobile' },
    { width: 768, height: 1024, name: 'tablet' },
    { width: 1280, height: 720, name: 'desktop' },
    { width: 1920, height: 1080, name: 'large-desktop' }
  ];

  viewports.forEach(viewport => {
    cy.viewport(viewport.width, viewport.height);
    cy.log(`Testing ${viewport.name} viewport: ${viewport.width}x${viewport.height}`);
    if (callback) {
      callback(viewport);
    }
  });
});

/**
 * Simulate network conditions
 */
Cypress.Commands.add('simulateNetworkConditions', (condition) => {
  switch (condition) {
    case 'slow':
      cy.intercept('**/*', (req) => {
        req.reply((res) => {
          // Simulate slow network
          return new Promise(resolve => {
            setTimeout(() => resolve(res), 2000);
          });
        });
      });
      break;
    case 'offline':
      cy.intercept('**/*', { forceNetworkError: true });
      break;
    case 'error':
      cy.intercept('**/*', { statusCode: 500 });
      break;
  }
});

/**
 * Test keyboard navigation
 */
Cypress.Commands.add('testKeyboardNavigation', () => {
  // Tab through focusable elements
  cy.get('body').tab();
  cy.focused().should('be.visible');
  
  // Continue tabbing and verify focus is visible
  for (let i = 0; i < 5; i++) {
    cy.focused().tab();
    cy.focused().should('be.visible');
  }
});

/**
 * Verify form validation
 */
Cypress.Commands.add('testFormValidation', (formSelector, requiredFields) => {
  // Try to submit form without required fields
  cy.get(`${formSelector} button[type="submit"]`).click();
  
  // Check that form is still visible (not submitted)
  cy.get(formSelector).should('be.visible');
  
  // Fill required fields one by one and verify validation
  requiredFields.forEach(field => {
    cy.get(`${formSelector} [name="${field.name}"]`).type(field.value);
    if (field.type === 'select') {
      cy.get(`${formSelector} select[name="${field.name}"]`).select(field.value);
    }
  });
  
  // Now form should be submittable
  cy.get(`${formSelector} button[type="submit"]`).click();
});

/**
 * Performance measurement
 */
Cypress.Commands.add('measurePerformance', (actionName, callback) => {
  cy.window().then((win) => {
    win.performance.mark(`${actionName}-start`);
  });
  
  if (callback) {
    callback();
  }
  
  cy.window().then((win) => {
    win.performance.mark(`${actionName}-end`);
    win.performance.measure(actionName, `${actionName}-start`, `${actionName}-end`);
    
    const measure = win.performance.getEntriesByName(actionName)[0];
    cy.log(`${actionName} took ${measure.duration}ms`);
    
    // Assert performance threshold
    expect(measure.duration).to.be.lessThan(5000); // 5 seconds max
  });
});

// Global configuration
beforeEach(() => {
  // Set up common test environment
  cy.on('uncaught:exception', (err, runnable) => {
    // Don't fail tests on uncaught exceptions (adjust as needed)
    console.error('Uncaught exception:', err);
    return false;
  });
});

// Add custom assertions
chai.use((chai, utils) => {
  chai.Assertion.addMethod('visible', function() {
    const obj = this._obj;
    this.assert(
      obj.is(':visible'),
      'expected #{this} to be visible',
      'expected #{this} to not be visible'
    );
  });
});

// Accessibility testing setup
beforeEach(() => {
  cy.injectAxe();
});

afterEach(() => {
  // Check for accessibility violations after each test
  cy.checkA11y(null, {
    includedImpacts: ['critical', 'serious']
  });
});

// Performance monitoring
Cypress.on('window:before:load', (win) => {
  win.performance.mark('test-start');
});

// Custom error handling
Cypress.on('fail', (err, runnable) => {
  // Take screenshot on failure
  cy.screenshotWithTimestamp('failure');
  
  // Log additional debug information
  cy.log('Test failed:', err.message);
  cy.log('Test:', runnable.title);
  
  throw err;
});

// Network request logging (for debugging)
beforeEach(() => {
  cy.intercept('**/*', (req) => {
    cy.log(`${req.method} ${req.url}`);
  });
});