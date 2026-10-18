import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ExternalLink,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';

export function DocsTab() {
  const { showSuccess, showError } = useToast();

  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [maskedKey, setMaskedKey] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load current API key status
  const loadKeyStatus = async () => {
    setLoading(true);
    try {
      const res = await api.getGeminiApiKey();
      setIsConfigured(Boolean(res.configured));
      if (res.maskedKey) {
        setMaskedKey(res.maskedKey);
      }
      if (res.key) {
        setApiKey(res.key);
      }
    } catch (err) {
      console.error('Failed to load Gemini API key status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKeyStatus();
  }, []);

  // Handle Save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      showError('Please enter your Gemini API key before saving.');
      return;
    }

    setSaving(true);
    try {
      const res = await api.saveGeminiApiKey(apiKey.trim());
      if (res.error) {
        showError(res.error);
      } else {
        showSuccess('Gemini API Key saved and activated successfully.');
        setIsConfigured(true);
        await loadKeyStatus();
      }
    } catch {
      showError('Failed to save API key. Please check your network connection.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* API Key Input & Save Card */}
      <div className="bg-white border border-[#dadce0] rounded-xl p-5 sm:p-7 shadow-xs space-y-5">
        {/* Responsive Header: Flex col on mobile, flex row on sm+ */}
        <div className="border-b border-[#dadce0] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="w-8 h-8 rounded-lg bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center shrink-0 shadow-2xs">
              <KeyRound className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-[#202124] tracking-tight whitespace-nowrap">
              Gemini API Key
            </h3>

            {loading ? (
              <span className="text-[11px] text-[#5f6368] flex items-center gap-1 ml-1">
                <RefreshCw className="w-3 h-3 animate-spin" />
              </span>
            ) : isConfigured ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#137333] bg-[#e6f4ea] px-2.5 py-0.5 rounded-full border border-[#ceead6] ml-1">
                <CheckCircle2 className="w-3 h-3 text-[#1e8e3e]" />
                <span>Active</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#b06000] bg-[#fef7e0] px-2.5 py-0.5 rounded-full border border-[#feefc3] ml-1">
                <AlertCircle className="w-3 h-3 text-[#b06000]" />
                <span>Not Configured</span>
              </span>
            )}
          </div>

          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-[#1a73e8] hover:text-[#1557b0] hover:underline inline-flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>Get Key from Google AI Studio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#5f6368] mb-1.5">
              Enter your Gemini API Key
            </label>

            <div className="relative">
              <KeyRound className="w-4 h-4 text-[#5f6368] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showKey ? 'text' : 'password'}
                required
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={maskedKey || 'Paste your Gemini API key here (e.g., AIzaSy... or AQ.Ab8...)'}
                className="w-full pl-10 pr-24 py-2.5 sm:py-3 bg-white border border-[#dadce0] rounded-lg text-xs sm:text-sm font-mono text-[#202124] focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] transition-colors shadow-2xs"
              />

              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {apiKey && (
                  <button
                    type="button"
                    onClick={() => setApiKey('')}
                    className="p-1.5 text-xs text-[#5f6368] hover:text-[#202124] rounded hover:bg-[#f1f3f4]"
                    title="Clear input"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="p-1.5 text-[#5f6368] hover:text-[#202124] rounded hover:bg-[#f1f3f4] cursor-pointer"
                  title={showKey ? 'Hide key' : 'Show key'}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <p className="text-[11px] text-[#5f6368] mt-1.5 flex items-center gap-1 leading-normal">
              <ShieldCheck className="w-3.5 h-3.5 text-[#137333] shrink-0" />
              <span>Your API key is securely stored server-side and never exposed to public website visitors.</span>
            </p>
          </div>

          {/* Action Button: Save Key */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={saving || !apiKey.trim()}
              className="w-full sm:w-auto px-7 py-2.5 sm:py-3 bg-[#1a73e8] hover:bg-[#1557b0] disabled:opacity-50 text-white font-medium rounded-lg text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save API Key</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
