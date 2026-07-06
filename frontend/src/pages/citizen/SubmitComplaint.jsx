import React, { useState, useRef } from 'react';
import CitizenNavbar from '../../components/layout/CitizenNavbar';
import { submissionService } from '../../services/submissionService';
import { useNavigate } from 'react-router-dom';
import { Mic, Square, Camera, X, Loader2 } from 'lucide-react';

const SubmitComplaint = () => {
  const [text, setText] = useState('');
  const [ward, setWard] = useState('Ward 1');
  const [source, setSource] = useState('Web');
  const [inputType, setInputType] = useState('text');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // --- new: media state ---
  const [mediaUrl, setMediaUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState(null);
  const [processing, setProcessing] = useState(false); // transcribing / OCR-ing

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const wards = Array.from({ length: 10 }, (_, i) => `Ward ${i + 1}`);

  // --- new: reset media state when switching input type ---
  const handleTypeChange = (type) => {
    setInputType(type);
    setMediaUrl(null);
    setAudioPreviewUrl(null);
    setPhotoPreviewUrl(null);
  };

  // --- new: voice recording handlers ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioPreviewUrl(URL.createObjectURL(audioBlob));
        stream.getTracks().forEach((track) => track.stop());
        await uploadVoice(audioBlob);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      alert('Microphone access denied or unavailable.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const uploadVoice = async (audioBlob) => {
    setProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.webm');
      const response = await submissionService.uploadVoice(formData);
      setMediaUrl(response.data.media_url);
      if (response.data.transcript) {
        setText(response.data.transcript);
      }
    } catch (err) {
      alert('Failed to process voice recording. You can still type your concern below.');
    } finally {
      setProcessing(false);
    }
  };

  const resetVoice = () => {
    setAudioPreviewUrl(null);
    setMediaUrl(null);
  };

  // --- new: photo upload handler ---
  const handlePhotoSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhotoPreviewUrl(URL.createObjectURL(file));
    setProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await submissionService.uploadPhoto(formData);
      setMediaUrl(response.data.media_url);
      if (response.data.ocr_text) {
        setText(response.data.ocr_text);
      }
    } catch (err) {
      alert('Failed to process photo. You can still type your concern below.');
    } finally {
      setProcessing(false);
    }
  };

  const resetPhoto = () => {
    setPhotoPreviewUrl(null);
    setMediaUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submissionService.create({
        text_content: text,
        ward,
        source,
        input_type: inputType,
        media_url: mediaUrl,
      });
      setSuccess(true);
      setTimeout(() => navigate('/citizen/my-complaints'), 2000);
    } catch (err) {
      alert('Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      <CitizenNavbar />
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h1 className="font-fraunces text-3xl font-bold text-ink-navy mb-2">Submit Suggestion</h1>
          <p className="text-gray-500 mb-8">Help your MP understand what your constituency needs most.</p>

          {success ? (
            <div className="bg-moss bg-opacity-10 text-moss p-6 rounded-lg text-center">
              <h3 className="text-xl font-bold mb-2">Success!</h3>
              <p>Your submission has been received and is being analyzed by our AI.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Input Type</label>
                <div className="flex gap-4">
                  {['text', 'voice', 'photo'].map(type => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="inputType" 
                        value={type} 
                        checked={inputType === type}
                        onChange={() => handleTypeChange(type)}
                        className="text-marigold focus:ring-marigold"
                      />
                      <span className="capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* --- new: voice recording UI --- */}
              {inputType === 'voice' && (
                <div className="border-2 border-dashed border-marigold border-opacity-30 rounded-lg p-6 text-center">
                  {!audioPreviewUrl ? (
                    <button
                      type="button"
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`inline-flex items-center gap-2 px-6 py-3 rounded font-bold text-white transition-all ${isRecording ? 'bg-stamp-red animate-pulse' : 'bg-marigold hover:bg-opacity-90'}`}
                    >
                      {isRecording ? <Square size={18} /> : <Mic size={18} />}
                      {isRecording ? 'Stop Recording' : 'Start Recording'}
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <audio controls src={audioPreviewUrl} className="mx-auto" />
                      <div>
                        <button type="button" onClick={resetVoice} className="text-sm text-gray-500 hover:text-stamp-red inline-flex items-center gap-1">
                          <X size={14} /> Re-record
                        </button>
                      </div>
                    </div>
                  )}
                  {processing && (
                    <p className="text-sm text-gray-500 mt-4 flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin" /> Transcribing your recording...
                    </p>
                  )}
                </div>
              )}

              {/* --- new: photo upload UI --- */}
              {inputType === 'photo' && (
                <div className="border-2 border-dashed border-marigold border-opacity-30 rounded-lg p-6 text-center">
                  {!photoPreviewUrl ? (
                    <label className="inline-flex items-center gap-2 px-6 py-3 rounded font-bold text-white bg-marigold hover:bg-opacity-90 transition-all cursor-pointer">
                      <Camera size={18} />
                      Upload / Capture Photo
                      <input type="file" accept="image/*" capture="environment" onChange={handlePhotoSelect} className="hidden" />
                    </label>
                  ) : (
                    <div className="space-y-4">
                      <img src={photoPreviewUrl} alt="Complaint evidence" className="max-h-56 mx-auto rounded border border-gray-200" />
                      <div>
                        <button type="button" onClick={resetPhoto} className="text-sm text-gray-500 hover:text-stamp-red inline-flex items-center gap-1">
                          <X size={14} /> Choose different photo
                        </button>
                      </div>
                    </div>
                  )}
                  {processing && (
                    <p className="text-sm text-gray-500 mt-4 flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin" /> Extracting text from photo...
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {inputType === 'text' ? 'Your Concern / Suggestion' : 'Review & Edit Text (auto-filled)'}
                </label>
                <textarea 
                  className="w-full px-4 py-3 border border-gray-300 rounded h-40 focus:ring-marigold focus:border-marigold"
                  placeholder="Describe the issue in detail..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Ward</label>
                  <select 
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-marigold focus:border-marigold"
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                  >
                    {wards.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
                  <select 
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-marigold focus:border-marigold"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                  >
                    <option value="Web">Web Portal</option>
                    <option value="Public Meeting">Public Meeting</option>
                    <option value="Letter">Official Letter</option>
                    <option value="Social Media">Social Media</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading || processing}
                className="w-full bg-marigold text-white py-4 rounded font-bold text-lg hover:bg-opacity-90 transition-all disabled:opacity-50"
              >
                {loading ? 'Submitting...' : '✅ Submit Complaint'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmitComplaint;