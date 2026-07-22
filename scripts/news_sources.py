from dataclasses import dataclass


@dataclass(frozen=True)
class Source:
    key: str
    name: str
    url: str
    region: str
    group: str
    priority: int
    ai_specific: bool = True


SOURCES = (
    Source("openai", "OpenAI", "https://openai.com/news/rss.xml", "海外", "官方", 100),
    Source(
        "google-ai",
        "Google AI",
        "https://blog.google/technology/ai/rss/",
        "海外",
        "官方",
        98,
    ),
    Source(
        "deepmind",
        "Google DeepMind",
        "https://deepmind.google/blog/rss.xml",
        "海外",
        "官方",
        98,
    ),
    Source(
        "nvidia-ai",
        "NVIDIA AI Blog",
        "https://blogs.nvidia.com/blog/category/generative-ai/feed/",
        "海外",
        "官方",
        94,
    ),
    Source(
        "ithome",
        "IT之家",
        "https://www.ithome.com/rss/",
        "国内",
        "国内媒体",
        84,
        False,
    ),
    Source(
        "leiphone",
        "雷锋网",
        "https://www.leiphone.com/feed",
        "国内",
        "国内媒体",
        85,
        False,
    ),
    Source(
        "cnbeta",
        "cnBeta",
        "https://www.cnbeta.com.tw/backend.php",
        "国内",
        "国内媒体",
        78,
        False,
    ),
    Source(
        "sspai",
        "少数派",
        "https://sspai.com/feed",
        "国内",
        "国内媒体",
        79,
        False,
    ),
    Source(
        "techcrunch-ai",
        "TechCrunch AI",
        "https://techcrunch.com/category/artificial-intelligence/feed/",
        "海外",
        "国际媒体",
        89,
    ),
    Source(
        "the-verge-ai",
        "The Verge AI",
        "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
        "海外",
        "国际媒体",
        88,
    ),
    Source(
        "venturebeat-ai",
        "VentureBeat AI",
        "https://venturebeat.com/category/ai/feed/",
        "海外",
        "国际媒体",
        82,
    ),
    Source(
        "mit-tech-review-ai",
        "MIT Technology Review",
        "https://www.technologyreview.com/topic/artificial-intelligence/feed/",
        "海外",
        "国际媒体",
        90,
    ),
    Source(
        "wired-ai",
        "WIRED AI",
        "https://www.wired.com/feed/tag/ai/latest/rss",
        "海外",
        "国际媒体",
        87,
    ),
    Source(
        "hugging-face",
        "Hugging Face",
        "https://huggingface.co/blog/feed.xml",
        "海外",
        "开源社区",
        91,
    ),
    Source(
        "openai-python-releases",
        "OpenAI GitHub Releases",
        "https://github.com/openai/openai-python/releases.atom",
        "海外",
        "开源社区",
        86,
    ),
    Source(
        "anthropic-releases",
        "Anthropic GitHub Releases",
        "https://github.com/anthropics/anthropic-sdk-python/releases.atom",
        "海外",
        "开源社区",
        86,
    ),
    Source(
        "transformers-releases",
        "Transformers Releases",
        "https://github.com/huggingface/transformers/releases.atom",
        "海外",
        "开源社区",
        84,
    ),
    Source(
        "mcp-releases",
        "MCP Releases",
        "https://github.com/modelcontextprotocol/specification/releases.atom",
        "海外",
        "开源社区",
        86,
    ),
    Source(
        "arxiv-ai",
        "arXiv AI",
        "https://export.arxiv.org/api/query?search_query=cat%3Acs.AI%20OR%20cat%3Acs.CL%20OR%20cat%3Acs.LG&start=0&max_results=40&sortBy=submittedDate&sortOrder=descending",
        "海外",
        "研究论文",
        80,
    ),
)
