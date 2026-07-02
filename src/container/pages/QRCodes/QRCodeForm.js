import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Select, Spin, message, Divider } from 'antd';
import { PageHeader } from '../../../components/page-headers/page-headers';
import { Main, CardToolbox } from '../../styled';
import { Cards } from '../../../components/cards/frame/cards-frame';
import { Button } from '../../../components/buttons/buttons';
import {
  getQrCodeById,
  createQrCode,
  updateQrCode,
  getGeoCountries,
  getGeoCities,
} from '../../../services/qrCodeService';
import { getCampaigns } from '../../../services/campaignService';

const { Option } = Select;

function QRCodeForm() {
  const { qrId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(qrId);

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(false);

  // Load campaigns and countries on mount
  useEffect(() => {
    getCampaigns({ status: 'ACTIVE', size: 100 })
      .then((res) => setCampaigns(res?.data?.content ?? res?.data ?? []))
      .catch(() => { });
    getGeoCountries()
      .then((res) => setCountries(res?.data ?? res ?? []))
      .catch(() => { });
  }, []);

  // Load QR code for edit and pre-populate cities for existing country
  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const res = await getQrCodeById(qrId);
        const qr = res?.data ?? res;
        form.setFieldsValue(qr);
        // Pre-load cities for the saved country
        if (qr.placementCountry) {
          const countriesRes = await getGeoCountries();
          const all = countriesRes?.data ?? countriesRes ?? [];
          setCountries(all);
          const match = all.find((c) => c.name === qr.placementCountry);
          if (match?.isoCode) {
            const citiesRes = await getGeoCities(match.isoCode);
            const cityNames = (citiesRes?.data ?? citiesRes ?? []).map((c) => c.name);
            setCities(cityNames);
          }
        }
      } catch {
        message.error('Failed to load QR code');
        navigate('/qr-codes');
      } finally {
        setLoading(false);
      }
    })();
  }, [qrId, isEdit, form, navigate]);

  // When the user changes the country dropdown
  const handleCountryChange = async (countryName) => {
    form.setFieldValue('placementCity', undefined);
    setCities([]);
    if (!countryName) return;
    const country = countries.find((c) => c.name === countryName);
    if (!country?.isoCode) return;
    setCitiesLoading(true);
    try {
      const res = await getGeoCities(country.isoCode);
      const cityNames = (res?.data ?? res ?? []).map((c) => c.name);
      setCities(cityNames);
    } catch {
      message.error('Failed to load cities');
    } finally {
      setCitiesLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (isEdit) {
        await updateQrCode(qrId, values);
        message.success('QR code updated successfully');
      } else {
        await createQrCode(values);
        message.success('QR code created successfully');
      }
      navigate('/qr-codes');
    } catch (e) {
      const errMsg = e?.response?.data?.error?.message ?? 'Failed to save QR code';
      message.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <CardToolbox>
        <PageHeader
          ghost
          title={isEdit ? 'Edit QR Code' : 'New QR Code'}
          buttons={[
            <Button key="back" type="default" onClick={() => navigate('/qr-codes')}>
              Cancel
            </Button>,
          ]}
        />
      </CardToolbox>
      <Main>
        <Cards headless>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            style={{ maxWidth: 760 }}
          >
            <Divider orientation="left">QR Code Details</Divider>

            <Form.Item
              label="Campaign"
              name="campaignId"
              rules={[{ required: true, message: 'Campaign is required' }]}
            >
              <Select placeholder="Select campaign">
                {campaigns.map((c) => (
                  <Option key={c.campaignId} value={c.campaignId}>{c.name}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Placement Label"
              name="placementLabel"
              rules={[
                { required: true, message: 'Placement label is required' },
                { max: 100, message: 'Maximum 100 characters' },
              ]}
            >
              <Input placeholder="e.g. Leeds Central Masjid - Main Door" />
            </Form.Item>

            <Form.Item
              label="Country"
              name="placementCountry"
              rules={[{ required: true, message: 'Country is required' }]}
            >
              <Select
                placeholder="Select country"
                showSearch
                optionFilterProp="children"
                onChange={handleCountryChange}
                allowClear
              >
                {countries.map((c) => (
                  <Option key={c.isoCode} value={c.name}>{c.name}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="City"
              name="placementCity"
              rules={[{ required: true, message: 'City is required' }]}
            >
              <Select
                placeholder={cities.length === 0 ? 'Select a country first' : 'Select city'}
                showSearch
                optionFilterProp="children"
                loading={citiesLoading}
                disabled={!form.getFieldValue('placementCountry') && cities.length === 0}
                allowClear
              >
                {cities.map((c) => (
                  <Option key={c} value={c}>{c}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={submitting} size="large">
                {isEdit ? 'Save Changes' : 'Create QR Code'}
              </Button>
            </Form.Item>
          </Form>
        </Cards>
      </Main>
    </>
  );
}

export default QRCodeForm;
