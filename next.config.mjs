/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ensure the externals array exists
      config.externals = config.externals || [];
      // Exclude ffmpeg-static so that the actual binary path is preserved at runtime.
      config.externals.push({
        "ffmpeg-static": "commonjs ffmpeg-static",
      });
    }
    return config;
  },
};

export default nextConfig;
