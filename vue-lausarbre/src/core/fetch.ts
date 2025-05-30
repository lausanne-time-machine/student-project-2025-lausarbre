import type { RawDataframes, RawTrackingChain, GenealogyData } from '@/types';
import JSZip from 'jszip';


export async function fetchAndUnzip<T>(filename: string): Promise<T> {
    const response = await fetch(`/student-project-2025-lausarbre/${filename}.zip`);
    const blob = await response.blob();

    const arrayBuffer = await blob.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);

    // Find your JSON file (adjust the name as needed)
    const jsonFile = zip.file(`${filename}.json`);
    if (!jsonFile) throw new Error('data.json not found in ZIP');

    // Read it as a string and parse
    const jsonString = await jsonFile.async('string');
    return JSON.parse(jsonString) as T;
}

export async function fetchAndUnzipDataframes(): Promise<RawDataframes> {
    return fetchAndUnzip<RawDataframes>("dataframes")
}

export async function fetchAndUnzipTrackingChain(): Promise<RawTrackingChain> {
    return fetchAndUnzip<RawTrackingChain>("tracking_chains")
}

export async function fetchAndUnzipTrees(): Promise<GenealogyData> {
    return fetchAndUnzip<GenealogyData>("trees")
}


