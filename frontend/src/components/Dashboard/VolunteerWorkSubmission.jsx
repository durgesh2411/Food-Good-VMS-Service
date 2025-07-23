import React, { useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../../lib/constant';

const VolunteerWorkSubmission = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    numberOfHours: '',
  });
  const [workFile, setWorkFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setWorkFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Submitting volunteer work:", formData);
      console.log("File:", workFile);

      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('numberOfHours', formData.numberOfHours);
      if (workFile) {
        submitData.append('workFile', workFile);
      }

      console.log("FormData contents:");
      for (let [key, value] of submitData.entries()) {
        console.log(key, value);
      }

      const response = await axios.post(
        `${backendUrl}/volunteerWorks/`,
        submitData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log("Response:", response.data);

      if (response.data.success) {
        setSuccess(true);
        setFormData({ title: '', description: '', numberOfHours: '' });
        setWorkFile(null);
        // Reset file input
        document.getElementById('workFile').value = '';
      }
    } catch (error) {
      console.error('Error submitting volunteer work:', error);
      console.error('Error response:', error.response?.data);
      alert(`Failed to submit volunteer work: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 rounded-lg p-6 border border-green-200">
        <div className="text-center">
          <div className="text-green-600 text-4xl mb-4">Success</div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">Work Submitted Successfully!</h3>
          <p className="text-green-700 mb-4">
            Your volunteer work has been submitted for admin review. You'll receive credit once approved.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Submit Another Work
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Submit Volunteer Work</h3>
        <p className="text-sm text-gray-600 mt-1">
          Share your volunteer activities to get credit for your community contributions
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Work Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            placeholder="e.g., Community Garden Project"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Hours */}
        <div>
          <label htmlFor="numberOfHours" className="block text-sm font-medium text-gray-700 mb-2">
            Number of Hours *
          </label>
          <input
            type="number"
            id="numberOfHours"
            name="numberOfHours"
            value={formData.numberOfHours}
            onChange={handleInputChange}
            required
            min="1"
            placeholder="Enter hours worked"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Work Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={4}
            placeholder="Describe your volunteer work, impact, and any achievements..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* File Upload */}
        <div>
          <label htmlFor="workFile" className="block text-sm font-medium text-gray-700 mb-2">
            Work Report/Evidence *
          </label>
          <input
            type="file"
            id="workFile"
            name="workFile"
            onChange={handleFileChange}
            required
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Upload photos, reports, or documents as evidence of your work (PDF, DOC, JPG, PNG)
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting...
              </div>
            ) : (
              'Submit Work for Review'
            )}
          </button>
        </div>
      </form>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h4 className="font-medium text-blue-800 mb-2">Submission Guidelines</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Include detailed description of your work and impact</li>
          <li>• Upload clear evidence (photos, reports, certificates)</li>
          <li>• Admin will review and approve your submission</li>
          <li>• Approved hours will be added to your volunteer profile</li>
        </ul>
      </div>
    </div>
  );
};

export default VolunteerWorkSubmission;
