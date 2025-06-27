"use client";

import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Row,
  Col,
  Flex,
  Grid,
  message,
} from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useGetCep } from "@/services/useGetCep";
import { useRef, useCallback } from "react";
import { useCreateUser } from "@/services/useCreateUser";

const { Title } = Typography;
const { useBreakpoint } = Grid;

export default function CadastroPage() {
  const { md } = useBreakpoint();
  const isMobile = !md;
  const { getCep, isError } = useGetCep();
  const { handleCreateUser, pending, success, error } = useCreateUser();
  const [form] = Form.useForm();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const onFinish = async (values: any) => {
    try {
      await handleCreateUser(values);
      if (success) {
        form.resetFields();
        message.success("Usuário cadastrado com sucesso!");
      }

      if (error) {
        message.error("Erro ao cadastrar usuário");
      }
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      message.error("Ocorreu um erro ao cadastrar o usuário. Tente novamente.");
    }
  };

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

  return (
    <Flex vertical align="center" gap="middle">
      <Title level={3} style={{ textAlign: "center" }}>
        Crie sua conta
      </Title>

      <Card
        style={{
          width: isMobile ? 380 : 450,
          maxWidth: "100%",
        }}
      >
        <Form
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          form={form}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label={
                  <span>
                    <strong>Nome</strong> (Obrigatório)
                  </span>
                }
                name="name"
                rules={[
                  { required: true, message: "Por favor, informe seu nome." },
                ]}
              >
                <Input placeholder="Mateus" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
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
                <strong>E-mail</strong> (Obrigatório)
              </span>
            }
            name="email"
            rules={[
              { required: true, message: "Por favor, informe seu e-mail." },
              { type: "email", message: "O e-mail informado não é válido." },
            ]}
          >
            <Input placeholder="seuemail@dominio.com" />
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
            />
          </Form.Item>

          <Form.Item
            label={
              <span>
                <strong>CEP</strong> (Obrigatório)
              </span>
            }
            name="zipCode"
            rules={[{ required: true, message: "Por favor, informe seu CEP." }]}
          >
            <Input
              placeholder="00000-000"
              onChange={(e) => handleCepChange(e.target.value)}
            />
            {isError && <p style={{ color: "red" }}>Erro ao buscar CEP.</p>}
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} md={16}>
              <Form.Item label={<strong>Endereço</strong>} name="street">
                <Input placeholder="Rua, Avenida, etc." />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label={<strong>Número</strong>} name="number">
                <Input placeholder="123" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label={<strong>Complemento</strong>} name="complement">
            <Input placeholder="Apto, sala, etc." />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label={<strong>Bairro</strong>} name="neighborhood">
                <Input placeholder="Seu bairro" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label={<strong>Cidade</strong>} name="city">
                <Input placeholder="Sua cidade" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label={<strong>Estado</strong>} name="state">
            <Input placeholder="Seu estado" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{ background: "#000", borderColor: "#000" }}
              loading={pending}
              disabled={pending}
            >
              Cadastrar-se
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  );
}
