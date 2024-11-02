# routers/newsapi.py

import os
import json
import datetime
from fastapi import APIRouter, HTTPException
from newsapi import NewsApiClient
from langchain.embeddings import HuggingFaceEmbeddings
import chromadb

# Initialize API clients
newsapi = NewsApiClient(api_key=os.getenv("NEWSAPI_KEY"))
embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
chroma_client = chromadb.Client()
collection = chroma_client.get_or_create_collection("news_embeddings")

router = APIRouter()


@router.get("/fetch_articles")
async def fetch_articles(query: str, save_raw: bool = True):
    try:
        # Fetch articles
        articles = newsapi.get_everything(q=query, language="en", page_size=5)

        if not articles['articles']:
            raise HTTPException(status_code=404, detail="No articles found")

        processed_articles = []

        for article in articles['articles']:
            content = article['content'] or article['description'] or ""
            if not content:
                continue

            # Generate embeddings
            embedding = embedding_model.embed_text(content)

            # Save raw data to JSON file if required
            if save_raw:
                timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
                file_name = f"articles/{query}_{timestamp}.json"
                os.makedirs(os.path.dirname(file_name), exist_ok=True)
                with open(file_name, "w") as f:
                    json.dump(article, f)

            # Add to ChromaDB
            collection.add(
                documents=[content],
                metadatas=[{"source": article["source"]["name"], "title": article["title"], "url": article["url"]}],
                embeddings=[embedding]
            )

            processed_articles.append({
                "title": article["title"],
                "source": article["source"]["name"],
                "url": article["url"],
                "embedding": embedding
            })

        return {"status": "success", "processed_articles": processed_articles}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
