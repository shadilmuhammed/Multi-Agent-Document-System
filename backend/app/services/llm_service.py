import ollama


def ask_llm(question, context):
    prompt = f"""
You are an AI assistant that answers questions ONLY using the provided document.

Rules:
- Answer ONLY from the context below.
- Do NOT use your own knowledge.
- Do NOT guess or infer information.
- If the answer is not explicitly present in the context, reply exactly:
"I couldn't find that information in the uploaded document."

Context:
{context}

Question:
{question}

Answer:
"""

    response = ollama.chat(
        model="llama3.2",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response["message"]["content"]