import EmailForm from "./_components/EmailForm";
import Nav from "@/components/site-nav";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function DataBreach({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
	const email = (await searchParams).email;

	if (!email)
		return (
			<>
				<Nav />
				<div className="container mx-auto py-16 px-4">
					<h1 className="text-3xl font-bold mb-4">Data Breach Checker</h1>
					<EmailForm />
				</div>
			</>
		);

	const response = await fetch(
		`https://api.xposedornot.com/v1/breach-analytics?email=${email}`,
	);
	const data = await response.json();
	const breached = data.BreachesSummary.site !== "";
	const breaches = data.ExposedBreaches?.breaches_details;

	return (
		<>
			<Nav />
			<div className="container mx-auto py-16 px-4">
				<h1 className="text-3xl font-bold mb-4">Data Breach Checker</h1>
				<EmailForm />
				{!breached ? (
					<p className="text-zinc-700 text-xl mt-8">
						Your data was not found in any breaches.
					</p>
				) : (
					<p className="text-zinc-700 text-xl mt-8">
						Your data was found in following breaches...
					</p>
				)}
				<div className="grid lg:grid-cols-2 xl:grid-cols-3 mt-4 gap-4">
					{breaches?.map((bdata: any, index: number) => (
						<Card key={index} className="w-full">
							<CardHeader>
								<CardTitle className="flex gap-2 items-center">
									<Avatar>
										<AvatarImage className="object-contain" src={bdata.logo} />
										<AvatarFallback>{bdata.breach[0]}</AvatarFallback>
									</Avatar>
									<span className="block text-nowrap whitespace-nowrap">
										{bdata.breach}
									</span>
									{bdata.xposed_date && (
										<span className="block text-zinc-700 w-full text-end">
											{bdata.xposed_date}
										</span>
									)}
								</CardTitle>
								<CardDescription>{bdata.domain}</CardDescription>
							</CardHeader>
							<CardContent className="grid gap-4">
								<div>
									<p className="text-sm line-clamp-3">{bdata.details}</p>
									{bdata.references && (
										<a
											target="_blank"
											rel="noreferrer"
											href={bdata.references}
											className="text-sm text-blue-500"
										>
											read more
										</a>
									)}
								</div>
								{bdata.xposed_data && (
									<p className="text-sm">
										Exposed data: {bdata.xposed_data.split(";").join(", ")}
									</p>
								)}
							</CardContent>
							{/* <CardFooter>
								<Button className="w-full">
									<Check /> Mark all as read
								</Button>
							</CardFooter> */}
						</Card>
					))}
				</div>
			</div>
		</>
	);
}
