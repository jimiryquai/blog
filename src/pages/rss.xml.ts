import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
const parser = new MarkdownIt();

export async function GET(context: APIContext) {
  const posts = await getCollection('posts');
  return rss({
    title: 'James Ryan',
    description: 'A comminuty of low code enthusiasts',
    site: context.site?.toString() ?? '',
    xmlns: {
      media: "http://search.yahoo.com/mrss/",
    },
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.date),
      description: post.data.description,
      // Compute RSS link from post `slug`
      // This example assumes all posts are rendered as `/blog/[slug]` routes
      link: `/blog/${post.slug}/`,
      content: parser.render(sanitizeHtml(post.body)),
      customData: `<media:content
      type="image/jpg"
      width="${1024}"
      height="${1024/2}"
      medium="image"
      url="${context.site + post.data.image.slice(1)}" />
  `,
    })),
  });
}