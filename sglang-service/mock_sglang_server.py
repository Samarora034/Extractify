"""
Mock SGLang server for testing/demo without a GPU.
Returns realistic structured extraction results.
Run: python3 mock_sglang_server.py
This simulates the SGLang server on port 30000.
"""
import json
from http.server import HTTPServer, BaseHTTPRequestHandler

MOCK_RESPONSES = {
    "invoice": {
        "invoice_number": "INV-2024-0042",
        "date": "2024-03-15",
        "vendor": "Acme Corp",
        "total_amount": 1250.00,
        "currency": "USD",
        "line_items": [
            {"description": "Web Development Services", "quantity": 10, "unit_price": 100.00},
            {"description": "Cloud Hosting (Monthly)", "quantity": 1, "unit_price": 250.00}
        ]
    },
    "resume": {
        "name": "Jane Smith",
        "email": "jane.smith@email.com",
        "phone": "+1-555-0123",
        "skills": ["Python", "Machine Learning", "FastAPI", "React", "PostgreSQL"],
        "experience": [
            {"company": "TechCorp", "role": "Senior ML Engineer", "duration": "2022-present"},
            {"company": "DataInc", "role": "Data Scientist", "duration": "2019-2022"}
        ],
        "education": [
            {"institution": "MIT", "degree": "M.S. Computer Science", "year": "2019"}
        ]
    },
    "email": {
        "sender": "john@company.com",
        "recipient": "team@company.com",
        "subject": "Q4 Planning Meeting",
        "date": "2024-03-10",
        "action_items": ["Review Q3 metrics by Friday", "Submit budget proposals", "Schedule 1-on-1s"],
        "sentiment": "positive"
    },
    "article": {
        "title": "The Rise of Structured Generation in LLM Systems",
        "author": "Dr. Sarah Chen",
        "summary": "Constrained decoding techniques are transforming how production LLM systems guarantee output validity, eliminating parsing failures in agentic workflows.",
        "key_points": ["JSON schema constraints eliminate malformed outputs", "RadixAttention enables KV cache reuse", "3x throughput improvement over standard guided decoding"],
        "topics": ["LLM", "structured generation", "constrained decoding", "production AI"],
        "publication_date": "2024-03-01"
    }
}


class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path == "/v1/chat/completions":
            length = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(length))

            # Detect schema from the request
            schema_name = "invoice"
            rf = body.get("response_format", {})
            if rf.get("type") == "json_schema":
                schema = rf.get("json_schema", {}).get("schema", {})
                props = list(schema.get("properties", {}).keys())
                if "name" in props and "skills" in props:
                    schema_name = "resume"
                elif "sender" in props and "sentiment" in props:
                    schema_name = "email"
                elif "key_points" in props and "topics" in props:
                    schema_name = "article"

            result = MOCK_RESPONSES[schema_name]
            response = {
                "choices": [{"message": {"content": json.dumps(result)}}],
                "usage": {"prompt_tokens": 150, "completion_tokens": 80, "total_tokens": 230}
            }
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(response).encode())
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        print(f"[MockSGLang] {args[0]}")


if __name__ == "__main__":
    server = HTTPServer(("0.0.0.0", 30000), Handler)
    print("🧪 Mock SGLang server running on http://localhost:30000")
    print("   This simulates constrained decoding responses for testing.")
    server.serve_forever()
