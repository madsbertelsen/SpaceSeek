interface Photo {
  url: string;
}

interface Properties {
  color: string;
}

interface SubCategory {
  name: string;
  header_color: string;
  container_color: string;
  card_layout: 'vertical_waypoints' | 'vertical_routes' | 'horizontal';
  screens: { id: number }[];
}

interface Feature {
  //type: 'Feature';
  iconUrl: string;
  img: string;
  name: string;
  id: number;
  context_bounds: {
    min_lon: number;
    min_lat: number;
    max_lon: number;
    max_lat: number;
  };
  description: string;
  sub_categories: SubCategory[];
  photos: Photo[];
  bbox: number[];
  geometry: any;
}
