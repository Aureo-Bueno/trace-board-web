"use client";

import {
  Button,
  Card,
  DatePicker,
  Divider,
  Flex,
  Grid,
  Input,
  Table,
  Tag,
  Typography,
  Empty,
  Pagination,
  Space,
  Modal,
  Select,
} from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useGetSchedules } from "@/services/useGetSchedule";
import { useGetRooms } from "@/services/useGetRooms";
import { ModalCreateRoom } from "@/components/modal-create-room";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export const getStatusColor = (status: string) => {
  if (status === "pending") return "cyan";
  if (status === "cancelled") return "red";
  if (status === "scheduled") return "green";
  return "default";
};

export default function AgendamentosPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [openModalCreateRoom, setOpenModalCreateRoom] =
    useState<boolean>(false);
  const isMobile = !useBreakpoint().md;
  const { isPending, error, schedules, refetch } = useGetSchedules();

  const columns = [
    { title: "Data agendamento", dataIndex: "horario", key: "horario" },
    { title: "Nome", dataIndex: "nome", key: "nome" },
    {
      title: "Sala de agendamento",
      dataIndex: "sala",
      key: "sala",
      render: (sala: string) => (
        <Tag color="black" bordered={false}>
          {sala}
        </Tag>
      ),
    },
    {
      title: "Status transação",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)} bordered={false}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Ação",
      key: "action",
      render: () => (
        <Button
          danger
          type="primary"
          shape="circle"
          icon={<DeleteOutlined />}
        />
      ),
    },
  ];

  if (error) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: 300 }}>
        <Text type="danger">
          Alguma coisa deu errado! Tente novamente mais tarde.
        </Text>
      </Flex>
    );
  }

  if (isPending) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: 300 }}>
        <Text type="secondary">Carregando...</Text>
      </Flex>
    );
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
          Agendamentos
        </Title>
        <Text type="secondary">
          Acompanhe todos os seus agendamentos de forma simples
        </Text>
      </Flex>

      <div style={{ padding: isMobile ? "16px" : "24px 32px" }}>
        <Card>
          <Flex vertical={isMobile} justify="space-between" gap={16}>
            <Space
              direction={isMobile ? "vertical" : "horizontal"}
              wrap
              style={{ width: isMobile ? "100%" : "auto" }}
            >
              <Input
                placeholder="Pesquisar..."
                prefix={<SearchOutlined />}
                style={{ width: isMobile ? "100%" : 250 }}
              />
              <DatePicker
                placeholder="Selecione a data"
                style={{ width: isMobile ? "100%" : "auto" }}
              />
            </Space>
            <Button
              type="primary"
              style={{ background: "black", width: isMobile ? "100%" : "auto" }}
              onClick={() => setOpenModalCreateRoom(true)}
            >
              Configuracoes
            </Button>
          </Flex>
          <Divider />
          {schedules.length > 0 ? (
            <Table
              dataSource={schedules.map((schedule) => ({
                key: schedule.id,
                horario: new Date(schedule.startTime).toLocaleString(),
                nome: schedule?.fullNameUser,
                sala: schedule?.room?.name,
                status: schedule?.status,
              }))}
              columns={columns}
              pagination={false}
              onRow={(record) => ({
                style: {
                  background:
                    record.status === "Cancelado"
                      ? "#fff1f0"
                      : record.status === "Agendado"
                      ? "#e6fffb"
                      : undefined,
                },
              })}
              scroll={{ x: "max-content" }}
              loading={isPending}
              rowKey="key"
            />
          ) : (
            <Flex justify="center" align="center" style={{ minHeight: 300 }}>
              <Empty description={<Text strong>Nada por aqui ainda...</Text>} />
            </Flex>
          )}
        </Card>

        {schedules.length > 0 && (
          <Flex justify="center" style={{ padding: "24px 0" }}>
            <Pagination
              current={currentPage}
              onChange={(page) => setCurrentPage(page)}
              total={schedules.length}
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

      {openModalCreateRoom && (
        <ModalCreateRoom
          openModalCreateRoom={openModalCreateRoom}
          setOpenModalCreateRoom={setOpenModalCreateRoom}
          refetchSchedules={refetch}
        />
      )}
    </>
  );
}
