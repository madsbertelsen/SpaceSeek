interface Photo {
  url: string;
}

interface Properties {
  color: string;
}

interface Feature {
  type: 'Feature';
  name: string;
  id: number;
  description: string;
  photos: Photo[];
}
