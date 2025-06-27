import { useCreateRoom } from "@/services/mutations/useCreateRoom";
import { useCreateSchedule } from "@/services/mutations/useCreateSchedule";
import { useGetRooms } from "@/services/useGetRooms";
import { Button, Flex, Grid, Input, Modal, Select, Typography } from "antd";
import { useState } from "react";

const { useBreakpoint } = Grid;

interface Props {
  openModalCreateRoom: boolean;
  setOpenModalCreateRoom: (open: boolean) => void;
  refetchSchedules?: () => void;
}

export function ModalCreateRoom(props: Props) {
  const { openModalCreateRoom, setOpenModalCreateRoom, refetchSchedules } =
    props;
  const isMobile = !useBreakpoint().md;
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [formData, setFormData] = useState<any>({});
  const [formScheduleData, setFormScheduleData] = useState<any>({});

  const { isPending: isPendingRooms, error: errorRooms, rooms } = useGetRooms();
  const {
    isPending: isPendingCreateRoom,
    error: errorCreateRoom,
    createRoom,
  } = useCreateRoom();

  const {
    isPending: isPendingCreateSchedule,
    error: errorCreateSchedule,
    createSchedule,
  } = useCreateSchedule();

  const handleCreateNewRoom = async () => {
    await createRoom(formData);
    await refetchSchedules?.();
    setOpenModalCreateRoom(false);
    setOpenForm(false);
    setFormData({});
  };

  const handleCreateSchedule = async () => {
    if (!formScheduleData) {
      return;
    }
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");

    const startDateTime = `${yyyy}-${mm}-${dd}T${formScheduleData.startTime}:00`;
    const endDateTime = `${yyyy}-${mm}-${dd}T${formScheduleData.endTime}:00`;

    const { startTime, endTime, ...rest } = formScheduleData;
    const schedulePayload = {
      ...rest,
      startDateTime,
      endDateTime,
    };

    await createSchedule(schedulePayload);
    await refetchSchedules?.();
    setOpenModalCreateRoom(false);
    setFormScheduleData({});
  };

  return (
    <>
      <Modal
        open={openModalCreateRoom}
        title="Ajuste de agendamentos"
        onOk={handleCreateSchedule}
        onCancel={() => setOpenModalCreateRoom(false)}
        okButtonProps={{
          style: { background: "black", width: isMobile ? "100%" : "auto" },
          disabled: isPendingCreateRoom,
          loading: isPendingCreateRoom,
          onClick: handleCreateSchedule,
        }}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            <OkBtn />
          </>
        )}
      >
        <Flex vertical gap={16}>
          <div>
            <Typography.Title level={5}>Nome da Sala</Typography.Title>
            <Select
              style={{ width: "100%" }}
              options={rooms?.map((room: any) => ({
                value: room.id,
                label: room.name,
              }))}
              placeholder="Selecione uma sala"
              loading={isPendingRooms}
              disabled={isPendingRooms}
              onChange={(value) =>
                setFormScheduleData({ ...formScheduleData, roomId: value })
              }
            />

            <Typography.Title level={5}>
              Horario Inicial e final
            </Typography.Title>
            <Flex gap={8} align="center">
              <Input
                type="time"
                style={{ width: "100%" }}
                placeholder="Horário Inicial"
                onChange={(e) =>
                  setFormScheduleData({
                    ...formScheduleData,
                    startTime: e.target.value,
                  })
                }
              />
              <span>até</span>
              <Input
                type="time"
                style={{ width: "100%" }}
                placeholder="Horário Final"
                onChange={(e) =>
                  setFormScheduleData({
                    ...formScheduleData,
                    endTime: e.target.value,
                  })
                }
              />
            </Flex>

            <Typography.Title level={5}>
              Bloco de horario de agendamento
            </Typography.Title>
            <Flex gap={8} align="center">
              <Input
                type="number"
                style={{ width: "100%" }}
                placeholder="Bloco de Horário (minutos)"
                onChange={(e) =>
                  setFormScheduleData({
                    ...formScheduleData,
                    blockTime: e.target.value,
                  })
                }
              />
              <span>minutos</span>
            </Flex>
          </div>

          <Button
            type="primary"
            style={{ background: "black", width: isMobile ? "100%" : "auto" }}
            onClick={() => setOpenForm(!openForm)}
          >
            Adicionar Nova Sala
          </Button>

          {openForm && (
            <Flex vertical gap={16}>
              <Input
                placeholder="Nome da Sala"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <Input
                placeholder="Capacidade"
                type="number"
                onChange={(e) =>
                  setFormData({ ...formData, capacity: e.target.value })
                }
              />
              <Input
                placeholder="Localização"
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
              <Select
                style={{ width: "100%" }}
                options={[
                  { value: "available", label: "Disponível" },
                  { value: "maintenance", label: "Indisponível" },
                  { value: "occupied", label: "Ocupada" },
                ]}
                placeholder="Status da Sala"
                onChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              />
              <Button
                type="primary"
                onClick={handleCreateNewRoom}
                disabled={isPendingCreateRoom}
                loading={isPendingCreateRoom}
                style={{
                  background: "black",
                  width: isMobile ? "100%" : "auto",
                }}
              >
                Criar Sala
              </Button>
              {errorCreateRoom && (
                <Typography.Text type="danger">
                  Alguma coisa deu errado ao criar a sala. Tente novamente.
                </Typography.Text>
              )}
            </Flex>
          )}
        </Flex>
      </Modal>
    </>
  );
}
