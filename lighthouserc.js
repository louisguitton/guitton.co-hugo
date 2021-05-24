// https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'hugo server',
      url: [
        "http://localhost:1313/",
        "http://localhost:1313/about",
        "http://localhost:1313/posts",
        "http://localhost:1313/contact",
        "http://localhost:1313/posts/fastapi-monitoring/"
      ],
    },
    upload: {
      target: 'lhci',
      serverBaseUrl: 'https://louisguitton-lhci.herokuapp.com/',
    },
    assert: {
      preset: 'lighthouse:no-pwa',
      assertions: {
        'font-display': 'off',
        'unminified-css': 'off',
        'unsized-images': 'off',
        'unused-css-rules': 'off',
        'uses-text-compression': 'off',
        'unused-javascript': 'off',
        'uses-rel-preconnect': 'off',
        'uses-responsive-images': 'off',
        'image-alt': 'off',
        'link-name': 'off',
        'offscreen-images': 'off',
        'total-byte-weight': 'off',
        'uses-optimized-images': 'off',
        'no-vulnerable-libraries': 'off',
        'color-contrast': 'off',
        'tap-targets': 'off',
      },
    },
  },
};
