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
    print(f"loading {dotenv_path}:{env}")
    print(os.environ)
    load_dotenv(dotenv_path,override=True)

    print(f"openai_api_key:{os.getenv('OPENAI_API_KEY')}")

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
    print(f"api_key:{api_key}")
    if not api_key:
        raise ValueError("API key not found in environment variables")

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    try:
        with open(file_path, "rb") as image_file:
            base64_image = base64.b64encode(image_file.read()).decode('utf-8')

        if prompt is None:
            prompt = "What's in this image?"

        system_prompt = "For the duration of this conversation, act as an Economics expert specializing in analyzing statistical reports to determine the economic impacts and probable outlook. Your analysis is objective, forthright, and based on data-driven insights. When presenting your findings, use a first-person perspective. Structure your sentences with explicit line breaks to ensure clarity and avoid run-ons. Focus on identifying key trends, correlations, and their implications for the economy. Be sure to provide clear and concise explanations for your analysis and support it with relevant data and evidence.   "
        # system_prompt = "For the duration of this conversation, act as an Economics expert specializing in .  Your first task is to review the provided image, and thoroughly research current economic theories and identify any gaps or limitations in their approach.  Then, using your expertise in both Micro and Macroeconomics, create a new theory that addresses these gaps and provides a more comprehensive review of this chart.  Be sure to provide clear and concise explanations for your analysis and support it with relevant data and evidence.  Finally, you must limit your response to under 1000 tokens as expressed by ChatGPT."
        payload = {
            "model": "gpt-4o",
            "messages": [
                {
                    "role": "system",
                    "content": system_prompt
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
            "max_tokens": 1250,
            "temperature": 0.1
        }
        print(f"payload:{payload}")

        response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
        if response.status_code == 200:
            output = response.json()['choices'][0]['message']['content']
            print(output)
            return output
        else:
            return {"error": "Failed to get response from OpenAI API", "status_code": response.status_code}
    finally:
        # Ensure the image file is removed after processing
        print(f"removing {file_path}")
        if os.path.exists(file_path):
            os.remove(file_path)

# Usage example:
# feedback = get_feedback('/path/to/image.png', 'Analyze this economic chart.')

