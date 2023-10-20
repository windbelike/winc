// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
  user: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const user = await prisma.user.create({
    data: {
      email: "elsa@prisma.io",
      name: "Elsa Prisma",
    },
  });

  res.status(200).json({ name: "John Doe", user: user });
}
