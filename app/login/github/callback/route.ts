import {
	generateSessionToken,
	createSession,
	setSessionTokenCookie,
} from "@/lib/session";
import { github } from "@/lib/auth/oauth";
import { cookies } from "next/headers";

import type { OAuth2Tokens } from "arctic";
import { createUser, getUserFromGitHubEmail } from "@/lib/user";

export async function GET(request: Request): Promise<Response> {
	const url = new URL(request.url);
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");
	const cookieStore = await cookies();
	const storedState = cookieStore.get("github_oauth_state")?.value ?? null;
	if (code === null || state === null || storedState === null) {
		return new Response(null, {
			status: 400,
		});
	}
	if (state !== storedState) {
		return new Response(null, {
			status: 400,
		});
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await github.validateAuthorizationCode(code);
	} catch (_e) {
		// Invalid code or client credentials
		return new Response(null, {
			status: 400,
		});
	}
	const githubUserResponse = await fetch("https://api.github.com/user", {
		headers: {
			Authorization: `Bearer ${tokens.accessToken()}`,
		},
	});
	const githubEmailsResponse = await fetch(
		"https://api.github.com/user/emails",
		{
			headers: {
				Authorization: `Bearer ${tokens.accessToken()}`,
			},
		},
	);
	const githubUser = await githubUserResponse.json();
	const githubEmails = await githubEmailsResponse.json();
	const primaryEmail = githubEmails.find((email: any) => email.primary);

	if (!primaryEmail) {
		return new Response(null, {
			status: 400,
			statusText: "No primary email found",
		});
	}

	const githubUserEmail = primaryEmail.email;
	const githubUsername = githubUser.name;

	const existingUser = await getUserFromGitHubEmail(githubUserEmail);

	if (existingUser) {
		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, existingUser.id);
		await setSessionTokenCookie(sessionToken, session.expiresAt);
		return new Response(null, {
			status: 302,
			headers: {
				Location: "/",
			},
		});
	}

	const user = await createUser(githubUserEmail, githubUsername);

	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, user.id);
	await setSessionTokenCookie(sessionToken, session.expiresAt);
	return new Response(null, {
		status: 302,
		headers: {
			Location: "/",
		},
	});
}
