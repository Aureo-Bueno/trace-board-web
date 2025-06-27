"use client";

import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Flex,
  Space,
  message,
} from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore, UserState } from "@/store/useAuthStore";
import React from "react";

const { Title, Text, Link } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const user: UserState | undefined = useAuthStore(
    (state: { user: UserState | undefined }) => state.user
  );
  const login = useAuthStore(
    (state: { login: (email: string, password: string) => Promise<boolean> }) =>
      state.login
  );
  const [loading, setLoading] = React.useState(false);
  const [loginSuccess, setLoginSuccess] = React.useState(false);

  React.useEffect(() => {
    if (loginSuccess && user) {
      if (user.isAdmin) {
        router.push("/dashboard/admin/agendamentos");
      } else {
        router.push("/dashboard/cliente/agendamentos");
      }
    }
  }, [loginSuccess, user, router]);

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      setLoading(true);
      const { email, password } = values;
      const response = await login(email, password);
      if (response) {
        setLoginSuccess(true);
      } else {
        message.error("Falha no login. Verifique suas credenciais.");
      }
    } catch (error) {
      message.error("Erro ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex vertical align="center" gap="large">
      <Space direction="vertical" align="center" size="large">
        <Image src="/next.svg" alt="Logo da Empresa" width={80} height={40} />
        <Title level={3}>Entre na sua conta</Title>
      </Space>

      <Card style={{ width: 380 }}>
        <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            label="E-mail"
            name="email"
            rules={[
              { required: true, message: "Por favor, informe seu e-mail." },
              { type: "email", message: "O e-mail informado não é válido." },
            ]}
          >
            <Input placeholder="ex: seuemail@dominio.com" />
          </Form.Item>

          <Form.Item
            label="Senha de acesso"
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

          <Form.Item style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{ background: "black", borderColor: "black" }}
              loading={loading}
            >
              Acessar conta
            </Button>
          </Form.Item>

          <Flex justify="space-between" align="center">
            <Text type="secondary">Não tem uma conta?</Text>
            <Link href="/cadastro" strong>
              Cadastre-se
            </Link>
          </Flex>
        </Form>
      </Card>
    </Flex>
  );
}
