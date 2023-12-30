export interface Document {
  id: number;
  file: string;
  name: string;
  updated_at: string;
}

export interface DocumentsResponse {
  data: Document[];
}

export interface DocumentsFormProps {
  documents: Document[];
}
