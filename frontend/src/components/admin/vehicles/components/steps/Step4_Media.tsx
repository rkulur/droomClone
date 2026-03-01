// Project router: <Routes> JSX in src/App.tsx
// Admin route: <Route path="/admin" element={canAccessAdmin ? <AdminPage /> : <Navigate to="/" replace />} />
// Admin component: src/components/admin/index.tsx

import { FileText, Star, UploadCloud, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "../../../ui/badge";
import { Input } from "../../../ui/input";
import { cn } from "../../../../lib/utils";
import { useListingStore } from "../../../../stores/useListingStore";
import FormSection from "../FormSection";

const MAX_SIZE_BYTES = 10 * 1024 * 1024;

const Step4_Media = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const reportInputRef = useRef<HTMLInputElement | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [hasValidated, setHasValidated] = useState(false);

  const images = useListingStore((state) => state.images);
  const videoUrl = useListingStore((state) => state.videoUrl);
  const video360Url = useListingStore((state) => state.video360Url);
  const inspectionReportUrl = useListingStore((state) => state.inspectionReportUrl);
  const addImage = useListingStore((state) => state.addImage);
  const removeImage = useListingStore((state) => state.removeImage);
  const setPrimaryImage = useListingStore((state) => state.setPrimaryImage);
  const setField = useListingStore((state) => state.setField);

  const processFiles = (files: FileList | File[]) => {
    Array.from(files).forEach((file) => {
      if (file.size > MAX_SIZE_BYTES) {
        return;
      }

      if (!["image/jpeg", "image/png"].includes(file.type)) {
        return;
      }

      const url = URL.createObjectURL(file);
      addImage({
        url,
        thumbnailUrl: url,
        isPrimary: images.length === 0,
      });
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      processFiles(event.target.files);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    if (event.dataTransfer.files?.length) {
      processFiles(event.dataTransfer.files);
    }
  };

  const handleReportSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) {
      return;
    }

    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    setField("inspectionReportUrl", url);
  };

  useEffect(() => {
    const handler = () => {
      setHasValidated(true);
    };

    window.addEventListener("listing-step-validate", handler);
    return () => {
      window.removeEventListener("listing-step-validate", handler);
    };
  }, []);

  return (
    <div>
      <FormSection title="Photos">
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
            images.length === 0 && hasValidated ? "border-destructive" : ""
          )}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <UploadCloud className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-sm font-medium">Drag photos here or click to upload</p>
          <p className="text-xs text-muted-foreground mt-1">JPEG or PNG - Max 10 MB - Up to 20 photos</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />

        {images.length === 0 && hasValidated ? (
          <p className="text-sm text-destructive mt-2">Upload at least one photo to continue.</p>
        ) : null}

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
          {images.map((image, index) => (
            <div
              key={`${image.url}-${index}`}
              className="relative group rounded-md overflow-hidden aspect-square border border-border"
            >
              <img src={image.url} alt={`vehicle-${index + 1}`} className="w-full h-full object-cover" />

              {image.isPrimary ? (
                <Badge className="absolute top-2 left-2 text-xs">Main</Badge>
              ) : null}

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setPrimaryImage(index)}
                  className={cn(
                    "rounded-full p-2 bg-white/90 text-black",
                    image.isPrimary ? "text-yellow-500" : ""
                  )}
                >
                  <Star className="h-4 w-4" fill={image.isPrimary ? "currentColor" : "none"} />
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="rounded-full p-2 bg-white/90 text-black"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-2">
          {images.length}/20 photos - Click ★ to set main photo
        </p>
      </FormSection>

      <FormSection title="Video Links (optional)">
        <div className="grid gap-4">
          <div>
            <label className="text-sm font-medium">Video URL</label>
            <Input
              placeholder="YouTube or Google Drive link"
              value={videoUrl}
              onChange={(event) => setField("videoUrl", event.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">360° URL</label>
            <Input
              placeholder="Link to 360-degree view"
              value={video360Url}
              onChange={(event) => setField("video360Url", event.target.value)}
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Inspection Report (optional)">
        {!inspectionReportUrl ? (
          <>
            <div
              className="border border-dashed border-border rounded-lg p-5 text-center cursor-pointer"
              onClick={() => reportInputRef.current?.click()}
            >
              <FileText className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Upload inspection report (PDF or image)</p>
            </div>
            <input
              ref={reportInputRef}
              type="file"
              accept="application/pdf,image/*"
              className="hidden"
              onChange={handleReportSelect}
            />
          </>
        ) : (
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5" />
            <Badge variant="secondary">Report uploaded</Badge>
            <button
              type="button"
              onClick={() => setField("inspectionReportUrl", "")}
              className="rounded-full p-1 hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </FormSection>
    </div>
  );
};

export default Step4_Media;
