import { prisma } from "../config/prisma";

export class ResumeService {
  async createResume(
    userId: string,
    title: string,
    summary?: string,
    skills?: string,
    template?: string,
    education?: any,
    experience?: any,
    projects?: any
  ){
    // SaaS Gating: check if user is on the basic plan and has reached the limit of 10 resumes
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true },
    });

    if (user && user.plan !== "pro") {
      const count = await prisma.resume.count({
        where: { userId },
      });

      if (count >= 10) {
        throw new Error("You have reached your limit of 10 resumes on the Basic plan.");
      }
    }

    const resume = await prisma.resume.create({
      data: {
        userId,
        title,
        summary,
        skills,
        template: template || "modern-ats",
        education,
        experience,
        projects,
      },
    });
    return resume;
  }


 async getAllResumes(userId: string) {
    return prisma.resume.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getResumeById(id: string, userId: string) {
    return prisma.resume.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  async updateResume(
    id: string,
    userId: string,
    data: {
      title?: string;
      summary?: string;
      skills?: string;
      education?: any;
      experience?: any;
      projects?: any;
      template?: string;
    }
  ) {
    const resume = await prisma.resume.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!resume) {
      throw new Error("Resume not found");
    }

    return prisma.resume.update({
      where: {
        id,
      },
      data,
    });
  }

  async deleteResume(id: string, userId: string) {
    const resume = await prisma.resume.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!resume) {
      throw new Error("Resume not found");
    }

    await prisma.resume.delete({
      where: {
        id,
      },
    });

    return {
      message: "Resume deleted",
    };
  }
}
