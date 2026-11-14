import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { supabase } from '@/lib/supabase';
import type { GLBFile } from '@/types/index';

export async function exportSceneToGLB(
  scene: THREE.Scene,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const exporter = new GLTFExporter();
    exporter.parse(
      scene,
      (gltf) => {
        const blob = new Blob([gltf as BlobPart], { type: 'application/octet-stream' });
        resolve(blob);
      },
      (error) => reject(error),
      { binary: true },
    );
  });
}

export async function downloadBlob(blob: Blob, filename: string): Promise<void> {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function uploadGLBToStorage(
  projectId: string | null,
  file: File,
): Promise<{ path: string; url: string } | null> {
  if (!file) return null;
  const fileName = `${projectId ?? 'demo'}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
  const { error, data } = await supabase.storage.from('models').upload(fileName, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;
  const { data: urlData } = supabase.storage.from('models').getPublicUrl(fileName);
  return { path: fileName, url: urlData.publicUrl };
}

export async function listModels(): Promise<GLBFile[]> {
  const { data, error } = await supabase.from('models').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as GLBFile[];
}

export async function getModelUrl(path: string): Promise<string> {
  const { data } = supabase.storage.from('models').getPublicUrl(path);
  return data.publicUrl;
}
