import { QueryTypes } from "sequelize";
import sequelize from "../../database";

interface Request {
  startDate: string;
  endDate: string;
  tenantId: string | number;
}

const query = `
  select dt_referencia, label, qtd, ROUND(100.0*(qtd/sum(qtd) over ()), 2) pertentual  from (
  select
  to_char(date_trunc('day', t."createdAt"), 'DD/MM/YYYY') dt_referencia,
  t.channel as label,
  count(1) as qtd
  from "Tickets" t
  where t."tenantId" = :tenantId
  and date_trunc('day', t."createdAt") between :startDate and :endDate
  group by date_trunc('day', t."createdAt"), t.channel
  ) a
  order by 1
`;

const DashTicketsEvolutionChannels = async ({
  startDate,
  endDate,
  tenantId
}: Request): Promise<any[]> => {
  const data = await sequelize.query(query, {
    replacements: {
      tenantId,
      startDate,
      endDate
    },
    type: QueryTypes.SELECT
    // logging: console.log
  });
  console.log("DashTicketsEvolutionChannels", data);
  return data;
};

export default DashTicketsEvolutionChannels;