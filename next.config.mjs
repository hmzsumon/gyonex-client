// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "coin-images.coingecko.com",
        pathname: "/coins/images/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },

  // ── keep your Sass & rewrites ──────────────────────────────
  sassOptions: {
    additionalData: `$var: red;`,
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination:
          "https://gyonex-api-8bd965ca374f.herokuapp.com/api/v1/:path*",
      },
    ];
  },

  // ── enable SVGR so .svg can be imported as React components ─
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            icon: true,
            svgo: true,
            svgoConfig: {
              plugins: [
                { name: "removeAttrs", params: { attrs: "(fill|stroke)" } },
              ],
            },
          },
        },
      ],
    });
    return config;
  },
};

export default nextConfig;
