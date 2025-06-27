"use client";

import {
  Card,
  DatePicker,
  Divider,
  Flex,
  Grid,
  Input,
  Table,
  Tag,
  Typography,
  Pagination,
} from "antd";
import {
  SearchOutlined,
  CalendarOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useGetAllLogs } from "@/services/useGetAllLogs";
import { useGetLogsByUserLogged } from "@/services/useGetLogs";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export default function LogsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = !useBreakpoint().md;

  const { pending, logs, error } = useGetLogsByUserLogged();

  const columns = [
    {
      title: "Tipo de atividade",
      dataIndex: "tipoAtividade",
      key: "tipoAtividade",
      render: (text: string) => <Tag bordered={false}>{text}</Tag>,
    },

    {
      title: "Módulo",
      dataIndex: "modulo",
      key: "modulo",
      render: (text: string) => (
        <Tag icon={<AppstoreOutlined />} bordered={false}>
          {text}
        </Tag>
      ),
    },

    { title: "Data e horário", dataIndex: "dataHora", key: "dataHora" },
  ];

  if (pending) {
    return <Text>Carregando...</Text>;
  }

  if (error) {
    return <Text>Erro ao carregar logs</Text>;
  }

  return (
    <>
      <Flex
        vertical
        justify="center"
        style={{
          height: 60,
          padding: "0 32px",
          borderBottom: "1px solid #eaeaea",
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          Logs
        </Title>
        <Text type="secondary">Acompanhe todos os logs de clientes</Text>
      </Flex>

      <div style={{ padding: isMobile ? "16px" : "24px 32px" }}>
        <Card>
          <Flex gap={8} wrap="wrap">
            <Input
              placeholder="Filtre por cliente, atividade ou módulo"
              prefix={<SearchOutlined />}
              style={{ flex: 1, minWidth: 250 }}
            />
            <DatePicker
              placeholder="Selecione"
              suffixIcon={<CalendarOutlined />}
              style={{ width: isMobile ? "100%" : 150 }}
            />
          </Flex>
          <Divider />
          <Table
            dataSource={
              Array.isArray(logs)
                ? logs.map((log) => ({
                    key: log.id,
                    tipoAtividade: log.type,
                    modulo: log.module,
                    dataHora: new Date(log?.createdAt).toLocaleString("pt-BR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    }),
                  }))
                : []
            }
            columns={columns}
            pagination={false}
            scroll={{ x: "max-content" }}
            rowKey="key"
            loading={pending}
          />
        </Card>
        {Array.isArray(logs) && logs.length > 0 && (
          <Flex justify="center" style={{ padding: "24px 0" }}>
            <Pagination
              current={currentPage}
              onChange={(page) => setCurrentPage(page)}
              total={logs.length}
              pageSize={10} // Defina um pageSize fixo
              itemRender={(page, type, originalElement) => {
                if (type === "page") {
                  return (
                    <div
                      style={{
                        backgroundColor:
                          currentPage === page ? "black" : "transparent",
                        color: currentPage === page ? "white" : "inherit",
                        borderRadius: 6,
                        padding: "0 8px",
                        lineHeight: "32px",
                      }}
                    >
                      {page}
                    </div>
                  );
                }
                return originalElement;
              }}
            />
          </Flex>
        )}
      </div>
    </>
  );
}
