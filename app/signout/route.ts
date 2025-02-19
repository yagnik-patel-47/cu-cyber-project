import {
	getCurrentSession,
	invalidateSession,
	deleteSessionTokenCookie,
} from "@/lib/session";
import { redirect } from "next/navigation";

export async function GET() {
	const { session } = await getCurrentSession();
	if (!session) {
		return;
	}

	await invalidateSession(session.id);
	await deleteSessionTokenCookie();

	return new Response(null, {
		status: 302,
		headers: {
			Location: "/",
		},
	});
}
