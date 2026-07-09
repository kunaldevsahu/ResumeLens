import "../config/env";

// Bypassing any environment-configured proxies that might intercept fetch calls in local environments
delete process.env.HTTPS_PROXY;
delete process.env.HTTP_PROXY;
delete process.env.https_proxy;
delete process.env.http_proxy;

export interface AiResumeReview {
  overallAssessment: string;
  strengths: string[];
  areasForImprovement: string[];
  recruiterPerspective: string;
  interviewReadiness: {
    score: number;
    explanation: string;
  };
}

export class AiService {
  async generateResumeReview(
    resumePayload: any,
    jobDescription: string,
    atsMetrics: {
      overallScore: number;
      keywordScore: number;
      formattingScore: number;
      skillsScore: number;
      experienceScore: number;
      educationScore: number;
      missingKeywords: string[];
      strengths: string[];
    }
  ): Promise<AiResumeReview> {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("Groq API key is not configured in environment");
    }

    const isGeneralScan = !jobDescription || jobDescription.trim().length < 20;

    const prompt = `You are an expert recruiter and career coach. Review this candidate's resume based on the following details.
${isGeneralScan 
  ? "This is a GENERAL resume review. Provide career coaching advice against general industry standards." 
  : `Compare the resume against this job description and evaluate how well the candidate matches the requirements:\n---JOB DESCRIPTION---\n${jobDescription}\n---------------------`}

---ATS SCORES AND METRICS---
- Overall Score: ${atsMetrics.overallScore}/100
- Keyword Match Score: ${atsMetrics.keywordScore}/100
- Formatting Score: ${atsMetrics.formattingScore}/100
- Skills Score: ${atsMetrics.skillsScore}/100
- Experience Score: ${atsMetrics.experienceScore}/100
- Education Score: ${atsMetrics.educationScore}/100
- Missing Keywords identified: ${JSON.stringify(atsMetrics.missingKeywords)}
- Initial Strengths scanned: ${JSON.stringify(atsMetrics.strengths)}
----------------------------

---RESUME JSON DETAILS---
${JSON.stringify(resumePayload, null, 2)}
-------------------------

Produce a detailed structured review by generating a JSON object conforming EXACTLY to the following schema:
{
  "overallAssessment": "A concise 2–4 sentence summary describing the overall quality of the resume and how well it aligns with the selected job description.",
  "strengths": [
    "A list of 5 to 8 bullet points highlighting key strengths (technical skills, resume structure, relevant experience, projects, ATS compatibility, organization, readability). Do not hallucinate items the candidate does not have."
  ],
  "areasForImprovement": [
    "A list of 5 to 8 specific and actionable recommendations for improvement based ONLY on the resume content and job description. Do not give generic advice or recommend adding experience the candidate does not possess."
  ],
  "recruiterPerspective": "A short paragraph (2-3 sentences) from the perspective of a recruiter scanning this resume for 20-30 seconds. Discuss what immediately stands out, what increases confidence, and what might hold them back.",
  "interviewReadiness": {
    "score": number (0-100 percentage representing interview call likelihood),
    "explanation": "A short explanation of the score and concrete steps to increase interview chances."
  }
}

CRITICAL RULES:
1. Do NOT hallucinate experience. Do NOT invent projects, technologies, or degrees the candidate does not have.
2. Return ONLY the valid raw JSON object, without markdown blocks, fences, or other text.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are a specialized AI career advisor and resume auditor returning only structured JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Groq API review generation error:", errText);
      throw new Error(`Failed to query AI Resume Analyst: ${response.statusText}`);
    }

    const resJson = await response.json();
    let rawContent = resJson.choices[0].message.content.trim();

    if (rawContent.startsWith("```")) {
      rawContent = rawContent.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    }

    const parsed = JSON.parse(rawContent);
    
    // Extract and map with camelCase + snake_case fallbacks
    const review: AiResumeReview = {
      overallAssessment: parsed.overallAssessment ?? parsed.overall_assessment ?? "",
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      areasForImprovement: Array.isArray(parsed.areasForImprovement ?? parsed.areas_for_improvement) ? (parsed.areasForImprovement ?? parsed.areas_for_improvement) : [],
      recruiterPerspective: parsed.recruiterPerspective ?? parsed.recruiter_perspective ?? "",
      interviewReadiness: {
        score: Number(parsed.interviewReadiness?.score ?? parsed.interview_readiness?.score) || 70,
        explanation: parsed.interviewReadiness?.explanation ?? parsed.interview_readiness?.explanation ?? ""
      }
    };

    return review;
  }
}
