// FILE: src/app/blog/[slug]/page.tsx
// This is a placeholder for a dynamic blog post page

// In a real app, you would fetch post data based on the slug
export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  // Mock data for demonstration
  const post = {
    title: "Что такое перри и чем он отличается от сидра?",
    author: "Анна Сидорова",
    date: "15 июля 2024",
    content: `
      <p>Перри, или пуаре (poiré) по-французски, — это алкогольный напиток, который часто называют «грушевым сидром». Хотя технология производства схожа, есть ключевые отличия, которые делают перри уникальным.</p>
      <h3 class="font-bold mt-4 mb-2">Сырье</h3>
      <p>Главное отличие — сырье. Для сидра используют яблоки, а для перри — исключительно груши, причем специальных «перрийных» сортов. Эти груши, как правило, мелкие, твердые и очень танинные, их практически невозможно есть в свежем виде.</p>
      <h3 class="font-bold mt-4 mb-2">Вкус и аромат</h3>
      <p>Вкус перри часто более тонкий и деликатный, чем у сидра. В нем преобладают цветочные, цитрусовые и медовые ноты. Танины в перри мягче, что придает напитку более гладкую текстуру.</p>
      <p class="mt-4">Исследуйте мир перри в приложении Ciderly, находите новые вкусы и делитесь своими впечатлениями!</p>
    `
  };
  
  return (
    <div className="container py-12 md:py-20">
      <article className="mx-auto max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{post.title}</h1>
          <p className="mt-4 text-sm text-muted-foreground">{post.author} • {post.date}</p>
        </div>
        
        <div className="aspect-video w-full bg-muted rounded-lg mb-8">
          {/* Post image would go here */}
        </div>

        <div
          className="prose prose-stone dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
}