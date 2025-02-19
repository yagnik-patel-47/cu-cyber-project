import { GitHub } from "arctic";

export const github = new GitHub(
	process.env.GITHUB_CLIENT_ID as string,
	process.env.GITHUB_CLIENT_SECRET as string,
	process.env.NODE_ENV === "production"
		? "https://cu-cyber-project.vercel.app/login/github/callback"
		: "http://localhost:3000/login/github/callback",
);
