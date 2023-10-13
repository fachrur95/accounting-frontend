import { getServerAuthSession } from '@/server/auth';
import axiosSSR from '@/utils/axios/axiosSSR';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerAuthSession({ req, res });
  if (!session) return res.status(401);

  const id = req.query.id;

  if (req.method === "DELETE") {
    if (!id) return res.status(404).json({ message: "ID Not found!" });
    const config = {
      url: `/item-types/${id as string}`,
      method: "DELETE",
      headers: { Authorization: `Bearer ${session.accessToken}` },
    }
    return await axiosSSR<{ message: string }>(config)
      .then((result) => {
        const response = result.data;
        res.status(200).json(response);
      })
      .catch((err: { response: { data: { message: string } } }) => {
        const response = err.response.data;
        res.status(500).json(response);
      });
  }
  return res.status(404).json({ message: "Not found!" });
}