import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dialect: "postgresql",
	schema: "./lib/db/schema.ts",
	out: "./drizzle",
	dbCredentials: {
		url: "postgresql://neondb_owner:npg_ENJ4mAU8ebnT@ep-damp-sun-a1g1xtlb-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
	},
	strict: true,
	verbose: true,
});
