SCHEMAS = {
    "invoice": {
        "type": "object",
        "properties": {
            "invoice_number": {"type": "string"},
            "date": {"type": "string"},
            "vendor": {"type": "string"},
            "total_amount": {"type": "number"},
            "currency": {"type": "string"},
            "line_items": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "description": {"type": "string"},
                        "quantity": {"type": "number"},
                        "unit_price": {"type": "number"},
                    },
                    "required": ["description", "quantity", "unit_price"],
                },
            },
        },
        "required": ["invoice_number", "date", "vendor", "total_amount", "currency", "line_items"],
    },
    "resume": {
        "type": "object",
        "properties": {
            "name": {"type": "string"},
            "email": {"type": "string"},
            "phone": {"type": "string"},
            "skills": {"type": "array", "items": {"type": "string"}},
            "experience": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "company": {"type": "string"},
                        "role": {"type": "string"},
                        "duration": {"type": "string"},
                    },
                    "required": ["company", "role", "duration"],
                },
            },
            "education": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "institution": {"type": "string"},
                        "degree": {"type": "string"},
                        "year": {"type": "string"},
                    },
                    "required": ["institution", "degree", "year"],
                },
            },
        },
        "required": ["name", "email", "phone", "skills", "experience", "education"],
    },
    "email": {
        "type": "object",
        "properties": {
            "sender": {"type": "string"},
            "recipient": {"type": "string"},
            "subject": {"type": "string"},
            "date": {"type": "string"},
            "action_items": {"type": "array", "items": {"type": "string"}},
            "sentiment": {"type": "string", "enum": ["positive", "negative", "neutral"]},
        },
        "required": ["sender", "recipient", "subject", "date", "action_items", "sentiment"],
    },
    "article": {
        "type": "object",
        "properties": {
            "title": {"type": "string"},
            "author": {"type": "string"},
            "summary": {"type": "string"},
            "key_points": {"type": "array", "items": {"type": "string"}},
            "topics": {"type": "array", "items": {"type": "string"}},
            "publication_date": {"type": "string"},
        },
        "required": ["title", "author", "summary", "key_points", "topics", "publication_date"],
    },
}
