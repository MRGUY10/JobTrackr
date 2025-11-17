import React, { useState, useEffect } from 'react';
import applicationService from '../services/applicationService';
import { Link } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';

const InterviewFormModal = ({ show, onClose, applicationId, onSuccess }) => {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [interviewData, setInterviewData] = useState({
    interview_date: '',
    interview_time: '',
    interview_location: '',
    interview_type: '',
    interviewer_name: '',
    interview_notes: ''
  });
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [modalApplications, setModalApplications] = useState([]);
  const [modalLoading, setModalLoading] = useState(true);

  useEffect(() => {
    const loadApps = async () => {
      try {
        setModalLoading(true);
        const response = await applicationService.getApplications();
        const appData = response.data || response || [];
        setModalApplications(appData);
        if (applicationId) {
          const app = appData.find(a => a.id === applicationId);
          setSelectedApplication(app);
          if (app) {
            setInterviewData({
              interview_date: app.interview_date ? new Date(app.interview_date).toISOString().split('T')[0] : '',
              interview_time: app.interview_time || '',
              interview_location: app.interview_location || '',
              interview_type: app.interview_type || '',
              interviewer_name: app.interviewer_name || '',
              interview_notes: app.interview_notes || ''
            });
          }
        }
      } catch (err) {
        setModalError('Failed to load applications: ' + (err.response?.data?.message || err.message));
      } finally {
        setModalLoading(false);
      }
    };
    if (show) loadApps();
  }, [show, applicationId]);

  const handleApplicationSelect = (appId) => {
    const app = modalApplications.find(a => a.id === parseInt(appId));
    setSelectedApplication(app);
    if (app) {
      setInterviewData({
        interview_date: app.interview_date ? new Date(app.interview_date).toISOString().split('T')[0] : '',
        interview_time: app.interview_time || '',
        interview_location: app.interview_location || '',
        interview_type: app.interview_type || '',
        interviewer_name: app.interviewer_name || '',
        interview_notes: app.interview_notes || ''
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInterviewData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedApplication) {
      setModalError('Please select an application');
      return;
    }
    try {
      setSaving(true);
      setModalError(null);
      await applicationService.updateApplication(selectedApplication.id, {
        ...selectedApplication,
        ...interviewData,
        status: 'Interview'
      });
      if (onSuccess) onSuccess();
      onClose();
      setSelectedApplication(null);
      setInterviewData({
        interview_date: '',
        interview_time: '',
        interview_location: '',
        interview_type: '',
        interviewer_name: '',
        interview_notes: ''
      });
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to schedule interview');
    } finally {
      setSaving(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">📅 Schedule Interview</h2>
          <button
            onClick={() => {
              onClose();
              setSelectedApplication(null);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {modalError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {modalError}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Application <span className="text-red-500">*</span>
            </label>
            {modalLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin h-6 w-6 border-2 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
                <p className="text-sm text-gray-600 mt-2">Loading applications...</p>
              </div>
            ) : modalApplications.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">No applications found. Please create an application first.</p>
                <Link
                  to="/applications"
                  className="inline-block mt-2 text-primary-600 hover:text-primary-700 font-medium"
                >
                  Go to Applications →
                </Link>
              </div>
            ) : (
              <select
                value={selectedApplication?.id || ''}
                onChange={(e) => handleApplicationSelect(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                required
                disabled={!!applicationId}
              >
                <option value="">Choose an application...</option>
                {modalApplications.map(app => (
                  <option key={app.id} value={app.id}>
                    {app.position} at {app.company} ({app.status})
                  </option>
                ))}
              </select>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Select the job application you want to schedule an interview for
            </p>
          </div>
          {selectedApplication && (
            <>
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Interview Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interview Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="interview_date"
                      value={interviewData.interview_date}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interview Time
                    </label>
                    <input
                      type="time"
                      name="interview_time"
                      value={interviewData.interview_time}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interview Type
                    </label>
                    <select
                      name="interview_type"
                      value={interviewData.interview_type}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    >
                      <option value="">Select type...</option>
                      <option value="video">📹 Video Call</option>
                      <option value="phone">📞 Phone Call</option>
                      <option value="in-person">🏢 In Person</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interviewer Name
                    </label>
                    <input
                      type="text"
                      name="interviewer_name"
                      value={interviewData.interviewer_name}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder="e.g., John Smith"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interview Location / Meeting Link
                    </label>
                    <input
                      type="text"
                      name="interview_location"
                      value={interviewData.interview_location}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder="e.g., Zoom link or office address"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interview Notes
                    </label>
                    <textarea
                      name="interview_notes"
                      value={interviewData.interview_notes}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                      placeholder="Preparation notes, questions to ask, etc..."
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setSelectedApplication(null);
                  }}
                  className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-6 py-2.5 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-medium rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Scheduling...' : 'Schedule Interview'}
                </button>
              </div>
            </>
          )}
          {!selectedApplication && (
            <div className="text-center py-8 text-gray-500">
              👆 Please select an application to continue
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default InterviewFormModal;
