import { prisma } from "../config/prisma";
import { AiService } from "./ai.service";

// Bypassing any environment-configured proxies that might intercept fetch calls in local environments
delete process.env.HTTPS_PROXY;
delete process.env.HTTP_PROXY;
delete process.env.https_proxy;
delete process.env.http_proxy;

const aiService = new AiService();

// Comprehensive list of standard tech and domain keywords
const KEYWORD_BANK = [
  "React", "Node", "Docker", "Kubernetes", "AWS", "TypeScript", "Java", "Python", 
  "Go", "CI/CD", "SQL", "NoSQL", "Git", "Figma", "UI/UX", "JavaScript", "GraphQL", 
  "REST APIs", "Express", "PostgreSQL", "MongoDB", "Linux", "GCP", "Azure", "HTML", 
  "CSS", "Next.js", "Redux", "Tailwind", "Jest", "Microservices", "Jenkins", 
  "Terraform", "SaaS", "Agile", "Scrum", "Product Design", "Design Systems", 
  "Machine Learning", "AI", "Cloud Computing", "DevOps", "API", "Mobile Development",
  "iOS", "Android", "Flutter", "React Native", "System Design", "Analytics",
  "Product Management", "Data Structures", "Algorithms", "Testing"
];

export class AtsService {
  async analyzeResume(
    userId: string,
    payload: {
      resumeId?: string;
      resumeTitle?: string;
      resumeContent?: string;
      jobDescription?: string;
    }
  ) {
    const { resumeId, resumeTitle, resumeContent, jobDescription } = payload;

    // 1. Resolve Resume Title and Content
    let resolvedTitle = resumeTitle || "Uploaded Resume";
    let resumeText = "";

    if (resumeId) {
      const resume = await prisma.resume.findUnique({
        where: { id: resumeId },
      });
      if (!resume) {
        throw new Error("Resume not found");
      }
      resolvedTitle = resume.title;
      
      // Compile content fields into a single text representation
      resumeText += ` ${resume.title || ""}`;
      resumeText += ` ${resume.summary || ""}`;
      resumeText += ` ${resume.skills || ""}`;
      
      if (resume.experience) {
        resumeText += ` ${JSON.stringify(resume.experience)}`;
      }
      if (resume.projects) {
        resumeText += ` ${JSON.stringify(resume.projects)}`;
      }
      if (resume.education) {
        resumeText += ` ${JSON.stringify(resume.education)}`;
      }
    } else if (resumeContent) {
      resumeText = resumeContent;
    } else {
      // Fallback dummy content for empty uploads in test mode
      resumeText = "Senior Software Engineer with experience in React, Node, SQL, Git, and Agile methodology.";
    }

    // 2. Resolve Job Description & Scan Type
    const finalJobDescription = jobDescription || "";
    const isGeneralScan = !finalJobDescription || finalJobDescription.trim().length < 20;
    let detectedJobTitle = isGeneralScan ? "General Professional Profile" : "Target Role";

    if (!isGeneralScan) {
      const jobTitleMatch = finalJobDescription.match(/(?:title|role|position|hiring for|looking for):\s*([^\n\r]+)/i);
      if (jobTitleMatch && jobTitleMatch[1]) {
        detectedJobTitle = jobTitleMatch[1].trim();
      } else {
        // Fallback matching first line if it looks like a title
        const lines = finalJobDescription.split("\n").map(l => l.trim()).filter(Boolean);
        if (lines.length > 0 && lines[0].length < 60 && !lines[0].toLowerCase().includes("job description")) {
          detectedJobTitle = lines[0];
        }
      }
    }

    // 3. Score & Analysis Output Variables
    let overallScore: number = 70;
    let keywordScore: number = 70;
    let formattingScore: number = 70;
    let skillsScore: number = 70;
    let experienceScore: number = 70;
    let educationScore: number = 70;
    let missingKeywords: string[] = [];
    let strengths: string[] = [];
    let suggestions: { priority: string; message: string }[] = [];

    // AI scan via Groq is strictly required. If key is missing, throw error
    if (!process.env.GROQ_API_KEY) {
      throw new Error("Groq API key is not configured in environment");
    }

    const prompt = `You are a professional ATS resume scanner. Analyze the following resume.
${isGeneralScan 
  ? "This is a GENERAL resume scan. Evaluate the resume against general industry standards and best practices (formatting, layout, metrics/numbers usage, action verbs, section hierarchy, readability)." 
  : `Compare the resume against this job description and evaluate how well the candidate matches the requirements:\n---JOB DESCRIPTION---\n${finalJobDescription}\n---------------------`}

---RESUME TEXT---
${resumeText}
-----------------

Provide your analysis in EXACTLY the following JSON format:
{
  "overallScore": number (0-100),
  "keywordScore": number (0-100),
  "formattingScore": number (0-100),
  "skillsScore": number (0-100),
  "experienceScore": number (0-100),
  "educationScore": number (0-100),
  "missingKeywords": ["string", "string", ...],
  "strengths": ["string", "string", ...],
  "suggestions": [
    { "priority": "High" | "Medium" | "Low", "message": "string" },
    ...
  ]
}
Return ONLY valid JSON, with no other conversational text.`;

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
            content: "You are a specialized AI Resume Analyst returning only structured JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Groq API returned an error:", errText);
      throw new Error(`Failed to query AI Resume Analyst: ${response.statusText}`);
    }

    const resJson = await response.json();
    let rawContent = resJson.choices[0].message.content.trim();
    
    // Strip potential markdown code fences
    if (rawContent.startsWith("```")) {
      rawContent = rawContent.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    }
    
    const parsed = JSON.parse(rawContent);
    
    // Extract and map with camelCase + snake_case fallbacks
    overallScore = Number(parsed.overallScore ?? parsed.overall_score) || 70;
    keywordScore = Number(parsed.keywordScore ?? parsed.keyword_score) || 70;
    formattingScore = Number(parsed.formattingScore ?? parsed.formatting_score) || 70;
    skillsScore = Number(parsed.skillsScore ?? parsed.skills_score) || 70;
    experienceScore = Number(parsed.experienceScore ?? parsed.experience_score) || 70;
    educationScore = Number(parsed.educationScore ?? parsed.education_score) || 70;
    missingKeywords = Array.isArray(parsed.missingKeywords ?? parsed.missing_keywords) ? (parsed.missingKeywords ?? parsed.missing_keywords) : [];
    strengths = Array.isArray(parsed.strengths) ? parsed.strengths : [];
    
    const rawSuggestions = Array.isArray(parsed.suggestions) ? parsed.suggestions : [];
    suggestions = rawSuggestions.map((s: any) => ({
      priority: s.priority ?? "Medium",
      message: s.message ?? String(s)
    }));

    // 4. Generate AI Resume Review (recruiter & career coach summary)
    let resumePayloadForAi: any = null;
    if (resumeId) {
      const resume = await prisma.resume.findUnique({
        where: { id: resumeId },
      });
      if (resume) {
        resumePayloadForAi = {
          title: resume.title,
          summary: resume.summary,
          skills: resume.skills,
          experience: resume.experience,
          education: resume.education,
          projects: resume.projects,
        };
      }
    }

    if (!resumePayloadForAi) {
      resumePayloadForAi = {
        title: resolvedTitle,
        rawText: resumeText,
      };
    }

    const aiReview = await aiService.generateResumeReview(resumePayloadForAi, finalJobDescription || "General Scan", {
      overallScore,
      keywordScore,
      formattingScore,
      skillsScore,
      experienceScore,
      educationScore,
      missingKeywords,
      strengths,
    });

    // 5. Save Report in Database
    const report = await prisma.atsAnalysis.create({
      data: {
        userId,
        resumeId: resumeId || null,
        resumeTitle: resolvedTitle,
        jobTitle: detectedJobTitle,
        jobDescription: finalJobDescription || "General Scan (No Job Description)",
        overallScore,
        keywordScore,
        formattingScore,
        skillsScore,
        experienceScore,
        educationScore,
        missingKeywords,
        strengths,
        suggestions,
        aiReview: aiReview as any,
      },
    });

    return report;
  }

  async getHistory(userId: string) {
    const history = await prisma.atsAnalysis.findMany({
      where: { userId },
      select: {
        id: true,
        resumeTitle: true,
        jobTitle: true,
        overallScore: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return history;
  }

  async getReportById(userId: string, reportId: string) {
    const report = await prisma.atsAnalysis.findFirst({
      where: {
        id: reportId,
        userId,
      },
    });
    return report;
  }
}
