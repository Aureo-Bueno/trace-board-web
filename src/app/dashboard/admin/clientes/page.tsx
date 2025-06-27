"use client";

import {
  Card,
  DatePicker,
  Divider,
  Flex,
  Grid,
  Input,
  Switch,
  Table,
  Typography,
  Pagination,
  Tag,
} from "antd";
import { SearchOutlined, CalendarOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Client, useGetClients } from "@/services/useGetClientes";
import { useDeleteUser } from "@/services/mutations/useDeleteUser";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export default function ClientesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = !useBreakpoint().md;
  const { pending, clients, error, refetchClients } = useGetClients();
  const {
    isPending: isPendingDelete,
    error: errorDelete,
    deleteUser,
  } = useDeleteUser();

  const handleStatusChange = async (userId: string, currentStatus: boolean) => {
    await deleteUser(userId, currentStatus);
    await refetchClients();
  };

  const columns = [
    {
      title: "Data de cadastro",
      dataIndex: "dataCadastro",
      key: "dataCadastro",
    },
    {
      title: "Nome",
      dataIndex: "nome",
      key: "nome",
      render: (text: string, record: { tipo: string }) => (
        <Flex vertical>
          <span>{text}</span>
          <Text type="secondary" style={{ fontSize: "0.75rem" }}>
            {record.tipo}
          </Text>
        </Flex>
      ),
    },
    { title: "Endereço", dataIndex: "endereco", key: "endereco" },
    {
      title: "Permissões",
      key: "permissoes",
      render: () => (
        <Flex gap={8}>
          <Tag bordered={false}>Agendamentos</Tag>
          <Tag bordered={false}>Logs</Tag>
        </Flex>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: boolean, record: { id: string }) => (
        <Switch
          defaultChecked={status}
          onClick={() => handleStatusChange(record.id, status)}
          loading={isPendingDelete}
        />
      ),
    },
  ];

  if (pending) {
    return <Text>Carregando...</Text>;
  }

  if (error) {
    return <Text>Erro ao carregar clientes</Text>;
  }

  return (
    <>
      <Flex
        vertical
        justify="center"
        style={{
          height: 100,
          padding: "0 32px",
          borderBottom: "1px solid #eaeaea",
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          Clientes
        </Title>
        <Text type="secondary">Overview de todos os clientes</Text>
      </Flex>

      <div style={{ padding: isMobile ? "16px" : "24px 32px" }}>
        <Card>
          <Flex gap={8} wrap="wrap">
            <Input
              placeholder="Filtre por nome"
              prefix={<SearchOutlined />}
              style={{ flex: 1, minWidth: 200 }}
            />
            <DatePicker
              placeholder="Selecione"
              suffixIcon={<CalendarOutlined />}
              style={{ width: isMobile ? "100%" : 150 }}
            />
          </Flex>
          <Divider />
          <Table
            loading={pending}
            rowKey="id"
            dataSource={clients?.map((client: Client) => ({
              ...client,
              tipo: client.isAdmin ? "Administrador" : "Cliente",
              dataCadastro: new Date(client.createdAt).toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }),
              status: client.deletedAt ? false : true,
              nome: `${client.name} ${client.lastName}`,
              endereco:
                `${client?.address?.street} n°${client?.address?.number} ${
                  client?.address?.neighborhood || ""
                }, ${client?.address?.city || ""} - ${
                  client?.address?.state || ""
                }` || "Endereço não informado",
            }))}
            columns={columns}
            pagination={false}
            scroll={{ x: "max-content" }}
          />
        </Card>
        <Flex justify="center" style={{ padding: "24px 0" }}>
          <Pagination
            current={currentPage}
            onChange={(page) => setCurrentPage(page)}
            total={clients.length}
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
      </div>
    </>
  );
}
