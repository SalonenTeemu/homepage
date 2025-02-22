/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	eslint: {
		ignoreDuringBuilds: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "crests.football-data.org",
				port: "",
				pathname: "/**",
			},
		],
	},
};

export default nextConfig;
