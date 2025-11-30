import React, { useState, useRef } from 'react';
import { Upload, Wand2, Download, RefreshCcw, Image as ImageIcon, Sparkles, Loader2 } from 'lucide-react';
import { editStudentImage } from '../services/geminiService';

const PhotoStudio: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file.');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setSelectedImage(result);
        setMimeType(file.type);
        setGeneratedImage(null); // Reset generated image on new upload
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage || !prompt.trim() || !mimeType) return;

    setIsProcessing(true);
    setError(null);
    setGeneratedImage(null);

    try {
      // Extract base64 data without prefix (e.g., "data:image/png;base64,")
      const base64Data = selectedImage.split(',')[1];
      
      const resultBase64 = await editStudentImage(base64Data, mimeType, prompt);
      
      if (resultBase64) {
        // Construct valid data URL for the response
        // Note: Gemini response usually doesn't include mime prefix in the raw bytes, 
        // but we assume it matches input or is generically interpretable by browser if we prepend png/jpeg.
        // Usually the model returns PNG or JPEG. We'll try to detect or default to PNG.
        const resultDataUrl = `data:image/png;base64,${resultBase64}`;
        setGeneratedImage(resultDataUrl);
      } else {
        setError("Failed to generate image. Please try a different prompt.");
      }
    } catch (err) {
      setError("An error occurred while communicating with the AI service.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `edited-photo-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const suggestedPrompts = [
    "Make it look like a vintage 1920s headshot",
    "Add stage lighting in the background",
    "Turn the background into a theatre curtain",
    "Make the image black and white with high contrast",
    "Add a subtle spotlight effect"
  ];

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            <Sparkles className="text-indigo-600 mr-2" />
            AI Photo Studio
          </h2>
          <p className="text-slate-500 mt-1">Edit student headshots and performance photos using Gemini 2.5 AI.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow">
        {/* Left Panel: Controls */}
        <div className="lg:col-span-1 space-y-6">
          {/* Upload Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center">
              <Upload size={18} className="mr-2 text-slate-500" />
              1. Upload Photo
            </h3>
            
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden" 
              accept="image/*"
              onChange={handleImageUpload}
            />
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-slate-300 rounded-lg p-8 flex flex-col items-center justify-center text-slate-500 hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-white transition-colors">
                <ImageIcon className="text-slate-400 group-hover:text-indigo-500" />
              </div>
              <span className="text-sm font-medium">Click to upload photo</span>
              <span className="text-xs mt-1 text-slate-400">JPG, PNG supported</span>
            </button>
          </div>

          {/* Prompt Section */}
          <div className={`bg-white p-6 rounded-xl shadow-sm border border-slate-100 transition-opacity ${!selectedImage ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center">
              <Wand2 size={18} className="mr-2 text-slate-500" />
              2. Describe Edits
            </h3>
            
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., 'Change background to a starry night' or 'Make it look like a pencil sketch'"
              className="w-full h-32 p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
            />
            
            <div className="mt-4">
              <p className="text-xs font-semibold text-slate-500 mb-2">TRY THESE PROMPTS:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((p, i) => (
                  <button 
                    key={i}
                    onClick={() => setPrompt(p)}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-md transition-colors text-left"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isProcessing || !prompt.trim()}
              className={`w-full mt-6 flex items-center justify-center py-3 rounded-lg font-medium text-white transition-all
                ${isProcessing || !prompt.trim() 
                  ? 'bg-slate-300 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:scale-[1.02]'}`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2" size={18} />
                  Generate Edits
                </>
              )}
            </button>
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Preview */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex-grow flex flex-col">
             <div className="flex justify-between items-center mb-4">
               <h3 className="font-semibold text-slate-800">Preview Studio</h3>
               {generatedImage && (
                 <button 
                   onClick={handleDownload}
                   className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                 >
                   <Download size={16} />
                   <span>Download Result</span>
                 </button>
               )}
             </div>

             <div className="flex-grow bg-slate-50 rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center relative overflow-hidden min-h-[400px]">
                {!selectedImage ? (
                  <div className="text-center p-8">
                    <div className="mx-auto w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4 text-slate-400">
                      <ImageIcon size={32} />
                    </div>
                    <p className="text-slate-500 font-medium">No image selected</p>
                    <p className="text-slate-400 text-sm mt-1">Upload a photo to start editing</p>
                  </div>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center p-4 gap-4">
                     {/* Comparison view if generated */}
                     {generatedImage ? (
                       <div className="grid grid-cols-2 gap-4 w-full h-full">
                         <div className="relative group rounded-lg overflow-hidden border border-slate-200 bg-white">
                           <span className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm z-10">Original</span>
                           <img src={selectedImage} alt="Original" className="w-full h-full object-contain" />
                         </div>
                         <div className="relative group rounded-lg overflow-hidden border-2 border-indigo-500 shadow-md bg-white">
                           <span className="absolute top-2 left-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded backdrop-blur-sm z-10">AI Edited</span>
                           <img src={generatedImage} alt="Generated" className="w-full h-full object-contain" />
                         </div>
                       </div>
                     ) : (
                       <div className="relative max-w-full max-h-full">
                          <img src={selectedImage} alt="Preview" className="max-w-full max-h-[500px] object-contain rounded-lg shadow-sm" />
                          {isProcessing && (
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-lg z-20">
                              <div className="text-center">
                                <Loader2 className="animate-spin text-indigo-600 w-12 h-12 mx-auto mb-3" />
                                <p className="text-indigo-900 font-medium animate-pulse">Gemini is working its magic...</p>
                              </div>
                            </div>
                          )}
                       </div>
                     )}
                  </div>
                )}
             </div>
             
             {generatedImage && (
               <div className="mt-4 flex justify-end">
                  <button 
                    onClick={() => {
                      setGeneratedImage(null);
                      setPrompt('');
                    }}
                    className="flex items-center space-x-2 text-slate-500 hover:text-slate-700 text-sm"
                  >
                    <RefreshCcw size={14} />
                    <span>Reset</span>
                  </button>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoStudio;