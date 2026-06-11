// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

  sassOptions: {
    additionalData: `$var: red;`,
  },

  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "https://api-5-223-80-101.nip.io/api/v1/:path*",
      },
    ];
  },

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