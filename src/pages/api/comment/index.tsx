import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const Comment = z.object({
  content: z.string(),
  email: z.string().optional(),
  pageId: z.string(),
  name: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    if (req.body == null) {
      res.status(200).json({ code: 1, message: "Invalid param" });
      return;
    }
    const body = JSON.parse(req.body);
    if (body.pageId == null) {
      body.pageId = "untitled";
    }

    try {
      const validComment = Comment.parse(body);
      if (validComment.name.length > 16) {
        res.status(200).json({ code: 1, message: "Name too long" });
        return;
      }
      if (validComment.email != null && validComment.email.length > 32) {
        res.status(200).json({ code: 1, message: "Email too long" });
        return;
      }
      if (validComment.content.length > 3000) {
        res.status(200).json({ code: 1, message: "Content too long" });
        return;
      }
      console.log("validComment:", JSON.stringify(validComment));
      const createResult = await prisma.comment.create({
        data: {
          ...validComment,
        },
      });
      res
        .status(200)
        .json({ message: "comment created", code: 0, createResult });
      return;
    } catch (e) {
      console.error(e);
      res.status(200).json({ code: 1, message: "Invalid param" });
      return;
    }
  } else {
    let pageId = req.query.pageId;
    if (typeof pageId != "string") {
      res.status(200).json({ code: 1, message: "Invalid param" });
      return;
    }
    if (pageId == null) {
      pageId = "untitled";
    } else {
      pageId = pageId.trim();
    }
    const commentList = await prisma.comment.findMany({
      where: {
        pageId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    res.status(200).json({ code: 0, commentList });
  }
}
