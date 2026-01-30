import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, sessionId } = body;

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if URL is cached
    const { data: cachedData } = await supabase
      .from("job_cache")
      .select()
      .eq("url", url)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (cachedData) {
      // Update session with cached data
      if (sessionId) {
        await supabase
          .from("sessions")
          .update({ job_description: cachedData.parsed_content })
          .eq("id", sessionId);
      }

      return NextResponse.json({
        success: true,
        data: cachedData.parsed_content,
        cached: true,
      });
    }

    // If not cached, trigger n8n workflow
    const n8nWebhookUrl = process.env.N8N_SCRAPE_WEBHOOK_URL;

    if (!n8nWebhookUrl) {
      // For now, return a mock response if n8n is not configured
      const mockData = {
        title: "Software Engineer",
        company: "Tech Company",
        location: "Remote",
        description: "We are looking for a talented software engineer...",
        requirements: [
          "3+ years of experience",
          "React/Next.js expertise",
          "Strong problem-solving skills",
        ],
        raw_text: "Full job description text here...",
      };

      if (sessionId) {
        await supabase
          .from("sessions")
          .update({ job_description: mockData })
          .eq("id", sessionId);
      }

      return NextResponse.json({
        success: true,
        data: mockData,
        mock: true,
      });
    }

    // Trigger n8n workflow
    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url, sessionId }),
    });

    if (!n8nResponse.ok) {
      return NextResponse.json(
        { error: "Failed to scrape job description" },
        { status: 500 }
      );
    }

    const scrapedData = await n8nResponse.json();

    // Cache the result
    await supabase.from("job_cache").upsert({
      url,
      parsed_content: scrapedData,
    });

    // Update session
    if (sessionId) {
      await supabase
        .from("sessions")
        .update({ job_description: scrapedData })
        .eq("id", sessionId);
    }

    return NextResponse.json({
      success: true,
      data: scrapedData,
    });
  } catch (error) {
    console.error("Scrape error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
