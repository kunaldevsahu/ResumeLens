import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";

export class AuthService {
  async register(
    name: string,
    email: string,
    password: string
  ) {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
      }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        linkedin: user.linkedin,
        github: user.github,
        profilePicture: user.profilePicture,
        plan: user.plan,
        subscriptionStatus: user.subscriptionStatus,
      }
    };
  }

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        linkedin: true,
        github: true,
        profilePicture: true,
        plan: true,
        subscriptionStatus: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const resumeCount = await prisma.resume.count({
      where: { userId },
    });

    return {
      ...user,
      resumeCount,
    };
  }

  async updateProfile(
    userId: string,
    data: {
      name?: string;
      phone?: string;
      linkedin?: string;
      github?: string;
      profilePicture?: string;
    }
  ) {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        phone: data.phone,
        linkedin: data.linkedin,
        github: data.github,
        profilePicture: data.profilePicture,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        linkedin: true,
        github: true,
        profilePicture: true,
        plan: true,
        subscriptionStatus: true,
      },
    });

    return updatedUser;
  }

  async updatePassword(
    userId: string,
    currentPassword?: string,
    newPassword?: string
  ) {
    if (!currentPassword || !newPassword) {
      throw new Error("Current and new passwords are required");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      throw new Error("Incorrect current password");
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: newPasswordHash,
      },
    });

    return { message: "Password updated successfully" };
  }

  async upgradePlan(userId: string) {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        plan: "pro",
        subscriptionStatus: "active",
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        linkedin: true,
        github: true,
        profilePicture: true,
        plan: true,
        subscriptionStatus: true,
      },
    });

    return updatedUser;
  }
}