module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/index2.html'
      ],
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
        preset: 'desktop',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        skipAudits: [
          'canonical',
          'maskable-icon',
          'offline-start-url',
          'service-worker'
        ]
      }
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.85 }],
        'categories:seo': ['warn', { minScore: 0.8 }],
        
        // Performance audits
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 4000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        'speed-index': ['warn', { maxNumericValue: 3000 }],

        // Accessibility audits
        'color-contrast': 'error',
        'heading-order': 'error',
        'html-has-lang': 'error',
        'image-alt': 'error',
        'label': 'error',
        'link-name': 'error',
        'list': 'error',
        'meta-viewport': 'error',
        'button-name': 'error',
        'frame-title': 'error',
        'input-image-alt': 'error',
        'object-alt': 'error',
        'video-caption': 'error',

        // Best practices
        'uses-https': 'error',
        'uses-http2': 'warn',
        'no-vulnerable-libraries': 'error',
        'charset': 'error',
        'doctype': 'error',
        'no-document-write': 'error',
        'external-anchors-use-rel-noopener': 'error',
        'geolocation-on-start': 'error',
        'notification-on-start': 'error',
        'password-inputs-can-be-pasted-into': 'error',

        // SEO audits
        'document-title': 'error',
        'meta-description': 'warn',
        'http-status-code': 'error',
        'font-size': 'error',
        'crawlable-anchors': 'error',
        'is-crawlable': 'error',
        'robots-txt': 'warn',
        'hreflang': 'warn',
        'plugins': 'error',

        // Progressive Web App (optional)
        'installable-manifest': 'off',
        'apple-touch-icon': 'off',
        'themed-omnibox': 'off'
      }
    },
    upload: {
      target: 'temporary-public-storage'
    },
    server: {
      command: 'npm start',
      port: 3000,
      timeout: 30000
    }
  }
};