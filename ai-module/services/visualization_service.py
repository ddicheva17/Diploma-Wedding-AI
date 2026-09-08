from openai import OpenAI

from config import OPENAI_API_KEY, OPENAI_IMAGE_MODEL, OPENAI_TEXT_MODEL

client_openai = OpenAI(api_key=OPENAI_API_KEY)


def generate_wedding_image_prompt(description):
    prompt_request = f"""
    Създай кратък, ясен и професионален prompt на английски език
    за AI image generation на сватбена визуална концепция.

    Описание от клиента:
    {description}

    Prompt-ът трябва да описва:
    wedding style, color palette, flowers, lighting, venue,
    atmosphere, realistic luxury wedding photography style.

    Върни само prompt-а на английски език, без обяснения.
    """

    response = client_openai.chat.completions.create(
        model=OPENAI_TEXT_MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "You create professional image prompts for "
                    "luxury wedding concept visualization."
                )
            },
            {
                "role": "user",
                "content": prompt_request
            }
        ],
        temperature=0.7
    )

    return response.choices[0].message.content


def generate_wedding_visualization(description):
    image_prompt = generate_wedding_image_prompt(description)

    image_response = client_openai.images.generate(
        model=OPENAI_IMAGE_MODEL,
        prompt=image_prompt,
        size="1024x1024"
    )

    image_base64 = image_response.data[0].b64_json

    return {
        "prompt": image_prompt,
        "image": image_base64
    }