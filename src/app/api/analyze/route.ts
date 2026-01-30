import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get session data
    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .select()
      .eq("id", sessionId)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    if (!session.job_description || !session.resume_data) {
      return NextResponse.json(
        { error: "Missing job description or resume data" },
        { status: 400 }
      );
    }

    // Check if n8n webhook is configured
    const n8nWebhookUrl = process.env.N8N_ANALYZE_WEBHOOK_URL;

    if (!n8nWebhookUrl) {
      // Return mock analysis if n8n is not configured
      const mockAnalysis = {
        skill_matches: [
          {
            skill: "React",
            strength: "strong",
            evidence: "5 years of experience building React applications",
          },
          {
            skill: "TypeScript",
            strength: "strong",
            evidence: "Used TypeScript in multiple production projects",
          },
          {
            skill: "Node.js",
            strength: "moderate",
            evidence: "Built REST APIs with Express",
          },
        ],
        skill_gaps: [
          {
            skill: "AWS",
            importance: "required",
            suggestion: "Highlight any cloud experience you have",
          },
          {
            skill: "Team Leadership",
            importance: "preferred",
            suggestion: "Mention any mentoring or leadership experience",
          },
        ],
        questions: [
          {
            id: "q1",
            question:
              "The job requires 3+ years of React experience. Can you specify how many years you've been working with React?",
            type: "clarification",
          },
          {
            id: "q2",
            question:
              "Do you have any experience with AWS or other cloud platforms that we should highlight?",
            type: "missing_skill",
          },
          {
            id: "q3",
            question:
              "Can you describe a project where you led a team or mentored other developers?",
            type: "experience",
          },
        ],
        ats_score: 72,
        summary:
          "Your resume shows strong technical skills that match the core requirements. Consider adding more details about cloud experience and leadership.",
      };

      // Save analysis to session
      await supabase
        .from("sessions")
        .update({
          analysis_data: mockAnalysis,
          current_step: 3,
        })
        .eq("id", sessionId);

      return NextResponse.json({
        success: true,
        analysis: mockAnalysis,
        mock: true,
      });
    }

    // Trigger n8n workflow for AI analysis
    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId,
        jobDescription: session.job_description,
        resumeData: session.resume_data,
      }),
    });

    if (!n8nResponse.ok) {
      return NextResponse.json(
        { error: "Failed to analyze resume" },
        { status: 500 }
      );
    }

    const analysisData = await n8nResponse.json();

    // Save analysis to session
    await supabase
      .from("sessions")
      .update({
        analysis_data: analysisData,
        current_step: 3,
      })
      .eq("id", sessionId);

    return NextResponse.json({
      success: true,
      analysis: analysisData,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
