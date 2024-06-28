import io
import base64
import requests
import os
from datetime import datetime, timedelta
from matplotlib import pyplot as plt
from PIL import Image
from dotenv import load_dotenv

def load_environment():
    env = os.getenv('APP_ENV', 'development')
    dotenv_path = f'.env.{env}' if env else '.env.development'
    load_dotenv(dotenv_path)

def default_start_date():
    return (datetime.now() - timedelta(days=1 * 365)).date()

def default_end_date():
    return datetime.now().date()

def thirty_five_years_ago():
    return (datetime.now() - timedelta(days=35*365)).date()

def scale_down_image(image, max_size=(512, 512)):
    image.thumbnail(max_size, Image.LANCZOS)
    return image

def create_chart(data, title, ylabel):
    fig, ax = plt.subplots(figsize=(10, 6))

    y_offset = 0.85
    y_spacing = 0.05

    for key, value in data.items():
        years = value['years']
        amounts = value['amounts']
        labels = value['labels']
        color = value['color']

        ax.plot(years, amounts, label=key, marker='o', color=color)

        for i, txt in enumerate(labels):
            x_position = 0.55 if 'stimulus' in key.lower() else 0.05
            ax.annotate(
                txt, xy=(x_position, y_offset - i * y_spacing), xycoords='axes fraction',
                textcoords='offset points', xytext=(5, 0), ha='left',
                color=color, fontsize=10, fontweight='bold',
                arrowprops=dict(arrowstyle="->", connectionstyle="arc3", color=color, lw=1.5)
            )

    ax.set_ylabel(ylabel, fontsize=14, fontweight='bold')
    ax.set_title(title, fontsize=16, fontweight='bold')
    ax.grid(True, linestyle='--', alpha=1)
    ax.set_facecolor('#f0f0f0')
    ax.legend(fontsize=14)

    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    return buf

def get_feedback(file_path, prompt=None):
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key:
        raise ValueError("API key not found in environment variables")

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    with open(file_path, "rb") as image_file:
        base64_image = base64.b64encode(image_file.read()).decode('utf-8')

    if prompt is None:
        prompt = "What's in this image?"

    payload = {
        "model": "gpt-4o",
        "messages": [
            {
                "role": "system",
                "content": "You are an Economist specializing in analyzing statistical reports to determine the economic outlook. Your analysis is objective, forthright, and based on data-driven insights. When presenting your findings, use a first-person perspective. Structure your sentences with explicit line breaks to ensure clarity and avoid run-ons. Focus on identifying key trends, correlations, and their implications for the economy. Your conclusions should be clear, concise, and directly related to the data presented."
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": f"{prompt}"
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/png;base64,{base64_image}"
                        }
                    }
                ]
            }
        ],
        "max_tokens": 1000,
        "temperature": 0.2
    }

    response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
    if response.status_code == 200:
        output = response.json()['choices'][0]['message']['content']
        return output
    else:
        return {"error": "Failed to get response from OpenAI API", "status_code": response.status_code}
