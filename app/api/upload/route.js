import { NextResponse } from 'next/server';

export async function POST(request) {
  const formData = await request.formData();
  const files = formData.getAll('images');

  if (!files || files.length === 0) {
    return NextResponse.json({ message: 'No images received.' }, { status: 400 });
  }

  // For now, just log how many files were received
  console.log(`Received ${files.length} image(s)`);

  // TODO: Save files and trigger video generation

  return NextResponse.json({ message: 'Images received successfully!' }, { status: 200 });
}
