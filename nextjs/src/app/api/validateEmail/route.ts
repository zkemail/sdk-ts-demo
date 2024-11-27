import { NextResponse } from 'next/server';
import { parseEmail } from '@zk-email/sdk';

export async function POST(request: Request) {
  try {
    // Extract form data from the request
    const formData = await request.formData();
    const file = formData.get('emlFile') as File;

    // Validate required fields are present
    if (!file) {
      return NextResponse.json(
        { error: 'Missing email file' },
        { status: 400 }
      );
    }

    const emailContent = await file.text();
    console.log("got emailContent in backend: ", !!emailContent);


    const parsedEmail = await parseEmail(emailContent);
    console.log('parsed: ', parsedEmail);


    // Return the validated data
    return NextResponse.json({});

  } catch (error) {
    console.error('Error in validateEmail route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
