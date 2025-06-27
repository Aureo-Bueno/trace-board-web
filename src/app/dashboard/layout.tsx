"use client";

import { useContext, useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Typography,
  Grid,
  Dropdown,
  Button,
  ConfigProvider,
  Avatar,
  Space,
  Flex,
  MenuProps,
} from "antd";
import {
  CalendarOutlined,
  FileTextOutlined,
  UserOutlined,
  MenuOutlined,
  LogoutOutlined,
  DownOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore, UserState } from "@/store/useAuthStore";
import { useLogout } from "@/services/mutations/useLogout";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const SIDER_BACKGROUND_COLOR = "#f8f6f2";
const BORDER_COLOR = "#eaeaea";
const MENU_ITEM_HOVER_BG = "#e9e8e4";
const MENU_ITEM_SELECTED_BG = "black";
const MENU_ITEM_SELECTED_COLOR = "white";
const HEADER_HEIGHT = 100;

const MENU_ITEMS = [
  {
    key: "/dashboard/admin/agendamentos",
    icon: <CalendarOutlined />,
    label: "Agendamentos",
  },
  {
    key: "/dashboard/admin/clientes",
    icon: <UserOutlined />,
    label: "Clientes",
  },
  { key: "/dashboard/admin/logs", icon: <FileTextOutlined />, label: "Logs" },
];

const MENU_ITEMS_USER = [
  {
    key: "/dashboard/cliente/agendamentos",
    icon: <CalendarOutlined />,
    label: "Agendamentos",
  },
  {
    key: "/dashboard/cliente/logs",
    icon: <FileTextOutlined />,
    label: "Logs",
  },
  {
    key: "/dashboard/cliente/minha-conta",
    icon: <UserOutlined />,
    label: "Minha Conta",
  },
];

const USER_MENU_ITEMS = [
  { key: "logout", icon: <LogoutOutlined />, label: "Sair" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user: UserState | undefined = useAuthStore(
    (state: { user: UserState | undefined }) => state.user
  );
  const logout = useAuthStore((state: { logout: () => void }) => state.logout);
  const { isPending: isPendingLogout, logout: logoutMutation } = useLogout();
  const { md } = Grid.useBreakpoint();
  const isMobile = !md;

  const pathname = usePathname();
  const [selectedKey, setSelectedKey] = useState(pathname);

  useEffect(() => {
    if (user === undefined) return;

    if (user === null && pathname !== "/") {
      router.replace("/");
      return;
    }
    if (user?.isAdmin && pathname !== selectedKey) {
      router.replace(selectedKey);
      setSelectedKey(selectedKey);
      return;
    }
  }, [user, pathname]);

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    setSelectedKey(e.key);
    router.push(e.key);
  };

  const handleLogout = async () => {
    await logoutMutation();
    logout();
    router.push("/");
  };

  if (isPendingLogout) {
    return <Text>Carregando...</Text>;
  }

  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            siderBg: SIDER_BACKGROUND_COLOR,
          },
          Menu: {
            itemBg: SIDER_BACKGROUND_COLOR,
            itemHoverBg: MENU_ITEM_HOVER_BG,
            itemSelectedBg: MENU_ITEM_SELECTED_BG,
            itemSelectedColor: MENU_ITEM_SELECTED_COLOR,
          },
        },
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        {isMobile ? (
          <Header
            style={{
              padding: "0 16px",
              background: SIDER_BACKGROUND_COLOR,
              borderBottom: `1px solid ${BORDER_COLOR}`,
              position: "sticky",
              top: 0,
              zIndex: 10,
            }}
          >
            <Flex
              justify="space-between"
              align="center"
              style={{ height: "100%" }}
            >
              <Image src="/next.svg" alt="Logo" width={40} height={40} />
              <Dropdown
                menu={{
                  items: user?.isAdmin ? MENU_ITEMS : MENU_ITEMS_USER,
                  selectedKeys: [selectedKey],
                  onClick: handleMenuClick,
                }}
                trigger={["click"]}
              >
                <Button type="text" icon={<MenuOutlined />} />
              </Dropdown>
            </Flex>
          </Header>
        ) : (
          <Sider
            width={240}
            style={{ borderRight: `1px solid ${BORDER_COLOR}` }}
          >
            <Flex
              vertical
              justify="space-between"
              style={{ height: "100vh", position: "sticky", top: 0 }}
            >
              <div>
                <Flex
                  justify="center"
                  align="center"
                  style={{
                    height: HEADER_HEIGHT,
                    borderBottom: `1px solid ${BORDER_COLOR}`,
                  }}
                >
                  <Image src="/next.svg" alt="Logo" width={90} height={40} />
                </Flex>
                <Menu
                  mode="inline"
                  selectedKeys={[selectedKey]}
                  items={user?.isAdmin ? MENU_ITEMS : MENU_ITEMS_USER}
                  onClick={handleMenuClick}
                  style={{ borderRight: 0 }}
                />
              </div>
              <div
                style={{
                  padding: "16px",
                  borderTop: `1px solid ${BORDER_COLOR}`,
                }}
              >
                <Flex justify="space-between" align="center">
                  <Space>
                    <Avatar
                      style={{ backgroundColor: "#1890ff" }}
                      icon={<UserOutlined />}
                    />
                    <Flex vertical>
                      <Text strong>
                        {user?.user?.name} {user?.user?.lastName}
                      </Text>
                      <Text type="secondary" style={{ fontSize: "0.8rem" }}>
                        {user?.isAdmin ? "Admin" : "Cliente"}
                      </Text>
                    </Flex>
                  </Space>
                  <Dropdown
                    menu={{ items: USER_MENU_ITEMS, onClick: handleLogout }}
                    placement="topRight"
                    trigger={["click"]}
                  >
                    <Button type="text" icon={<DownOutlined />} />
                  </Dropdown>
                </Flex>
              </div>
            </Flex>
          </Sider>
        )}
        <Layout>
          <Content style={{ background: "#fff" }}>{children}</Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
