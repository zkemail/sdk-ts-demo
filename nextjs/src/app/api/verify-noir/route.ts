import zkeSdk from "@zk-email/sdk";
import { NextRequest, NextResponse } from 'next/server';
import { initNoirWasm } from '@/lib/noir-wasm-node';

const sdk = zkeSdk({ baseUrl: "https://staging-conductor.zk.email" });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const proof = await sdk.unPackProof(body.proof);
    
    // Initialize WASM modules
    // The ZK Email sdk cannot provide the initNoirWasm code for node initialization,
    // since noir doesn't provide their wasm packed for bundlers and it has
    // to be used directly from the repo
    console.log("Initializing WASM modules...");
    const noirWasm = await initNoirWasm();
    console.log("WASM initialization successful")
    
    const options = { noirWasm };
    
    // Verify the proof from the request body
    console.log("Verifying client proof...");
    const verified = await proof.verify(options);
    console.log("Client proof verification result:", verified);
    
    const response = {
      success: verified,
      message: 'Proof verification completed successfully'
    };
    
    return NextResponse.json(response, { status: 200 });
    
  } catch (error) {
    console.error('Error processing verification request:', error);
    
    // Provide more detailed error information
    const errorResponse = {
      success: false,
      error: 'Failed to verify proof',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
