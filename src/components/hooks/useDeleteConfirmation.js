// hooks/useDeleteConfirmation.js
import { Modal, message } from 'antd';
import { useState } from 'react';

export function useDeleteConfirmation(fetchDataAfterDelete) {
  const [loading, setLoading] = useState(false);

  const showDeleteConfirm = ({ name, id, endpoint }) => {
    const accessToken = localStorage.getItem('access_token_admin');
    Modal.confirm({
      title: `Do you want to delete ${name}?`,
      content: 'This action cannot be undone.',
      centered: true,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        setLoading(true);
        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
            body: JSON.stringify({ id }),
          });
          const data = await response.json();

          console.log(data);

          if (data.code === 200 && data.status === 'OK') {
            message.success('Deleted successfully');
            fetchDataAfterDelete?.(); // Optional callback to refresh
          } else {
            message.error(data.message || 'Deletion failed');
          }
        } catch (err) {
          console.error('Delete error:', err);
          message.error('Something went wrong while deleting.');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return { showDeleteConfirm, loading };
}
