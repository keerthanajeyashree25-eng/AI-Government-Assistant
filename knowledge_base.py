"""
RAG knowledge base for government schemes.

Uses TF-IDF + cosine similarity for retrieval (no external embedding API
required to run). Swap `KnowledgeBase._vectorize` for a real embedding model
(e.g. a multilingual sentence-transformer) + a vector DB (pgvector / Qdrant /
FAISS) when you move past the prototype stage — the retrieval interface
(`search`) stays the same either way, so nothing else in the app needs to
change.
"""

import json
import os
from dataclasses import dataclass
from typing import List, Optional

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from config import DATA_DIR


@dataclass
class RetrievedScheme:
    scheme: dict
    score: float


class KnowledgeBase:
    def __init__(self, schemes_path: Optional[str] = None):
        path = schemes_path or os.path.join(DATA_DIR, "schemes.json")
        with open(path, "r", encoding="utf-8") as f:
            self.schemes: List[dict] = json.load(f)

        self._corpus = [self._doc_text(s) for s in self.schemes]
        self._vectorizer = TfidfVectorizer(stop_words="english")
        self._matrix = self._vectorizer.fit_transform(self._corpus)

    @staticmethod
    def _doc_text(scheme: dict) -> str:
        return " ".join([
            scheme.get("name", ""),
            scheme.get("category", ""),
            scheme.get("description", ""),
            scheme.get("benefits", ""),
            " ".join(scheme.get("documents_required", [])),
        ])

    def search(self, query: str, state: Optional[str] = None,
               top_k: int = 3) -> List[RetrievedScheme]:
        """Hybrid-ish search: TF-IDF semantic-ish similarity + state metadata filter."""
        query_vec = self._vectorizer.transform([query])
        sims = cosine_similarity(query_vec, self._matrix)[0]

        results = []
        for scheme, score in zip(self.schemes, sims):
            if state and scheme["state"] not in ("ALL", state):
                continue
            results.append(RetrievedScheme(scheme=scheme, score=float(score)))

        results.sort(key=lambda r: r.score, reverse=True)
        return results[:top_k]

    def get_by_id(self, scheme_id: str) -> Optional[dict]:
        for s in self.schemes:
            if s["id"] == scheme_id:
                return s
        return None
