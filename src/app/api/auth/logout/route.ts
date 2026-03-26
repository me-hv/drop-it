import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // Clear the cookies
  response.cookies.delete('mocked_handle');
  response.cookies.delete('drops_handle');
  
  return response;
}
