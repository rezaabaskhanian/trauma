// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   /* config options here */
//   reactCompiler: true,
// };

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_URL || '',
  images: {
    unoptimized: true,
  },
}

export default nextConfig