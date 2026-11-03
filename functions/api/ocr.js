export async function onRequestPost({ request, env }) {
  try {
    if (!env.OPENAI_API_KEY) {
      return Response.json(
        { error: "Falta configurar OPENAI_API_KEY en Cloudflare." },
        { status: 500 }
      );
    }

    const form = await request.formData();
    const file = form.get("file");

    if (!file || typeof file.arrayBuffer !== "function") {
      return Response.json(
        { error: "No se recibió ninguna imagen." },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return Response.json(
        { error: "El archivo debe ser una imagen." },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return Response.json(
        { error: "La imagen no puede superar 10 MB." },
        { status: 400 }
      );
    }

    const bytes = new Uint8Array(await file.arrayBuffer());

    let binary = "";
    for (const byte of bytes) {
      binary += String.fromCharCode(byte);
    }

    const imageBase64 = btoa(binary);
    const imageUrl = data:${file.type};base64,${imageBase64};

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: Bearer ${env.OPENAI_API_KEY}
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content:
                "Extrae datos de facturas. No inventes valores. Si un dato no aparece, usa null. Devuelve únicamente JSON válido."
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Lee esta factura y devuelve exactamente este JSON:
{
  "supplier": string|null,
  "nit": string|null,
  "date": "YYYY-MM-DD"|null,
  "number": string|null,
  "subtotal": number|null,
  "tax": number|null,
  "total": number|null,
  "details": string|null,
  "confidence": number
}

La moneda normalmente es COP. Usa números sin símbolos ni separadores de miles.`
                },
                {
                  type: "image_url",
                  image_url: {
                    url: imageUrl,
                    detail: "high"
                  }
                }
              ]
            }
          ],
          temperature: 0
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        { error: data?.error?.message || "Error al consultar el OCR." },
        { status: response.status }
      );
    }

    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      return Response.json(
        { error: "La IA no devolvió datos." },
        { status: 502 }
      );
    }

    const result = JSON.parse(content);

    return Response.json({
      ok: true,
      data: result
    });
  } catch (error) {
    return Response.json(
      { error: error.message || "Error procesando la factura." },
      { status: 500 }
    );
  }
export async function onRequestPost({ request, env }) {
  try {
    if (!env.OPENAI_API_KEY) {
      return Response.json(
        { error: "Falta configurar OPENAI_API_KEY en Cloudflare." },
        { status: 500 }
      );
    }

    const form = await request.formData();
    const file = form.get("file");

    if (!file || typeof file.arrayBuffer !== "function") {
      return Response.json(
        { error: "No se recibió ninguna imagen." },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return Response.json(
        { error: "El archivo debe ser una imagen." },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return Response.json(
        { error: "La imagen no puede superar 10 MB." },
        { status: 400 }
      );
    }

    const bytes = new Uint8Array(await file.arrayBuffer());

    let binary = "";
    for (const byte of bytes) {
      binary += String.fromCharCode(byte);
    }

    const imageBase64 = btoa(binary);
    const imageUrl = data:${file.type};base64,${imageBase64};

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: Bearer ${env.OPENAI_API_KEY}
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content:
                "Extrae datos de facturas. No inventes valores. Si un dato no aparece, usa null. Devuelve únicamente JSON válido."
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Lee esta factura y devuelve exactamente este JSON:
{
  "supplier": string|null,
  "nit": string|null,
  "date": "YYYY-MM-DD"|null,
  "number": string|null,
  "subtotal": number|null,
  "tax": number|null,
  "total": number|null,
  "details": string|null,
  "confidence": number
}

La moneda normalmente es COP. Usa números sin símbolos ni separadores de miles.`
                },
                {
                  type: "image_url",
                  image_url: {
                    url: imageUrl,
                    detail: "high"
                  }
                }
              ]
            }
          ],
          temperature: 0
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        { error: data?.error?.message || "Error al consultar el OCR." },
        { status: response.status }
      );
    }

    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      return Response.json(
        { error: "La IA no devolvió datos." },
        { status: 502 }
      );
    }

    const result = JSON.parse(content);

    return Response.json({
      ok: true,
      data: result
    });
  } catch (error) {
    return Response.json(
      { error: error.message || "Error procesando la factura." },
      { status: 500 }
    );
  }
}
