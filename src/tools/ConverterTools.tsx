import React, { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Download, X, FileImage, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function DropZone({ onFiles, accept, multiple, children }: { onFiles: (files: File[]) => void; accept: string; multiple?: boolean; children: React.ReactNode }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
    if (files.length) onFiles(files);
  }, [onFiles]);

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`cursor-pointer border-2 border-dashed rounded-2xl p-8 text-center transition-all ${dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 bg-muted/10 hover:bg-primary/5"}`}
    >
      <input ref={inputRef} type="file" accept={accept} multiple={multiple} className="hidden" onChange={(e) => { if (e.target.files) onFiles(Array.from(e.target.files)); e.target.value = ""; }} />
      {children}
    </div>
  );
}

export function ImageToPdfConverter() {
  const { toast } = useToast();
  const [images, setImages] = useState<{ file: File; url: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const addImages = (files: File[]) => {
    const imageFiles = files.filter(f => f.type.startsWith("image/"));
    const newEntries = imageFiles.map(f => ({ file: f, url: URL.createObjectURL(f) }));
    setImages(prev => [...prev, ...newEntries]);
  };

  const removeImage = (idx: number) => {
    setImages(prev => {
      URL.revokeObjectURL(prev[idx].url);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const generatePdf = async () => {
    if (!images.length) {
      toast({ title: "No images added", description: "Please upload at least one image.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { jsPDF } = await import("jspdf");

      const loadImg = (src: string): Promise<HTMLImageElement> =>
        new Promise((res, rej) => {
          const img = new Image();
          img.onload = () => res(img);
          img.onerror = rej;
          img.src = src;
        });

      const firstImg = await loadImg(images[0].url);
      const isLandscape = firstImg.width > firstImg.height;
      const pdf = new jsPDF({ orientation: isLandscape ? "landscape" : "portrait", unit: "px", format: [firstImg.width, firstImg.height] });

      for (let i = 0; i < images.length; i++) {
        const img = await loadImg(images[i].url);
        if (i > 0) pdf.addPage([img.width, img.height], img.width > img.height ? "landscape" : "portrait");
        const fmt = images[i].file.type === "image/png" ? "PNG" : "JPEG";
        pdf.addImage(img, fmt, 0, 0, img.width, img.height);
      }

      pdf.save("smart-utility-hub.pdf");
      toast({ title: "PDF downloaded!", description: `${images.length} image(s) converted successfully.` });
    } catch (err) {
      toast({ title: "Conversion failed", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="border-0 shadow-lg shadow-black/5 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Image to PDF Converter</CardTitle>
          <CardDescription>Upload one or more images and download them as a single PDF</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <DropZone onFiles={addImages} accept="image/*" multiple>
            <FileImage className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
            <p className="font-semibold text-foreground mb-1">Drop images here or click to upload</p>
            <p className="text-sm text-muted-foreground">Supports JPG, PNG, WEBP, GIF</p>
          </DropZone>

          {images.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Uploaded Images ({images.length})</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border bg-muted/20 aspect-square">
                    <img src={img.url} alt={img.file.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="destructive" size="icon" className="h-8 w-8 rounded-full" onClick={() => removeImage(idx)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate">{idx + 1}. {img.file.name}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Each image becomes one page. Drag to reorder is not supported — upload in desired order.</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button onClick={generatePdf} disabled={loading || images.length === 0} className="flex-1 h-12 text-lg font-semibold rounded-xl gap-2">
              <Download className="h-5 w-5" />
              {loading ? "Generating PDF…" : `Convert to PDF (${images.length} image${images.length !== 1 ? "s" : ""})`}
            </Button>
            {images.length > 0 && (
              <Button variant="outline" onClick={() => setImages([])} className="h-12 rounded-xl px-4">Clear All</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ImageFormatConverter() {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [format, setFormat] = useState<"image/jpeg" | "image/png" | "image/webp">("image/png");
  const [quality, setQuality] = useState(0.92);
  const [loading, setLoading] = useState(false);
  const [convertedUrl, setConvertedUrl] = useState<string>("");
  const [convertedSize, setConvertedSize] = useState<string>("");

  const formatLabel: Record<string, string> = { "image/jpeg": "JPG", "image/png": "PNG", "image/webp": "WEBP" };
  const formatExt: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

  const handleFile = (files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setConvertedUrl("");
    setConvertedSize("");
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  };

  const convert = () => {
    if (!file) return;
    setLoading(true);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      if (format === "image/png") {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setConvertedUrl(url);
          setConvertedSize(`${(blob.size / 1024).toFixed(1)} KB`);
        }
        setLoading(false);
      }, format, quality);
    };
    img.src = preview;
  };

  const download = () => {
    if (!convertedUrl || !file) return;
    const a = document.createElement("a");
    a.href = convertedUrl;
    a.download = `${file.name.replace(/\.[^.]+$/, "")}.${formatExt[format]}`;
    a.click();
    toast({ title: "Image downloaded!", description: `Converted to ${formatLabel[format]} successfully.` });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="border-0 shadow-lg shadow-black/5 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Image Format Converter</CardTitle>
          <CardDescription>Convert images between JPG, PNG, and WEBP formats instantly</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <DropZone onFiles={handleFile} accept="image/*">
            <ImageIcon className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
            {file ? (
              <p className="font-semibold text-foreground">{file.name} <span className="text-muted-foreground font-normal">({(file.size / 1024).toFixed(1)} KB)</span></p>
            ) : (
              <>
                <p className="font-semibold text-foreground mb-1">Drop an image here or click to upload</p>
                <p className="text-sm text-muted-foreground">Supports JPG, PNG, WEBP</p>
              </>
            )}
          </DropZone>

          {preview && (
            <div className="grid md:grid-cols-2 gap-6 items-start">
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Original</Label>
                <div className="rounded-xl overflow-hidden border bg-muted/10">
                  <img src={preview} alt="original" className="w-full max-h-64 object-contain" />
                </div>
                {file && <p className="text-xs text-muted-foreground text-center">{file.type.split("/")[1].toUpperCase()} · {(file.size / 1024).toFixed(1)} KB</p>}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Convert to</Label>
                  <Select value={format} onValueChange={(v) => { setFormat(v as any); setConvertedUrl(""); }}>
                    <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image/jpeg">JPG (JPEG)</SelectItem>
                      <SelectItem value="image/png">PNG</SelectItem>
                      <SelectItem value="image/webp">WEBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {format !== "image/png" && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Quality</Label>
                      <span className="text-sm font-medium text-primary">{Math.round(quality * 100)}%</span>
                    </div>
                    <input type="range" min={10} max={100} value={Math.round(quality * 100)} onChange={(e) => setQuality(parseInt(e.target.value) / 100)} className="w-full accent-primary" />
                  </div>
                )}

                <Button onClick={convert} disabled={loading} className="w-full h-11 font-semibold rounded-xl gap-2">
                  {loading ? "Converting…" : `Convert to ${formatLabel[format]}`}
                </Button>

                {convertedUrl && (
                  <div className="animate-in fade-in duration-300 space-y-3">
                    <div className="rounded-xl overflow-hidden border bg-muted/10">
                      <img src={convertedUrl} alt="converted" className="w-full max-h-48 object-contain" />
                    </div>
                    <p className="text-xs text-muted-foreground text-center">{formatLabel[format]} · {convertedSize}</p>
                    <Button onClick={download} variant="outline" className="w-full h-11 rounded-xl gap-2 border-primary/30 text-primary hover:bg-primary/5">
                      <Download className="h-4 w-4" /> Download {formatLabel[format]}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
