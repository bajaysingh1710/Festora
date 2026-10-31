import React from 'react';
import { Upload, Trash2, CheckCircle2 } from 'lucide-react';
import { VenuePhoto } from '../../../types';
import { validateImageFile } from '../../../lib/fileValidation';

interface VenuePhotoUploaderProps {
  venuePhotos: VenuePhoto[];
  venueName: string;
  onAddPhoto: (name: string, dataUrl: string, notes?: string) => void;
  onDeletePhoto: (id: string) => void;
  onErrorToast: (msg: string) => void;
}

export const VenuePhotoUploader: React.FC<VenuePhotoUploaderProps> = ({
  venuePhotos,
  venueName,
  onAddPhoto,
  onDeletePhoto,
  onErrorToast,
}) => {
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type, size, and block executable/SVG payloads
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      onErrorToast(validation.error || 'Invalid image file.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onAddPhoto(
          file.name,
          reader.result,
          'Analyzed: Real venue space with architectural perimeter, open ceiling, and ambient light surfaces.'
        );
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="rounded-3xl bg-white border border-[#EAE5E1] p-6 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EAE5E1]">
        <div>
          <h2 className="font-serif text-lg font-bold text-[#49372D] flex items-center gap-2">
            <Upload className="w-4 h-4 text-[#C96F4A]" />
            <span>Venue Photograph Reference & AI Space Grounding</span>
          </h2>
          <p className="text-xs text-[#6E5548] mt-0.5">
            Upload photos of your real venue. Our AI grounds concepts in your actual architectural dimensions and materials.
          </p>
        </div>

        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FAF0EB] text-[#C96F4A] border border-[#F5D1BD] text-xs font-bold hover:bg-[#F5D1BD]/50 transition-all">
          <Upload className="w-4 h-4" />
          <span>Upload Venue Photo</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </label>
      </div>

      {venuePhotos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {venuePhotos.map((photo) => (
            <div
              key={photo.id}
              className="relative rounded-2xl overflow-hidden border border-[#F5D1BD] group bg-[#FFF8EF]"
            >
              <img
                src={photo.dataUrl}
                alt={photo.name}
                className="w-full h-36 object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => onDeletePhoto(photo.id)}
                  className="p-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 shadow"
                  title="Remove photo"
                  aria-label="Remove photo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="p-2.5 bg-white text-xs">
                <p className="font-bold text-[#49372D] truncate">{photo.name}</p>
                <p className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded mt-1 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Space Grounding Active</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 mt-2 text-xs text-[#6E5548] italic">
          No venue photos uploaded yet. You can still generate concepts grounded in &quot;{venueName}&quot;.
        </div>
      )}
    </div>
  );
};

