import { getServerAuthSession } from '@/server/auth';
import axiosSSR from '@/utils/axios/axiosSSR';
import { type AxiosRequestConfig } from "axios";
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerAuthSession({ req, res });
  if (!session) return res.status(401);

  const { type, startDate, endDate } = req.query;

  if (req.method === "GET") {
    if (!startDate || !endDate) return res.status(404).json({ message: "Date Not found!" });
    const config: AxiosRequestConfig = {
      url: `/reports/transaction-detail/pdf/${type as string}/${startDate as string}/${endDate as string}`,
      method: "GET",
      responseType: "arraybuffer",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/pdf",
      },
    }
    return await axiosSSR<Buffer>(config)
      .then((result) => {
        const response = result.data;
        res.status(200).send(response);
      })
      .catch((err: { response: { data: { message: string } } }) => {
        const response = err.response.data;
        res.status(500).json(response);
      });
  }
  return res.status(404).json({ message: "Not found!" });
}