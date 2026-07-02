import React from 'react';
import { Row, Col } from 'antd';
import CountUp from 'react-countup';
import UilMoneyWithdraw from '@iconscout/react-unicons/icons/uil-money-withdraw';
import UilUsersAlt from '@iconscout/react-unicons/icons/uil-users-alt';
import UilCommentAlt from '@iconscout/react-unicons/icons/uil-comment-alt';
import UilQrcodeScan from '@iconscout/react-unicons/icons/uil-qrcode-scan';
import UilLayerGroup from '@iconscout/react-unicons/icons/uil-layer-group';

const ACCENT = {
  revenue: '#3da7dc',
  donors: '#01B81A',
  conversations: '#00AAFF',
  qr: '#FA8B0C',
  campaigns: '#1a6b9c',
};

function StatCard({ accent, icon: Icon, label, value, prefix, decimals }) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 10,
        boxShadow: '0 5px 20px rgba(146,153,184,0.12)',
        borderLeft: `4px solid ${accent}`,
        padding: '20px 24px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 10,
          background: `${accent}18`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={22} color={accent} />
      </div>
      <div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: '#0A0A0A',
            lineHeight: 1.2,
          }}
        >
          {prefix && <span style={{ fontSize: 16, fontWeight: 500, color: '#747474', marginRight: 1 }}>{prefix}</span>}
          <CountUp
            start={0}
            end={value ?? 0}
            delay={0.3}
            duration={1.8}
            decimals={decimals ?? 0}
            separator=","
          />
        </div>
        <div style={{ fontSize: 13, color: '#747474', marginTop: 2, fontWeight: 500 }}>{label}</div>
      </div>
    </div>
  );
}

function SummaryCards({ summary, totalCampaigns }) {
  const s = summary ?? {};
  return (
    <div style={{ marginBottom: 24 }}>
      {/* Row 1: Revenue, Donors, Conversations */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8}>
          <StatCard
            accent={ACCENT.revenue}
            icon={UilMoneyWithdraw}
            label="Total Amount Raised"
            value={s.totalRevenue}
            prefix="£"
            decimals={2}
          />
        </Col>
        <Col xs={24} sm={8}>
          <StatCard
            accent={ACCENT.donors}
            icon={UilUsersAlt}
            label="Donors Engaged"
            value={s.totalDonors}
          />
        </Col>
        <Col xs={24} sm={8}>
          <StatCard
            accent={ACCENT.conversations}
            icon={UilCommentAlt}
            label="WhatsApp Conversations"
            value={s.totalConversations}
          />
        </Col>
      </Row>

      {/* Row 2: QR Scans, Campaigns */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <StatCard
            accent={ACCENT.qr}
            icon={UilQrcodeScan}
            label="QR Code Scans"
            value={s.totalQrScans}
          />
        </Col>
        <Col xs={24} sm={12}>
          <StatCard
            accent={ACCENT.campaigns}
            icon={UilLayerGroup}
            label="Active Campaigns"
            value={totalCampaigns}
          />
        </Col>
      </Row>
    </div>
  );
}

export default SummaryCards;
