import { useCreateScheduleByUser } from "@/services/mutations/useCreateScheduleByUser";
import { useGetRoomsAvailable } from "@/services/useGetRoomsAvailable";
import {
  DatePicker,
  Divider,
  Flex,
  Grid,
  Input,
  Modal,
  Select,
  Typography,
} from "antd";
import { useState } from "react";

const { useBreakpoint } = Grid;

interface Props {
  openModalCreateSchedule: boolean;
  setOpenModalCreateSchedule: (open: boolean) => void;
  userId: string;
  refetchSchedules: () => void;
}

export function ModalCreateSchedule(props: Props) {
  const {
    openModalCreateSchedule,
    setOpenModalCreateSchedule,
    userId,
    refetchSchedules,
  } = props;
  const isMobile = !useBreakpoint().md;
  const [formData, setFormData] = useState<any>({
    userId: userId,
  });
  const [validated, setValidated] = useState<boolean>(false);

  const { roomsAvailable, error, isPending, refetch } = useGetRoomsAvailable();

  const { createSchedule, isPending: isCreating } = useCreateScheduleByUser();

  const handleCreateSchedule = async () => {
    if (!formData.date || !formData.startTime || !formData.roomId) {
      setValidated(true);
      return;
    }
    await createSchedule(formData);
    await refetchSchedules();
    setOpenModalCreateSchedule(false);
    setFormData({ userId: userId });
  };

  return (
    <>
      <Modal
        open={openModalCreateSchedule}
        title="Novo Agendamento"
        onOk={handleCreateSchedule}
        onCancel={() => setOpenModalCreateSchedule(false)}
        okButtonProps={{
          style: { background: "black", width: isMobile ? "100%" : "auto" },
          onClick: handleCreateSchedule,
          loading: isCreating,
          disabled: isCreating,
        }}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            <OkBtn />
          </>
        )}
      >
        <Divider />
        <Flex vertical gap={16}>
          <div>
            <Typography.Title level={5}>
              Selecione uma data <strong>(Obrigatório)</strong>
              <DatePicker
                style={{ width: "100%" }}
                placeholder="Selecione a data"
                onChange={(date, dateString) =>
                  setFormData({ ...formData, date: dateString })
                }
              />
            </Typography.Title>
            <Typography.Title level={5}>
              Selecione um horario <strong>(Obrigatório)</strong>
            </Typography.Title>
            <Input
              type="time"
              style={{ width: "100%" }}
              placeholder="Selecione o horário"
              onChange={(e) =>
                setFormData({ ...formData, startTime: e.target.value })
              }
            />

            <Typography.Title level={5}>
              Selecione uma sala <strong>(Obrigatório)</strong>
            </Typography.Title>
            <Select
              style={{ width: "100%" }}
              placeholder="Selecione uma sala"
              options={roomsAvailable.map((room) => ({
                value: room.id,
                label: room.name,
              }))}
              onChange={(value) => setFormData({ ...formData, roomId: value })}
            />
            {validated && (
              <Typography.Text type="danger">
                Preencha todos os campos obrigatórios!
              </Typography.Text>
            )}
          </div>
        </Flex>
      </Modal>
    </>
  );
}
