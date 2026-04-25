import { useState, useEffect, useCallback, useMemo } from 'react';
import Header from './components/Header';
import ApplicationInput from './components/ApplicationInput';
import ApplicationList from './components/ApplicationList';
import ActivityHeatmap from './components/ActivityHeatmap';
import Toast from './components/Toast';

const BASE_URL = 'http://localhost:8080/api/applications';

function App() {
  const [applications, setApplications] = useState([]);
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const filteredApplications = useMemo(() => {
    if (!selectedDate) return applications;
    return applications.filter(
      (app) => app.createdAt && app.createdAt.split('T')[0] === selectedDate
    );
  }, [applications, selectedDate]);

  const getApplications = useCallback(async () => {
    try {
      const res = await fetch(BASE_URL);
      const data = await res.json();
      setApplications(data);
    } catch (err) {
      setToast({ message: 'Failed to load applications', type: 'error' });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { getApplications(); }, [getApplications]);

  const saveApplication = async () => {
    if (!link.trim()) {
      setToast({ message: 'Please enter an application link!', type: 'error' });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: link.trim() }),
      });
      if (!res.ok) throw new Error();
      await res.json();
      setToast({ message: '✅ Application saved!', type: 'success' });
      setLink('');
      getApplications();
    } catch {
      setToast({ message: 'Failed to save application', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const deleteApplication = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setToast({ message: 'Application deleted', type: 'success' });
      setApplications((prev) => prev.filter((a) => a.id !== id));
    } catch {
      setToast({ message: 'Failed to delete application', type: 'error' });
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${BASE_URL}/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      setToast({ message: 'Status updated!', type: 'success' });
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
    } catch {
      setToast({ message: 'Failed to update status', type: 'error' });
    }
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="app-wrapper">
        <Header />
        <ApplicationInput
          link={link}
          setLink={setLink}
          onSave={saveApplication}
          saving={saving}
        />
        <ApplicationList
          applications={filteredApplications}
          loading={loading}
          refreshing={refreshing}
          selectedDate={selectedDate}
          onClearDate={() => setSelectedDate(null)}
          onRefresh={() => { setRefreshing(true); getApplications(); }}
          onDelete={deleteApplication}
          onUpdateStatus={updateStatus}
        />
        {!loading && applications.length > 0 && (
          <ActivityHeatmap
            applications={applications}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        )}
        <footer className="footer">
          Built with ❤️ using React + Vite + Spring Boot
        </footer>
      </div>
    </>
  );
}

export default App;
