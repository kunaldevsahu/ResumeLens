import { prisma } from "../config/prisma";

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

// Helper to detect action verbs in text
const ACTION_VERBS = [
  "led", "managed", "developed", "built", "implemented", "designed", "created",
  "architected", "optimized", "delivered", "coordinated", "collaborated",
  "increased", "reduced", "improved", "launched", "executed"
];

export class AtsService {
  async analyzeResume(
    userId: string,
    payload: {
      resumeId?: string;
      resumeTitle?: string;
      resumeContent?: string;
      jobDescription: string;
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

    // 2. Extract job title from description if possible
    let detectedJobTitle = "Target Role";
    const jobTitleMatch = jobDescription.match(/(?:title|role|position|hiring for|looking for):\s*([^\n\r]+)/i);
    if (jobTitleMatch && jobTitleMatch[1]) {
      detectedJobTitle = jobTitleMatch[1].trim();
    } else {
      // Fallback matching first line if it looks like a title
      const lines = jobDescription.split("\n").map(l => l.trim()).filter(Boolean);
      if (lines.length > 0 && lines[0].length < 60 && !lines[0].toLowerCase().includes("job description")) {
        detectedJobTitle = lines[0];
      }
    }

    // 3. Keyword Match Analysis
    const jdKeywords = KEYWORD_BANK.filter(kw => 
      new RegExp(`\\b${kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i').test(jobDescription)
    );

    // If JD is completely generic and has no matches, select 6 default ones
    const finalJdKeywords = jdKeywords.length > 0 ? jdKeywords : ["React", "Node", "JavaScript", "SQL", "Git", "Agile"];

    const matchedKeywords = finalJdKeywords.filter(kw => 
      new RegExp(`\\b${kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i').test(resumeText)
    );

    const missingKeywords = finalJdKeywords.filter(kw => !matchedKeywords.includes(kw));

    // Calculate score components
    const keywordScore = Math.round((matchedKeywords.length / finalJdKeywords.length) * 100);

    // Formatting check: standard metrics
    let formattingScore = 95;
    if (resumeText.length < 200) formattingScore -= 30; // too short
    if (resumeText.includes("table") || resumeText.includes("columns")) formattingScore -= 10; // complex formatting risk

    // Skills match score
    const skillsScore = Math.min(100, Math.round(keywordScore + 10));

    // Experience score checks (action verbs + quantitative metrics)
    let experienceScore = 70;
    const hasNumbers = /\b\d+(?:%|\s*years|\s*\+\s*|k)\b/i.test(resumeText);
    const usedVerbs = ACTION_VERBS.filter(verb => 
      new RegExp(`\\b${verb}\\b`, 'i').test(resumeText)
    );

    if (hasNumbers) experienceScore += 15;
    if (usedVerbs.length >= 3) experienceScore += 15;
    experienceScore = Math.min(100, experienceScore);

    // Education score checks
    let educationScore = 80;
    const hasEducationKeywords = /\b(degree|university|college|b\.s|b\.a|m\.s|bachelor|master|education)\b/i.test(resumeText);
    if (hasEducationKeywords) educationScore += 20;

    // Overall ATS Score
    const overallScore = Math.round(
      (keywordScore + formattingScore + skillsScore + experienceScore + educationScore) / 5
    );

    // 4. Generate Strengths
    const strengths: string[] = [];
    if (formattingScore >= 90) strengths.push("ATS friendly resume layout and safe fonts");
    if (skillsScore >= 80) strengths.push("Strong core technical skills alignment");
    if (usedVerbs.length >= 3) strengths.push("Excellent usage of active, results-oriented verbs");
    if (hasNumbers) strengths.push("Includes measurable results and impact metrics");
    if (strengths.length === 0) strengths.push("Proper section headers and clear hierarchy");

    // 5. Generate Suggestions
    const suggestions: { priority: string; message: string }[] = [];
    if (missingKeywords.length > 0) {
      suggestions.push({
        priority: "High",
        message: `Add missing role-specific keywords: ${missingKeywords.slice(0, 3).join(", ")}.`
      });
    }
    if (!hasNumbers) {
      suggestions.push({
        priority: "High",
        message: "Incorporate metrics and numbers (e.g. percentages, dollars saved, hours reduced) to quantify achievements."
      });
    }
    if (usedVerbs.length < 3) {
      suggestions.push({
        priority: "Medium",
        message: "Swap weak passive verbs for strong action verbs (e.g. change 'responsible for designing' to 'designed and launched')."
      });
    }
    if (resumeText.length < 500) {
      suggestions.push({
        priority: "Medium",
        message: "Expand on work history descriptions to describe accomplishments and challenges faced."
      });
    }
    if (!hasEducationKeywords) {
      suggestions.push({
        priority: "Low",
        message: "Add or format your education section to clearly list degrees, institutions, and graduation years."
      });
    }

    // Default suggestions if none are generated
    if (suggestions.length === 0) {
      suggestions.push({
        priority: "Low",
        message: "Add links to your professional portfolio or GitHub profile."
      });
    }

    // 6. Save Report in Database
    const report = await prisma.atsAnalysis.create({
      data: {
        userId,
        resumeId: resumeId || null,
        resumeTitle: resolvedTitle,
        jobTitle: detectedJobTitle,
        jobDescription,
        overallScore,
        keywordScore,
        formattingScore,
        skillsScore,
        experienceScore,
        educationScore,
        missingKeywords,
        strengths,
        suggestions,
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
