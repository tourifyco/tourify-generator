import { NextResponse } from 'next/server';

export async function POST(req) {
  console.log('✅ Hit /api/generate-video');

  try {
    const formData = await req.formData();
    const image = formData.get('image');

    if (!image) {
      console.error('⚠️ No image provided.');
      return NextResponse.json({ message: 'No image provided.' }, { status: 400 });
    }

    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');
    const imageMimeType = image.type || 'image/jpeg';

    const RUNWAY_API_KEY = 'your-api-key-here'; // Replace this safely

    const bodyPayload = {
      promptImage: {
        uri: `data:${imageMimeType};base64,${base64Image}`,
        position: 0
      },
      promptText: "A Room. (Slow moving) Steady dolly shot moving towards the center of the room, slowly. Colors remain desaturated.",
      model: "gen4_turbo",
      duration: 5,
      ratio: "1280:720"
    };

    console.log('📦 Payload being sent to Runway:', JSON.stringify(bodyPayload).slice(0, 500));

    const runwayRes = await fetch('https://api.runwayml.com/v1/image_to_video', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RUNWAY_API_KEY}`,
        'Content-Type': 'application/json',
        'X-Runway-Version': '2024-11-06'
      },
      body: JSON.stringify(bodyPayload)
    });

    const data = await runwayRes.json();

    if (!runwayRes.ok) {
      console.error('❌ Runway API error:', data);
      return NextResponse.json({ message: 'Runway API error', error: data }, { status: 500 });
    }

    return NextResponse.json({ message: 'Video generation started', data });

  } catch (err) {
    console.error('🔥 Server Error in /api/generate-video:', err);
    return NextResponse.json({ message: 'Server error', error: err.message }, { status: 500 });
  }
}
