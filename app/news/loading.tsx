import Nav from "@/components/site-nav";

export default function Loading() {
	return (
		<>
			<Nav />
			<div className="container h-[calc(100svh-80px)] mx-auto py-16 px-4 grid place-content-center">
				<img className="size-10" src="/loader.svg" alt="loading icon" />
			</div>
		</>
	);
}
