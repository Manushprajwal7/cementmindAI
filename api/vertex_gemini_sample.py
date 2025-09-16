"""
Vertex AI Gemini sample: run locally or in Cloud Run/Vertex AI Workbench.

Prereqs:
- pip install google-cloud-aiplatform vertexai google-auth
- ADC set up: gcloud auth application-default login

Env:
- GOOGLE_CLOUD_PROJECT, GOOGLE_CLOUD_REGION (e.g., us-central1)
"""

import os
from typing import Optional

import vertexai
from vertexai.generative_models import GenerativeModel


def generate_text(prompt: str, system: Optional[str] = None, model_name: str = "gemini-1.5-flash-002") -> str:
    project = os.environ.get("GOOGLE_CLOUD_PROJECT") or os.environ.get("GCP_PROJECT_ID")
    location = os.environ.get("GOOGLE_CLOUD_REGION", "us-central1")
    if not project:
        raise RuntimeError("Missing GOOGLE_CLOUD_PROJECT")

    vertexai.init(project=project, location=location)
    model = GenerativeModel(model_name)

    contents = []
    if system:
        contents.append({"role": "system", "parts": [{"text": system}]})
    contents.append({"role": "user", "parts": [{"text": prompt}]})

    resp = model.generate_content({"contents": contents})
    return resp.candidates[0].content.parts[0].text if resp.candidates else ""


if __name__ == "__main__":
    text = generate_text("Give me three bullet points on cement sustainability.")
    print(text)


