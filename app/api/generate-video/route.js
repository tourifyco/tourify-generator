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

  const RUNWAY_API_KEY = 'key_b3aff2688d5f9e1e1fd6df5caf3fb80c111f9307efa776dc7bb4739f225426ba7e813cd73d480cbcd05896186325f2ec68cfae62e2a9c83e7f64dff4b2cb739d';
  const runwayRes = await fetch('https://api.runwayml.com/v1/inference/gen-3', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RUNWAY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: {
        image: `data:${image.type};base64,${buffer.toString('base64')}`,
        seed: 42,
        motion: "medium",
        guidance_scale: 7,
        duration: 4
      }
    }),
  });

  const data = await runwayRes.json();
  console.log('Runway API responded with:', data);

  if (runwayRes.ok && data.output) {
    return NextResponse.json({ video_url: data.output });
  } else {
    return NextResponse.json({ message: 'Runway API error', details: data }, { status: 500 });
  }
}
