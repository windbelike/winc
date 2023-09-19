
import prisma from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod';


const Comment = z.object({
  content: z.string(),
  email: z.string().optional(),
  pageId: z.string(),
  name: z.string()
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    if (req.body == null) {
      res.status(200).json({ code: 1, message: 'Invalid param' })
      return
    }
    const body = JSON.parse(req.body)
    console.log("body:", body)

    const { comment } = body
    console.log("comment:", body.comment)

    try {
      const validComment = Comment.parse(comment)
      console.log("validComment:", JSON.stringify(validComment))
      const createResult = await prisma.comment.create({
        data: {
          ...validComment
        }
      })
      res.status(200).json({ message: 'comment created', code: 0, createResult })
      return
    } catch (e) {
      console.error(e)
      res.status(200).json({ code: 1, message: 'Invalid param' })
      return
    }
  } else {
    res.status(200).json({ message: 'Invalid method', code: 1 })
  }
}
