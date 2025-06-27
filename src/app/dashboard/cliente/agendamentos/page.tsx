"use client";

import {
  Button,
  Card,
  DatePicker,
  Divider,
  Empty,
  Flex,
  Grid,
  Input,
  Typography,
  Space,
  Pagination,
  Table,
  Tag,
} from "antd";
import { CloseCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { useGetSchedulesByUser } from "@/services/useGetSchedulesByUser";
import { useAuthStore, UserState } from "@/store/useAuthStore";
import { useState } from "react";
import { getStatusColor } from "../../admin/agendamentos/page";
import { ModalCreateSchedule } from "@/components/modal-create-schedule";
import { useCancelScheduleByUser } from "@/services/mutations/useCancelScheduleByUser";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export default function AgendamentosPage() {
  const isMobile = !useBreakpoint().md;
  const [currentPage, setCurrentPage] = useState(1);
  const [openModalCreateSchedule, setOpenModalCreateSchedule] =
    useState<boolean>(false);
  const user: UserState | undefined = useAuthStore(
    (state: { user: UserState | undefined }) => state.user
  );

  const { isPending, error, schedules, refetch } = useGetSchedulesByUser(
    user?.user?.id || ""
  );

  const {
    cancelSchedule,
    isPending: isCancelling,
    error: cancelError,
  } = useCancelScheduleByUser();

  const handleCancelSchedule = async (scheduleId: string) => {
    await cancelSchedule(scheduleId);
    refetch();
  };

  const columns = [
    { title: "Data agendamento", dataIndex: "horario", key: "horario" },
    { title: "Nome", dataIndex: "nome", key: "nome" },
    {
      title: "Sala de agendamento",
      dataIndex: "sala",
      key: "sala",
      render: (sala: string) => (
        <Tag color="black" bordered={true}>
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
      render: (_: any, record: { id: string; status: string }) => {
        if (record.status === "cancelled") return null;
        return (
          <Button
            style={{ background: "black" }}
            type="primary"
            shape="circle"
            icon={<CloseCircleOutlined />}
            onClick={() => handleCancelSchedule(record.id)}
          />
        );
      },
    },
  ];

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
          Agendamento
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
                placeholder="Pesquisar agendamentos"
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
              onClick={() => setOpenModalCreateSchedule(true)}
            >
              Novo Agendamento
            </Button>
          </Flex>

          <Divider />

          {Array.isArray(schedules) && schedules.length > 0 ? (
            <Table
              dataSource={(schedules ?? []).map((schedule: any) => ({
                id: schedule.id,
                key: schedule.id,
                horario: new Date(schedule.startTime).toLocaleString(),
                nome: `${user?.user?.name} ${user?.user?.lastName}`,
                sala: schedule.room.name,
                status: schedule.status,
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

        {Array.isArray(schedules) && schedules.length > 0 && (
          <Flex justify="center" style={{ padding: "24px 0" }}>
            <Pagination
              current={currentPage}
              onChange={(page) => setCurrentPage(page)}
              total={schedules.length}
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

      {openModalCreateSchedule && (
        <ModalCreateSchedule
          openModalCreateSchedule={openModalCreateSchedule}
          setOpenModalCreateSchedule={setOpenModalCreateSchedule}
          userId={user?.user?.id || ""}
          refetchSchedules={refetch}
        />
      )}
    </>
  );
}
