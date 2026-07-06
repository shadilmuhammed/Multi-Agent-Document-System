import ollama


def ask_llm(question, context):
    prompt = f"""
You are a helpful AI assistant.

Your job is to answer questions ONLY using the provided document context.

Instructions:
- Use only the information from the context.
- If the answer exists, explain it naturally.
- If the answer does not exist in the context, reply:
  "I couldn't find that information in the uploaded document."

Document Context:
--------------------
{context}
--------------------

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