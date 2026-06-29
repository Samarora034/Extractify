import json
import os
import time

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from schemas import SCHEMAS

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


class ExtractRequest(BaseModel):
    text: str
    schema_name: str | None = None
    custom_schema: dict | None = None


@app.post("/extract")
async def extract(req: ExtractRequest):
    if not GROQ_API_KEY:
        raise HTTPException(500, "GROQ_API_KEY not configured")

    schema = req.custom_schema or SCHEMAS.get(req.schema_name)
    if not schema:
        raise HTTPException(400, "Provide a valid schema_name or custom_schema")

    schema_str = json.dumps(schema, indent=2)
    start = time.time()

    async with httpx.AsyncClient(timeout=120) as client:
        resp = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={"Authorization": f"Bearer {GROQ_API_KEY}"},
            json={
                "model": GROQ_MODEL,
                "messages": [
                    {"role": "system", "content": f"Extract structured data from the text. Return ONLY valid JSON matching this schema:\n{schema_str}"},
                    {"role": "user", "content": req.text},
                ],
                "response_format": {"type": "json_object"},
                "max_tokens": 2048,
                "temperature": 0,
            },
        )

    if resp.status_code != 200:
        raise HTTPException(502, f"Groq API error: {resp.text}")

    data = resp.json()
    latency_ms = (time.time() - start) * 1000
    result = json.loads(data["choices"][0]["message"]["content"])
    tokens_used = data.get("usage", {}).get("total_tokens", 0)

    return {"result": result, "tokens_used": tokens_used, "latency_ms": round(latency_ms, 1)}


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/schemas")
async def list_schemas():
    return {name: list(s["properties"].keys()) for name, s in SCHEMAS.items()}
