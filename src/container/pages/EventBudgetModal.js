import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Form, Input, Button, DatePicker, Select, message, Spin, Row, Col } from 'antd';
import moment from 'moment';

const { Option } = Select;

function EventBudgetModal({ visible, onCancel, eventMasterId, onBudgetSaved }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [budgetData, setBudgetData] = useState(null); // Stores fetched budget data
  const [profit, setProfit] = useState(0);

  // Function to fetch existing budget data for the given eventMasterId
  const fetchBudget = useCallback(async () => {
    if (!eventMasterId) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/diamond/eventBudget/getAllData', {
        method: 'POST', // API expects POST with empty body as GET
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const result = await response.json();

      if (result.code === 200 && result.status === 'OK' && Array.isArray(result.result)) {
        const foundBudget = result.result.find((budget) => budget.serEventMasterId === eventMasterId);
        setBudgetData(foundBudget);

        if (foundBudget) {
          // Set form fields with fetched data
          form.setFieldsValue({
            numTotalBudget: foundBudget.numTotalBudget,
            numTotalExpense: foundBudget.numTotalExpense,
            txtPaymentType: foundBudget.txtPaymentType,
            txtPaymentStatus: foundBudget.txtPaymentStatus,
            dteDealDate: foundBudget.dteDealDate ? moment(foundBudget.dteDealDate, 'DD/MM/YYYY') : null,
            txtDealClosedBy: foundBudget.txtDealClosedBy,
          });
          // Calculate initial profit
          setProfit(foundBudget.numTotalBudget - foundBudget.numTotalExpense);
        } else {
          form.resetFields(); // Reset if no budget found for this event
          setProfit(0);
        }
      } else {
        message.error(`Failed to fetch budget data: ${result.message}`);
        form.resetFields();
        setProfit(0);
      }
    } catch (error) {
      console.error('Error fetching budget data:', error);
      message.error('Network error while fetching budget data.');
      form.resetFields();
      setProfit(0);
    } finally {
      setLoading(false);
    }
  }, [eventMasterId, form]);

  // Effect to fetch budget data when modal becomes visible or eventMasterId changes
  useEffect(() => {
    if (visible && eventMasterId) {
      fetchBudget();
    } else if (!visible) {
      // Reset form and state when modal closes
      form.resetFields();
      setBudgetData(null);
      setProfit(0);
    }
  }, [visible, eventMasterId, fetchBudget, form]);

  // Handle form value changes for real-time profit calculation
  const handleValuesChange = useCallback((changedValues, allValues) => {
    if ('numTotalBudget' in changedValues || 'numTotalExpense' in changedValues) {
      const budget = parseFloat(allValues.numTotalBudget || 0);
      const expense = parseFloat(allValues.numTotalExpense || 0);
      setProfit(budget - expense);
    }
  }, []);

  // Handle form submission (save or update budget)
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        serEventMasterId: eventMasterId,
        serEventBudgetId: budgetData?.serEventBudgetId || 0, // Include ID if updating
        numTotalBudget: parseFloat(values.numTotalBudget || 0),
        numTotalExpense: parseFloat(values.numTotalExpense || 0),
        numTotalProfit: profit, // Use the calculated profit
        txtPaymentType: values.txtPaymentType || null,
        txtPaymentStatus: values.txtPaymentStatus || null,
        dteDealDate: values.dteDealDate ? values.dteDealDate.format('YYYY-MM-DD') : null,
        txtDealClosedBy: values.txtDealClosedBy || null,
      };

      console.log('Budget Save Payload:', payload);

      const response = await fetch('http://localhost:8080/diamond/eventBudget/saveOrUpdate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (result.code === 200 && result.status === 'OK') {
        message.success(`Event budget saved successfully!`);
        onBudgetSaved(); // Notify parent to refresh grid
        onCancel(); // Close modal
      } else {
        message.error(`Failed to save budget: ${result.message}`);
      }
    } catch (error) {
      console.error('Error saving budget:', error);
      message.error('Network error while saving budget.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Set Event Budget" visible={visible} onCancel={onCancel} footer={null} width={600}>
      <Spin spinning={loading} tip="Loading/Saving Budget...">
        <Form form={form} layout="vertical" onFinish={onFinish} onValuesChange={handleValuesChange}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="numTotalBudget"
                label="Total Budget"
                rules={[{ required: true, message: 'Please enter total budget!' }]}
              >
                <Input type="number" placeholder="e.g., 500000" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="numTotalExpense"
                label="Total Expense"
                rules={[{ required: true, message: 'Please enter total expense!' }]}
              >
                <Input type="number" placeholder="e.g., 420000" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Total Profit">
            <Input value={profit} readOnly /> {/* Display calculated profit */}
          </Form.Item>

          <Form.Item
            name="txtPaymentType"
            label="Payment Type"
            rules={[{ required: true, message: 'Please select payment type!' }]}
          >
            <Select placeholder="Select payment type">
              <Option value="Cash">Cash</Option>
              <Option value="Bank Transfer">Bank Transfer</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="txtPaymentStatus"
            label="Payment Status"
            rules={[{ required: true, message: 'Please select payment status!' }]}
          >
            <Select placeholder="Select payment status">
              <Option value="Paid">Paid</Option>
              <Option value="Pending">Pending</Option>
              <Option value="Initiated">Initiated</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="dteDealDate"
            label="Deal Date"
            rules={[{ required: true, message: 'Please select deal date!' }]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              style={{ width: '100%' }}
              // Disable if date already exists and is not null/empty
              disabled={budgetData?.dteDealDate && budgetData.dteDealDate !== null && budgetData.dteDealDate !== ''}
            />
          </Form.Item>

          <Form.Item
            name="txtDealClosedBy"
            label="Deal Closed By"
            rules={[{ required: true, message: 'Please enter who closed the deal!' }]}
          >
            <Input placeholder="e.g., Ahsan Raza" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Set Budget
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={onCancel}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}

export default EventBudgetModal;
