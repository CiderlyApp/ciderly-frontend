// FILE: src/app/blog/page.tsx
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Mock data for blog posts
const mockPosts = [
  {
    slug: "what-is-perry",
    title: "Что такое перри и чем он отличается от сидра?",
    excerpt: "Погружаемся в мир грушевых напитков. Узнайте историю, технологию производства и ключевые отличия перри от яблочного сидра.",
    imageUrl: "/blog/perry.jpg",
    author: "Анна Сидорова",
    date: "2024-07-15",
  },
  {
    slug: "top-5-dry-ciders",
    title: "Топ-5 сухих сидров этого лета",
    excerpt: "Мы отобрали для вас лучшие сухие сидры, которые идеально подойдут для жаркой погоды. От классики до неожиданных находок.",
    imageUrl: "/blog/dry-ciders.jpg",
    author: "Иван Яблоков",
    date: "2024-07-10",
  },
   {
    slug: "reading-labels",
    title: "Как читать этикетку сидра: полное руководство",
    excerpt: "Брют, экстра-брют, doux... Что все это значит? Разбираемся в терминах и учимся выбирать сидр в магазине как профессионал.",
    imageUrl: "/blog/labels.jpg",
    author: "Команда Ciderly",
    date: "2024-07-05",
  },
];

const BlogPostCard = ({ post }: { post: typeof mockPosts[0] }) => (
  <Card className="flex flex-col">
    <div className="aspect-video w-full bg-muted rounded-t-lg overflow-hidden">
      {/* Placeholder image */}
    </div>
    <CardHeader>
      <CardTitle className="text-lg">{post.title}</CardTitle>
      <CardDescription className="text-xs text-muted-foreground">{post.author} • {post.date}</CardDescription>
    </CardHeader>
    <CardContent className="flex-grow">
      <p className="text-sm text-muted-foreground">{post.excerpt}</p>
    </CardContent>
    <CardFooter>
      <Button asChild variant="secondary" size="sm">
        <Link href={`/blog/${post.slug}`}>Читать далее</Link>
      </Button>
    </CardFooter>
  </Card>
);

export default function BlogPage() {
  return (
    <div className="container py-12 md:py-20">
      <PageHeader
        title="Блог Ciderly"
        description="Статьи, обзоры и новости из мира сидра. Погрузитесь в культуру вместе с нами."
      />
      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {mockPosts.map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}