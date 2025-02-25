import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

interface NewsCardProps {
	news: any;
}

export const NewsCard = ({ news }: NewsCardProps) => {
	const timeAgo = formatDistanceToNow(new Date(news.publishedAt), {
		addSuffix: true,
	});

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
			<img
				src={news.urlToImage}
				alt={news.title}
				className="object-cover h-48 w-full"
			/>

			<div className="p-4 flex flex-col grow">
				<div className="flex items-center justify-between mb-2">
					<span className="text-sm text-blue-600 dark:text-blue-400">
						{news.source.name}
					</span>
					<span className="text-sm text-gray-500">{timeAgo}</span>
				</div>

				<h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
					{news.title}
				</h2>

				<p className="text-gray-600 dark:text-gray-300 text-sm mb-4 grow">
					{news.description}
				</p>

				<div className="flex items-center justify-between justify-self-end">
					<span className="text-sm text-gray-500">
						By {news.author || "Unknown"}
					</span>
					<a
						href={news.url}
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-600 dark:text-blue-400 hover:underline text-sm whitespace-nowrap"
					>
						Read more →
					</a>
				</div>
			</div>
		</div>
	);
};
