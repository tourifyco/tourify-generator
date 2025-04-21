import { NextResponse } from 'next/server';

export async function POST(req) {
  console.log('✅ Hit /api/generate-video');

  const formData = await req.formData();
  const image = formData.get('image');

  if (!image) {
    return NextResponse.json({ message: 'No image provided.' }, { status: 400 });
  }

  const arrayBuffer = await image.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64Image = buffer.toString('base64');

  const RUNWAY_API_KEY = 'key_b3aff2688d5f9e1e1fd6df5caf3fb80c111f9307efa776dc7bb4739f225426ba7e813cd73d480cbcd05896186325f2ec68cfae62e2a9c83e7f64dff4b2cb739d'; // Replace with your actual API key

  const runwayRes = await fetch('https://api.runwayml.com/v1/image_to_video', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RUNWAY_API_KEY}`,
      'Content-Type': 'application/json',
      'X-Runway-Version': '2024-11-06'
    },
    body: JSON.stringify({
        promptImage: {
          uri: `data:${image.type};base64,${base64Image}`,
          position: 0
        },
        promptText: "A Room. (Slow moving) Steady dolly shot moving towards the center of the room, slowly. Colors remain desaturated.",
        model: "gen4_turbo",
        duration: 5,
        ratio: "1280:720"
      })
      
  });

  const data = await runwayRes.json();

  if (!runwayRes.ok) {
    console.error('❌ Runway API error:', data);
    return NextResponse.json({ message: 'Runway API error', error: data }, { status: 500 });
  }

  return NextResponse.json({ message: 'Video generation started', data });
}
