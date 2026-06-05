import React, { useState } from 'react';

// Main App component that renders the EventTypeForm
export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <EventTypeForm />
    </div>
  );
}

function EventTypeForm() {
  // State for form fields
  const [eventTypeCode, setEventTypeCode] = useState('');
  const [eventTypeName, setEventTypeName] = useState('');
  const [isMainEvent, setIsMainEvent] = useState(false);
  const [parentEventTypeId, setParentEventTypeId] = useState(''); // Use string for input, convert to number for payload
  const [isActive, setIsActive] = useState(true);

  // State for selected files
  const [selectedFiles, setSelectedFiles] = useState([]);

  // State for messages (success/error)
  const [responseMessage, setResponseMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // API endpoint
  const API_ENDPOINT = 'http://localhost:8080/diamond/eventType/saveEventType';

  // Handler for text input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    switch (name) {
      case 'eventTypeCode':
        setEventTypeCode(value);
        break;
      case 'eventTypeName':
        setEventTypeName(value);
        break;
      case 'isMainEvent':
        setIsMainEvent(checked);
        break;
      case 'parentEventTypeId':
        // Ensure only numbers are entered, or empty string
        setParentEventTypeId(value.replace(/[^0-9]/g, ''));
        break;
      case 'isActive':
        setIsActive(checked);
        break;
      default:
        break;
    }
  };

  // Handler for file input changes
  const handleFileChange = (e) => {
    // Convert FileList object to an array of File objects
    setSelectedFiles(Array.from(e.target.files));
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    setResponseMessage('');
    setError('');
    setIsLoading(true);

    // Create a new FormData object
    const formData = new FormData();

    // 1. Construct the 'eventTypeData' payload
    const eventTypeDataPayload = {
      txtEventTypeCode: eventTypeCode,
      txtEventTypeName: eventTypeName,
      blnIsMainEvent: isMainEvent,
      // Convert parentEventTypeId to number, or null if empty
      parentEventTypeId: parentEventTypeId ? parseInt(parentEventTypeId, 10) : null,
      blnIsActive: isActive,
      // Generate 'documents' array from selected files
      documents: selectedFiles.map((file) => ({
        originalName: file.name,
      })),
    };

    // Append the stringified JSON payload under the key 'eventTypeData'
    formData.append('eventTypeData', JSON.stringify(eventTypeDataPayload));

    // 2. Append each selected file under the key 'files'
    selectedFiles.forEach((file) => {
      formData.append('files', file);
    });

    try {
      // Make the fetch request
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        body: formData, // FormData automatically sets 'Content-Type' to 'multipart/form-data'
      });

      // Check if the request was successful
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          // Attempt to parse JSON error message from the response body
          const errorData = await response.json();
          if (errorData && errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData) {
            errorMessage = JSON.stringify(errorData);
          }
        } catch (jsonError) {
          // If response is not JSON, use the status text
          errorMessage = `${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      // Parse the JSON response from the API
      const result = await response.json();
      setResponseMessage('Event Type saved successfully! Response: ' + JSON.stringify(result, null, 2));

      // Clear the form fields after successful submission
      setEventTypeCode('');
      setEventTypeName('');
      setIsMainEvent(false);
      setParentEventTypeId('');
      setIsActive(true);
      setSelectedFiles([]);
      // Reset the file input visually
      e.target.elements.fileInput.value = '';
    } catch (err) {
      setError('Error saving event type: ' + err.message);
      console.error('API call error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create New Event Type</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Event Type Code */}
        <div>
          <label htmlFor="eventTypeCode" className="block text-sm font-medium text-gray-700 mb-1">
            Event Type Code:
          </label>
          <input
            type="text"
            id="eventTypeCode"
            name="eventTypeCode"
            value={eventTypeCode}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., ET-010"
          />
        </div>

        {/* Event Type Name */}
        <div>
          <label htmlFor="eventTypeName" className="block text-sm font-medium text-gray-700 mb-1">
            Event Type Name:
          </label>
          <input
            type="text"
            id="eventTypeName"
            name="eventTypeName"
            value={eventTypeName}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., Mehndi"
          />
        </div>

        {/* Is Main Event Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isMainEvent"
            name="isMainEvent"
            checked={isMainEvent}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="isMainEvent" className="ml-2 block text-sm text-gray-900">
            Is Main Event?
          </label>
        </div>

        {/* Parent Event Type ID */}
        <div>
          <label htmlFor="parentEventTypeId" className="block text-sm font-medium text-gray-700 mb-1">
            Parent Event Type ID:
          </label>
          <input
            type="number" // Use type="number" for numeric input
            id="parentEventTypeId"
            name="parentEventTypeId"
            value={parentEventTypeId}
            onChange={handleInputChange}
            min="1" // Optional: set a minimum value
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., 1 (optional)"
          />
        </div>

        {/* Is Active Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={isActive}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
            Is Active?
          </label>
        </div>

        {/* File Input */}
        <div>
          <label htmlFor="fileInput" className="block text-sm font-medium text-gray-700 mb-1">
            Attach Documents:
          </label>
          <input
            type="file"
            id="fileInput"
            name="fileInput" // Added name for e.target.elements.fileInput.value = '';
            multiple // Allows selecting multiple files
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100"
          />
          {selectedFiles.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              Selected files:
              <ul className="list-disc list-inside ml-2">
                {selectedFiles.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            'Save Event Type'
          )}
        </button>
      </form>

      {/* Response and Error Messages */}
      {responseMessage && (
        <div className="mt-6 p-3 rounded-md bg-green-100 text-green-800 text-sm break-all">
          <h3 className="font-semibold mb-1">Success!</h3>
          <pre className="whitespace-pre-wrap">{responseMessage}</pre>
        </div>
      )}
      {error && (
        <div className="mt-6 p-3 rounded-md bg-red-100 text-red-800 text-sm break-all">
          <h3 className="font-semibold mb-1">Error!</h3>
          <pre className="whitespace-pre-wrap">{error}</pre>
        </div>
      )}
    </div>
  );
}
