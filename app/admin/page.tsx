"use client";

import { Card, Col, Row, Statistic, Typography } from "antd";
import { Users, BookOpen, ShoppingCart, DollarSign } from "lucide-react";
import AdminGuard from "../cart/AdminGuard";

const { Title } = Typography;

export default function AdminDashboardPage() {
  return (
    <AdminGuard>
      <div style={{ padding: "24px" }}>
        <Title level={2} style={{ marginTop: 0, color: "#1A2E35" }}>
          Dashboard
        </Title>
        <p style={{ marginBottom: "24px", color: "gray" }}>
          Welcome to the blendartbook Admin Panel. Here is an overview of your store.
        </p>

        {/* Top Analytics Cards */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable style={{ borderRadius: "12px", border: "1px solid #f0f0f0" }}>
              <Statistic
                title="Total Users"
                value={124} // Dummy data for now
                prefix={<Users size={20} style={{ marginRight: '8px', color: '#1890ff' }} />}
              />
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable style={{ borderRadius: "12px", border: "1px solid #f0f0f0" }}>
              <Statistic
                title="Total Products"
                value={8430} // Dummy data for now
                prefix={<BookOpen size={20} style={{ marginRight: '8px', color: '#52c41a' }} />}
              />
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable style={{ borderRadius: "12px", border: "1px solid #f0f0f0" }}>
              <Statistic
                title="Total Orders"
                value={45} // Dummy data for now
                prefix={<ShoppingCart size={20} style={{ marginRight: '8px', color: '#faad14' }} />}
              />
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable style={{ borderRadius: "12px", border: "1px solid #f0f0f0" }}>
              <Statistic
                title="Total Revenue"
                value={3420.50} // Dummy data for now
                precision={2}
                prefix={<DollarSign size={20} style={{ marginRight: '8px', color: '#f5222d' }} />}
                suffix="€"
              />
            </Card>
          </Col>
        </Row>

       {/* Bottom Section: Tables / Charts Placeholders */}
        <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
          <Col xs={24} lg={12}>
            <Card 
              title="Recent Orders" 
              bordered={false}
              style={{ borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
            >
              <div style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center", color: "gray" }}>
                Order table will appear here...
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card 
              title="Top Selling Books" 
              bordered={false}
              style={{ borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
            >
              <div style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center", color: "gray" }}>
                Bestsellers list will appear here...
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </AdminGuard>
  );
}
