/**
 * Serviço para integração com NewsAPI
 * Busca notícias sobre Corinthians e futebol
 */

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  url: string;
  source: string;
  publishedAt: Date;
  category: "gol" | "lesão" | "mercado" | "técnico" | "geral";
}

/**
 * Busca notícias sobre Corinthians
 */
export async function searchCorinthiansNews(limit: number = 10): Promise<NewsArticle[]> {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
      console.warn("NewsAPI Key não configurada");
      return [];
    }

    const url = new URL("https://newsapi.org/v2/everything");
    url.searchParams.append("q", "Corinthians");
    url.searchParams.append("sortBy", "publishedAt");
    url.searchParams.append("pageSize", limit.toString());
    url.searchParams.append("apiKey", apiKey);

    const response = await fetch(url.toString());
    const data = (await response.json()) as {
      articles?: Array<{
        title: string;
        description: string;
        content: string;
        urlToImage: string;
        url: string;
        source: { name: string };
        publishedAt: string;
      }>;
    };

    if (!data.articles) return [];

    return data.articles.map((article, index) => ({
      id: `news_${index}`,
      title: article.title,
      description: article.description || "",
      content: article.content || "",
      image: article.urlToImage || "",
      url: article.url,
      source: article.source.name,
      publishedAt: new Date(article.publishedAt),
      category: categorizeNews(article.title),
    }));
  } catch (error) {
    console.error("Erro ao buscar notícias:", error);
    return [];
  }
}

/**
 * Busca notícias sobre lesões de jogadores
 */
export async function searchInjuryNews(limit: number = 5): Promise<NewsArticle[]> {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
      console.warn("NewsAPI Key não configurada");
      return [];
    }

    const url = new URL("https://newsapi.org/v2/everything");
    url.searchParams.append("q", "Corinthians lesão");
    url.searchParams.append("sortBy", "publishedAt");
    url.searchParams.append("pageSize", limit.toString());
    url.searchParams.append("apiKey", apiKey);

    const response = await fetch(url.toString());
    const data = (await response.json()) as {
      articles?: Array<{
        title: string;
        description: string;
        content: string;
        urlToImage: string;
        url: string;
        source: { name: string };
        publishedAt: string;
      }>;
    };

    if (!data.articles) return [];

    return data.articles.map((article, index) => ({
      id: `injury_${index}`,
      title: article.title,
      description: article.description || "",
      content: article.content || "",
      image: article.urlToImage || "",
      url: article.url,
      source: article.source.name,
      publishedAt: new Date(article.publishedAt),
      category: "lesão" as const,
    }));
  } catch (error) {
    console.error("Erro ao buscar notícias de lesões:", error);
    return [];
  }
}

/**
 * Busca notícias sobre mercado de transferências
 */
export async function searchTransferNews(limit: number = 5): Promise<NewsArticle[]> {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
      console.warn("NewsAPI Key não configurada");
      return [];
    }

    const url = new URL("https://newsapi.org/v2/everything");
    url.searchParams.append("q", "Corinthians transferência");
    url.searchParams.append("sortBy", "publishedAt");
    url.searchParams.append("pageSize", limit.toString());
    url.searchParams.append("apiKey", apiKey);

    const response = await fetch(url.toString());
    const data = (await response.json()) as {
      articles?: Array<{
        title: string;
        description: string;
        content: string;
        urlToImage: string;
        url: string;
        source: { name: string };
        publishedAt: string;
      }>;
    };

    if (!data.articles) return [];

    return data.articles.map((article, index) => ({
      id: `transfer_${index}`,
      title: article.title,
      description: article.description || "",
      content: article.content || "",
      image: article.urlToImage || "",
      url: article.url,
      source: article.source.name,
      publishedAt: new Date(article.publishedAt),
      category: "mercado" as const,
    }));
  } catch (error) {
    console.error("Erro ao buscar notícias de transferências:", error);
    return [];
  }
}

/**
 * Categoriza notícia baseado no título
 */
function categorizeNews(title: string): NewsArticle["category"] {
  const lower = title.toLowerCase();

  if (lower.includes("gol") || lower.includes("marcou")) return "gol";
  if (lower.includes("lesão") || lower.includes("machucado")) return "lesão";
  if (lower.includes("transferência") || lower.includes("acerto")) return "mercado";
  if (lower.includes("técnico") || lower.includes("treinador")) return "técnico";

  return "geral";
}

/**
 * Filtra notícias por categoria
 */
export function filterNewsByCategory(
  articles: NewsArticle[],
  category: NewsArticle["category"]
): NewsArticle[] {
  return articles.filter((article) => article.category === category);
}

/**
 * Ordena notícias por data
 */
export function sortNewsByDate(articles: NewsArticle[], order: "asc" | "desc" = "desc"): NewsArticle[] {
  return [...articles].sort((a, b) => {
    const diff = b.publishedAt.getTime() - a.publishedAt.getTime();
    return order === "asc" ? -diff : diff;
  });
}
