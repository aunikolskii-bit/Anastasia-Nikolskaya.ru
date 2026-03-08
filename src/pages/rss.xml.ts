import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog', ({ data }) => data.lang === 'ru'))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: 'Блог — Анастасия Никольская',
    description: 'Статьи о тренировках во время беременности и после родов в Самаре.',
    site: context.site!.toString(),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/ru/blog/${post.slug.replace('ru/', '')}/`,
    })),
  });
}
