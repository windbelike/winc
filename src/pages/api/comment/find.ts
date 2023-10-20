import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    res.status(200).json({ message: "Invalid method" });
  } else {
    const pageId = req.query.pageId;
    if (typeof pageId != "string") {
      res.status(200).json({ code: 1, message: "Invalid param" });
      return;
    }
    if (pageId == null || pageId.trim() == "") {
      res.status(200).json({ code: 1, message: "Invalid param" });
      return;
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
