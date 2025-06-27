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
  Form,
  Row,
  Col,
} from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  SearchOutlined,
} from "@ant-design/icons";
import { useCallback, useEffect, useRef } from "react";
import { useGetCep } from "@/services/useGetCep";
import { useAuthStore, UserState } from "@/store/useAuthStore";
import { useGetAddressByUser } from "@/services/useGetAddressByUser";
import { useUpdateUserByUser } from "@/services/mutations/useUpdateUserByUser";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export default function MinhaContaPage() {
  const isMobile = !useBreakpoint().md;
  const { getCep, isError } = useGetCep();
  const [form] = Form.useForm();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const user: UserState | undefined = useAuthStore(
    (state: { user: UserState | undefined }) => state.user
  );
  const { pending, address, error, refetchAddress } = useGetAddressByUser(
    user?.user?.id || ""
  );

  const { isPending, updateUser } = useUpdateUserByUser();

  useEffect(() => {
    if (user?.user && address) {
      form.setFieldsValue({
        name: user.user.name,
        lastName: user.user.lastName,
        email: user.user.email,
        zipCode: address?.zipCode || "",
        street: address?.street || "",
        number: address?.number || "",
        complement: address?.complement || "",
        neighborhood: address?.neighborhood || "",
        city: address?.city || "",
        state: address?.state || "",
      });
    }
  }, [user, form, address]);

  const handleCepChange = useCallback(
    (cep: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(async () => {
        if (cep.length <= 7) return;
        try {
          const cepData = await getCep(cep);
          if (cepData) {
            form.setFieldsValue({
              street: cepData.logradouro,
              neighborhood: cepData.bairro,
              city: cepData.localidade,
              state: cepData.uf,
            });
          } else {
            console.error("CEP não encontrado.");
          }
        } catch (error) {
          console.error("Erro ao buscar CEP:", error);
        }
      }, 500);
    },
    [getCep, form]
  );

  const onFinish = async (values: any) => {
    try {
      const userData = {
        id: user?.user?.id,
        name: values.name,
        lastName: values.lastName,
        password: values.password,
      };
      const addressData = {
        zipCode: values.zipCode,
        street: values.street,
        number: values.number,
        complement: values.complement,
        neighborhood: values.neighborhood,
        city: values.city,
        state: values.state,
      };
      await updateUser({ ...userData, address: addressData });
      if (!isPending) {
        form.resetFields();
        refetchAddress();
      }
    } catch (error) {
      form.setFields([
        {
          name: "email",
          errors: ["Erro ao atualizar usuário. Tente novamente."],
        },
      ]);
    }
  };

  return (
    <>
      <Flex
        vertical
        justify="center"
        style={{ marginTop: 110, paddingLeft: 20 }}
      >
        <Title level={3}>Minha Conta</Title>
        <Text type="secondary">
          Ajuste informações da sua conta de forma simples
        </Text>
      </Flex>

      <Divider />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Card style={{ width: "55%" }}>
          <Flex vertical={isMobile} justify="center" gap={24}>
            <Form
              layout="vertical"
              requiredMark={false}
              form={form}
              onFinish={onFinish}
            >
              <Row gutter={48}>
                <Col xs={24} md={10} lg={12}>
                  <Form.Item
                    label={
                      <span>
                        <strong>Nome</strong> (Obrigatório)
                      </span>
                    }
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: "Por favor, informe seu nome.",
                      },
                    ]}
                  >
                    <Input placeholder="Mateus" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={10}>
                  <Form.Item
                    label={
                      <span>
                        <strong>Sobrenome</strong> (Obrigatório)
                      </span>
                    }
                    name="lastName"
                    rules={[
                      {
                        required: true,
                        message: "Por favor, informe seu sobrenome.",
                      },
                    ]}
                  >
                    <Input placeholder="Barbosa" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label={
                  <span>
                    <strong>E-mail</strong>
                  </span>
                }
                name="email"
              >
                <Input placeholder="seuemail@dominio.com" disabled />
              </Form.Item>

              <Form.Item
                label={
                  <span>
                    <strong>Senha de acesso</strong> (Obrigatório)
                  </span>
                }
                name="password"
                rules={[
                  { required: true, message: "Por favor, informe sua senha." },
                ]}
              >
                <Input.Password
                  placeholder="************"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  value={""}
                />
              </Form.Item>

              <Form.Item
                label={
                  <span>
                    <strong>CEP</strong> (Obrigatório)
                  </span>
                }
                name="zipCode"
                rules={[
                  { required: true, message: "Por favor, informe seu CEP." },
                ]}
              >
                <Input
                  placeholder="00000-000"
                  onChange={(e) => handleCepChange(e.target.value)}
                  disabled={pending}
                />
                {isError && <p style={{ color: "red" }}>Erro ao buscar CEP.</p>}
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} md={16}>
                  <Form.Item label={<strong>Endereço</strong>} name="street">
                    <Input
                      placeholder="Rua, Avenida, etc."
                      disabled={pending}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label={<strong>Número</strong>} name="number">
                    <Input placeholder="123" disabled={pending} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label={<strong>Complemento</strong>} name="complement">
                <Input placeholder="Apto, sala, etc." disabled={pending} />
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<strong>Bairro</strong>}
                    name="neighborhood"
                  >
                    <Input placeholder="Seu bairro" disabled={pending} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label={<strong>Cidade</strong>} name="city">
                    <Input placeholder="Sua cidade" disabled={pending} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label={<strong>Estado</strong>} name="state">
                <Input placeholder="Seu estado" disabled={pending} />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  style={{ background: "#000", borderColor: "#000" }}
                >
                  Salvar
                </Button>
              </Form.Item>
            </Form>
          </Flex>
        </Card>
      </div>
    </>
  );
}
