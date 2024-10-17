// next.config.mjs
export default {
    webpack: (config, { dev }) => {
      if (dev) {
        config.cache = false; // Disabilita la cache di Webpack in modalità sviluppo
      }
      return config;
    },
    experimental: {
    },
  };
  