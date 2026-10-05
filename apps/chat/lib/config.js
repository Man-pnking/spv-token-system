export const config = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,

  chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID || 137),
  chainName: process.env.NEXT_PUBLIC_CHAIN_NAME || "polygon",

  wcProjectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID,

  contracts: {
    spvToken: process.env.NEXT_PUBLIC_SPV_TOKEN,
    curve: process.env.NEXT_PUBLIC_CURVE_ADDRESS,
    router: process.env.NEXT_PUBLIC_ROUTER_ADDRESS,
  },

  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001",
};