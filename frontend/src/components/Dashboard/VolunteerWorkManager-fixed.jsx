import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../../lib/constant';

const VolunteerWorkManager = () => {
  const [pendingWorks, setPendingWorks] = useState([]);
  const [allWorks, setAllWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("Fetching volunteer work data...");

      const [pendingResponse, allResponse] = await Promise.all([
        axios.get(`${backendUrl}/volunteerWorks/admin/volunteerPendingWorks`, {
          withCredentials: true,
        }),
        axios.get(`${backendUrl}/volunteerWorks/admin/`, {
          withCredentials: true,
        })
      ]);

      console.log("Pending response:", pendingResponse.data);
      console.log("All response:", allResponse.data);

      if (pendingResponse.data.success) {
        setPendingWorks(pendingResponse.data.data || []);
      }
      if (allResponse.data.success) {
        setAllWorks(allResponse.data.data.volunteerWorks || []);
      }
    } catch (error) {
      console.error('Error fetching volunteer work data:', error);
      console.error('Error response:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const approveWork = async (workId) => {
    try {
      const response = await axios.patch(
        `${backendUrl}/volunteerWorks/admin/${workId}`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        // Refresh data
        fetchData();
        alert('Work approved successfully!');
      }
    } catch (error) {
      console.error('Error approving work:', error);
      alert('Failed to approve work');
    }
  };

  const rejectWork = async (workId) => {
    const reason = prompt('Enter rejection reason (optional):');

    try {
      const response = await axios.patch(
        `${backendUrl}/volunteerWorks/admin/${workId}/reject`,
        { reason: reason || '' },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Refresh data
        fetchData();
        alert('Work rejected successfully!');
      }
    } catch (error) {
      console.error('Error rejecting work:', error);
      alert('Failed to reject work');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-800">Volunteer Work Management</h3>
        <p className="text-sm text-gray-600 mt-1">Review, approve, or reject volunteer work submissions</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          <button
            onClick={() => setActiveTab('pending')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'pending'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Pending ({pendingWorks.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'all'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            All Submissions ({allWorks.length})
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'pending' && (
          <div className="space-y-4">
            {pendingWorks.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 text-lg mb-2">✅</div>
                <p className="text-gray-500">No pending volunteer work submissions</p>
              </div>
            ) : (
              pendingWorks.map((work) => (
                <div key={work._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-lg">{work.title}</h4>
                      <p className="text-gray-600 mt-1 text-sm">{work.description}</p>
                      <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                        <span>⏱️ {work.numberOfHours} hours</span>
                        <span>📅 {formatDate(work.createdAt)}</span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <a
                        href={work.workFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        📄 View Report
                      </a>
                      <button
                        onClick={() => rejectWork(work._id)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                      >
                        ❌ Reject
                      </button>
                      <button
                        onClick={() => approveWork(work._id)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                      >
                        ✅ Approve
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'all' && (
          <div className="space-y-4">
            {allWorks.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 text-lg mb-2">📋</div>
                <p className="text-gray-500">No volunteer work submissions yet</p>
              </div>
            ) : (
              allWorks.map((work) => (
                <div key={work._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-lg">{work.title}</h4>
                      <p className="text-gray-600 mt-1 text-sm">{work.description}</p>
                      {work.rejectionReason && work.status === 'rejected' && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                          <p className="text-sm text-red-700">
                            <strong>Rejection Reason:</strong> {work.rejectionReason}
                          </p>
                        </div>
                      )}
                      <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                        <span>⏱️ {work.numberOfHours} hours</span>
                        <span>📅 {formatDate(work.createdAt)}</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          work.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : work.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {work.status === 'approved' ? '✅ Approved' : work.status === 'rejected' ? '❌ Rejected' : '⏳ Pending'}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <a
                        href={work.workFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        📄 View Report
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-gray-800">{allWorks.length}</div>
            <div className="text-xs text-gray-500">Total Submissions</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-green-600">
              {allWorks.filter(w => w.status === 'approved').length}
            </div>
            <div className="text-xs text-gray-500">Approved</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-yellow-600">{pendingWorks.length}</div>
            <div className="text-xs text-gray-500">Pending Review</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-red-600">
              {allWorks.filter(w => w.status === 'rejected').length}
            </div>
            <div className="text-xs text-gray-500">Rejected</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerWorkManager;
