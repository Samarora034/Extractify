import json
import os
import time

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from schemas import SCHEMAS

SGLANG_URL = os.getenv("SGLANG_URL", "http://localhost:30000")

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000"], allow_methods=["*"], allow_headers=["*"])


class ExtractRequest(BaseModel):
    text: str
    schema_name: str | None = None
    custom_schema: dict | None = None


@app.post("/extract")
async def extract(req: ExtractRequest):
    schema = req.custom_schema or SCHEMAS.get(req.schema_name)
    if not schema:
        raise HTTPException(400, "Provide a valid schema_name or custom_schema")

    start = time.time()
    async with httpx.AsyncClient(timeout=120) as client:
        resp = await client.post(
            f"{SGLANG_URL}/v1/chat/completions",
            json={
                "model": "default",
                "messages": [
                    {"role": "system", "content": "Extract structured data from the text. Return only valid JSON."},
                    {"role": "user", "content": req.text},
                ],
                "response_format": {"type": "json_schema", "json_schema": {"name": "extraction", "schema": schema}},
                "max_tokens": 2048,
            },
        )
    if resp.status_code != 200:
        raise HTTPException(502, f"SGLang error: {resp.text}")

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
