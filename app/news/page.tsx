import { NewsCard } from "@/components/news-card";
import Nav from "@/components/site-nav";

export default async function NewsPage() {
	const res = await fetch(
		`https://newsapi.org/v2/everything?q=${encodeURIComponent('cybersecurity OR "cyber attack" OR hacking OR "data breach"')}&apiKey=${process.env.NEWS_API_KEY}&pageSize=10`,
	);

	if (!res.ok) return <p>Error</p>;

	const data = await res.json();

	if (data.status !== "ok") return <p>Error</p>;

	const filteredData = data.articles.filter((a: any) => a.urlToImage && a.url);

	return (
		<>
			<Nav />
			<div className="container mx-auto py-16 px-4">
				<h1 className="text-3xl font-bold mb-4">Cyber News</h1>
				<div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
					{filteredData.length > 0 ? (
						filteredData.map((news: any, index: number) => (
							<NewsCard news={news} key={index} />
						))
					) : (
						<p>No articles to show right now :(</p>
					)}
				</div>
			</div>
		</>
	);
}
