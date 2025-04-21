import { NextResponse } from 'next/server';

export async function POST() {
  console.log('✅ Hit /api/generate-video (hosted image test)');

  try {
    const RUNWAY_API_KEY = 'key_b3aff2688d5f9e1e1fd6df5caf3fb80c111f9307efa776dc7bb4739f225426ba7e813cd73d480cbcd05896186325f2ec68cfae62e2a9c83e7f64dff4b2cb739d'; // Replace with your real API key

    // Use a publicly accessible image URL here (host it on Imgur, Cloudinary, etc.)
    const hostedImageUrl = 'https://example.com/your-image.jpg'; // CHANGE THIS

    const bodyPayload = {
      promptImage: hostedImageUrl,
      promptText: "A Room. Slow camera dolly forward. Desaturated colors.",
      model: "gen4_turbo",
      duration: 5,
      ratio: "1280:720"
    };

    console.log('📦 Sending to Runway:', bodyPayload);

    const runwayRes = await fetch('https://api.dev.runwayml.com/v1/image_to_video', {
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
